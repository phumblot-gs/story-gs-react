#!/bin/bash
# Crée (ou complète) l'infrastructure AWS du Storybook, région Paris.
# Idempotent : relançable sans dupliquer les ressources.
#
#   DOMAIN=gs-components-library.grand-shooting.org deploy/aws/provision.sh
#
# Ressources (toutes taguées Project=gs-components-library) :
#   - ECR      gs-components-library-storybook
#   - IAM      gs-components-library-ec2 (rôle + profil d'instance)
#              gs-components-library-github-deploy (rôle assumé par GitHub Actions via OIDC)
#   - EC2      t4g.small Amazon Linux 2023, groupe de sécurité 80/443 seulement (pas de SSH, accès SSM)
#   - EIP      IP publique fixe (cible du DNS chez OVH)
#   - SSM      /gs-components-library/* (secrets générés ici, JumpCloud via set-jumpcloud-secret.sh)
set -euo pipefail

REGION="eu-west-3"
NAME="gs-components-library"
REPO_GITHUB="phumblot-gs/story-gs-react"
BRANCH="latest"
INSTANCE_TYPE="t4g.small"
DOMAIN="${DOMAIN:-gs-components-library.grand-shooting.org}"
OIDC_ISSUER_URL="https://oauth.id.jumpcloud.com/"
TAGS="Key=Project,Value=$NAME"
HERE="$(cd "$(dirname "$0")" && pwd)"

export AWS_REGION="$REGION" AWS_DEFAULT_REGION="$REGION"
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
log() { printf '\n== %s\n' "$*"; }

# --- ECR ---------------------------------------------------------------------
log "ECR"
ECR_REPO="$NAME-storybook"
if ! aws ecr describe-repositories --repository-names "$ECR_REPO" >/dev/null 2>&1; then
  aws ecr create-repository --repository-name "$ECR_REPO" \
    --image-scanning-configuration scanOnPush=true --encryption-configuration encryptionType=AES256 \
    --tags "$TAGS" >/dev/null
fi
aws ecr put-lifecycle-policy --repository-name "$ECR_REPO" --lifecycle-policy-text '{
  "rules": [{ "rulePriority": 1, "description": "Garder les 10 dernières images",
    "selection": { "tagStatus": "any", "countType": "imageCountMoreThan", "countNumber": 10 },
    "action": { "type": "expire" } }]
}' >/dev/null
ECR_REPO_ARN="arn:aws:ecr:$REGION:$ACCOUNT_ID:repository/$ECR_REPO"

# --- Rôle de l'instance ------------------------------------------------------
log "IAM : rôle de l'instance"
EC2_ROLE="$NAME-ec2"
if ! aws iam get-role --role-name "$EC2_ROLE" >/dev/null 2>&1; then
  aws iam create-role --role-name "$EC2_ROLE" --tags "$TAGS" \
    --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"},"Action":"sts:AssumeRole"}]}' >/dev/null
