#!/bin/bash
# Exécuté sur l'instance EC2 (en root, via SSM Run Command) par le workflow
# GitHub « Deploy Storybook to AWS ».
#
#   deploy.sh <image ECR complète, ex. 123….dkr.ecr.eu-west-3.amazonaws.com/gs-components-library-storybook:sha>
#
# Les secrets sont lus dans SSM Parameter Store (/gs-components-library/*) et
# écrits dans .env (mode 600), lu par docker compose. Rien n'est affiché.
set -euo pipefail

IMAGE="${1:?image manquante}"
REGION="eu-west-3"
PARAM_PATH="/gs-components-library"
DIR="/opt/gs-storybook"
REQUIRED="DOMAIN OIDC_ISSUER_URL JUMPCLOUD_CLIENT_ID JUMPCLOUD_CLIENT_SECRET OAUTH2_COOKIE_SECRET MCP_TOKEN_SIGNING_SECRET"

cd "$DIR"
umask 077

# Paramètres SSM → .env : /gs-components-library/jumpcloud-client-id → JUMPCLOUD_CLIENT_ID
aws ssm get-parameters-by-path --region "$REGION" --path "$PARAM_PATH" --with-decryption \
  --query 'Parameters[].[Name,Value]' --output json |
  IMAGE="$IMAGE" REQUIRED="$REQUIRED" python3 -c '
import json, os, sys
params = {name.rsplit("/", 1)[-1].upper().replace("-", "_"): value for name, value in json.load(sys.stdin)}
params["STORYBOOK_IMAGE"] = os.environ["IMAGE"]
missing = [k for k in os.environ["REQUIRED"].split() if not params.get(k)]
if missing:
    sys.exit("Paramètres SSM manquants : " + ", ".join(missing))
bad = [k for k, v in params.items() if "\x27" in v or "\n" in v]
if bad:
    sys.exit("Valeurs non supportées (apostrophe ou retour à la ligne) : " + ", ".join(bad))
with open(".env.new", "w") as f:
    for k, v in sorted(params.items()):
        f.write(f"{k}=\x27{v}\x27\n")
'
mv .env.new .env

REGISTRY="${IMAGE%%/*}"
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$REGISTRY" >/dev/null

docker compose pull --quiet
docker compose up -d --remove-orphans --wait --wait-timeout 300
docker image prune -af --filter "until=72h" >/dev/null || true
docker compose ps --format 'table {{.Service}}\t{{.Status}}'