fi
aws iam attach-role-policy --role-name "$EC2_ROLE" --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
aws iam put-role-policy --role-name "$EC2_ROLE" --policy-name runtime --policy-document "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [
    { \"Effect\": \"Allow\", \"Action\": \"ssm:GetParametersByPath\",
      \"Resource\": \"arn:aws:ssm:$REGION:$ACCOUNT_ID:parameter/$NAME\" },
    { \"Effect\": \"Allow\", \"Action\": \"ecr:GetAuthorizationToken\", \"Resource\": \"*\" },
    { \"Effect\": \"Allow\", \"Action\": [\"ecr:BatchGetImage\", \"ecr:GetDownloadUrlForLayer\", \"ecr:BatchCheckLayerAvailability\"],
      \"Resource\": \"$ECR_REPO_ARN\" }
  ]
}"
if ! aws iam get-instance-profile --instance-profile-name "$EC2_ROLE" >/dev/null 2>&1; then
  aws iam create-instance-profile --instance-profile-name "$EC2_ROLE" --tags "$TAGS" >/dev/null
  aws iam add-role-to-instance-profile --instance-profile-name "$EC2_ROLE" --role-name "$EC2_ROLE"
  sleep 10 # propagation IAM avant run-instances
fi

# --- Groupe de sécurité ------------------------------------------------------
log "Groupe de sécurité"
VPC_ID="$(aws ec2 describe-vpcs --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)"
SG_NAME="$NAME-web"
SG_ID="$(aws ec2 describe-security-groups --filters Name=group-name,Values="$SG_NAME" Name=vpc-id,Values="$VPC_ID" \
  --query 'SecurityGroups[0].GroupId' --output text)"
if [ "$SG_ID" = "None" ]; then
  SG_ID="$(aws ec2 create-security-group --group-name "$SG_NAME" --vpc-id "$VPC_ID" \
    --description "Storybook GS components: HTTP/HTTPS only" \
    --tag-specifications "ResourceType=security-group,Tags=[{$TAGS},{Key=Name,Value=$SG_NAME}]" \
    --query GroupId --output text)"
  aws ec2 authorize-security-group-ingress --group-id "$SG_ID" --ip-permissions \
    'IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges=[{CidrIp=0.0.0.0/0}],Ipv6Ranges=[{CidrIpv6=::/0}]' \
    'IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges=[{CidrIp=0.0.0.0/0}],Ipv6Ranges=[{CidrIpv6=::/0}]' \
    'IpProtocol=udp,FromPort=443,ToPort=443,IpRanges=[{CidrIp=0.0.0.0/0}],Ipv6Ranges=[{CidrIpv6=::/0}]' >/dev/null
fi

# --- Instance ----------------------------------------------------------------
log "Instance EC2"
INSTANCE_ID="$(aws ec2 describe-instances \
  --filters Name=tag:Name,Values="$NAME-storybook" Name=instance-state-name,Values=pending,running,stopping,stopped \
  --query 'Reservations[0].Instances[0].InstanceId' --output text)"
if [ "$INSTANCE_ID" = "None" ]; then
  AMI_ID="$(aws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64 \
    --query Parameter.Value --output text)"
  SUBNET_ID="$(aws ec2 describe-subnets --filters Name=vpc-id,Values="$VPC_ID" Name=availability-zone,Values="${REGION}a" \
    --query 'Subnets[0].SubnetId' --output text)"
  INSTANCE_ID="$(aws ec2 run-instances --image-id "$AMI_ID" --instance-type "$INSTANCE_TYPE" \
    --subnet-id "$SUBNET_ID" --security-group-ids "$SG_ID" --associate-public-ip-address \
    --iam-instance-profile Name="$EC2_ROLE" \
    --metadata-options HttpTokens=required,HttpEndpoint=enabled,HttpPutResponseHopLimit=1 \
    --block-device-mappings 'DeviceName=/dev/xvda,Ebs={VolumeSize=30,VolumeType=gp3,Encrypted=true,DeleteOnTermination=true}' \
    --credit-specification CpuCredits=unlimited \
    --user-data "file://$HERE/user-data.sh" \
    --tag-specifications "ResourceType=instance,Tags=[{$TAGS},{Key=Name,Value=$NAME-storybook}]" \
                         "ResourceType=volume,Tags=[{$TAGS},{Key=Name,Value=$NAME-storybook}]" \
    --query 'Instances[0].InstanceId' --output text)"
  aws ec2 wait instance-running --instance-ids "$INSTANCE_ID"
fi
aws ec2 modify-instance-attribute --instance-id "$INSTANCE_ID" --disable-api-termination

# --- IP fixe -----------------------------------------------------------------
log "Elastic IP"
ALLOC_ID="$(aws ec2 describe-addresses --filters Name=tag:Name,Values="$NAME-storybook" --query 'Addresses[0].AllocationId' --output text)"
if [ "$ALLOC_ID" = "None" ]; then
  ALLOC_ID="$(aws ec2 allocate-address --domain vpc \
    --tag-specifications "ResourceType=elastic-ip,Tags=[{$TAGS},{Key=Name,Value=$NAME-storybook}]" \
    --query AllocationId --output text)"
fi
aws ec2 associate-address --allocation-id "$ALLOC_ID" --instance-id "$INSTANCE_ID" --allow-reassociation >/dev/null
PUBLIC_IP="$(aws ec2 describe-addresses --allocation-ids "$ALLOC_ID" --query 'Addresses[0].PublicIp' --output text)"

# --- Paramètres SSM ----------------------------------------------------------
log "SSM Parameter Store"
put_if_absent() { # nom type valeur-ou-commande
  local name="/$NAME/$1" type="$2"
  if ! aws ssm get-parameter --name "$name" >/dev/null 2>&1; then
    # Valeur passée par un descripteur de fichier : jamais dans la ligne de commande ni affichée.
    aws ssm put-parameter --name "$name" --type "$type" --tags "$TAGS" --value "file://"<(printf '%s' "$3") >/dev/null
    echo "créé : $name"
  else
    echo "existe : $name"
  fi
}
put_if_absent domain String "$DOMAIN"
put_if_absent oidc-issuer-url String "$OIDC_ISSUER_URL"
put_if_absent oauth2-cookie-secret SecureString "$(openssl rand -base64 32 | tr -- '+/' '-_' | tr -d '\n')"
put_if_absent mcp-token-signing-secret SecureString "$(openssl rand -base64 48 | tr -d '\n=')"

# --- Rôle de déploiement GitHub Actions --------------------------------------
log "IAM : rôle de déploiement GitHub"
DEPLOY_ROLE="$NAME-github-deploy"
OIDC_PROVIDER_ARN="arn:aws:iam::$ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
TRUST="{
  \"Version\": \"2012-10-17\",
  \"Statement\": [{
    \"Effect\": \"Allow\",
    \"Principal\": { \"Federated\": \"$OIDC_PROVIDER_ARN\" },
    \"Action\": \"sts:AssumeRoleWithWebIdentity\",
    \"Condition\": {
      \"StringEquals\": {
        \"token.actions.githubusercontent.com:aud\": \"sts.amazonaws.com\",
        \"token.actions.githubusercontent.com:sub\": \"repo:$REPO_GITHUB:ref:refs/heads/$BRANCH\"
      }
    }
  }]
}"
if ! aws iam get-role --role-name "$DEPLOY_ROLE" >/dev/null 2>&1; then
  aws iam create-role --role-name "$DEPLOY_ROLE" --tags "$TAGS" --assume-role-policy-document "$TRUST" >/dev/null
else
  aws iam update-assume-role-policy --role-name "$DEPLOY_ROLE" --policy-document "$TRUST"
fi
aws iam put-role-policy --role-name "$DEPLOY_ROLE" --policy-name deploy --policy-document "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [
    { \"Effect\": \"Allow\", \"Action\": \"ecr:GetAuthorizationToken\", \"Resource\": \"*\" },
    { \"Effect\": \"Allow\", \"Resource\": \"$ECR_REPO_ARN\", \"Action\": [
        \"ecr:BatchCheckLayerAvailability\", \"ecr:BatchGetImage\", \"ecr:GetDownloadUrlForLayer\",
        \"ecr:InitiateLayerUpload\", \"ecr:UploadLayerPart\", \"ecr:CompleteLayerUpload\", \"ecr:PutImage\" ] },
    { \"Effect\": \"Allow\", \"Action\": \"ssm:SendCommand\", \"Resource\": [
        \"arn:aws:ssm:$REGION::document/AWS-RunShellScript\",
        \"arn:aws:ec2:$REGION:$ACCOUNT_ID:instance/$INSTANCE_ID\" ] },
    { \"Effect\": \"Allow\", \"Action\": \"ssm:GetCommandInvocation\", \"Resource\": \"*\" }
  ]
}"

log "Terminé"
echo "Instance       : $INSTANCE_ID ($INSTANCE_TYPE)"
echo "IP publique    : $PUBLIC_IP"
echo "Rôle GitHub    : $DEPLOY_ROLE"
echo "Image ECR      : $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPO"
