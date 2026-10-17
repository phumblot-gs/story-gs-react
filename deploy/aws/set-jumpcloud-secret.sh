#!/bin/bash
# Enregistre l'identifiant et le secret de l'application OIDC JumpCloud dans
# SSM Parameter Store. Saisie masquée : rien dans l'historique ni à l'écran.
#
#   deploy/aws/set-jumpcloud-secret.sh
set -euo pipefail

REGION="eu-west-3"
NAME="gs-components-library"

read -rp "Client ID JumpCloud : " CLIENT_ID
read -rsp "Client secret JumpCloud (masqué) : " CLIENT_SECRET
echo
[ -n "$CLIENT_ID" ] && [ -n "$CLIENT_SECRET" ] || { echo "Valeurs vides, abandon." >&2; exit 1; }

aws ssm put-parameter --region "$REGION" --overwrite --name "/$NAME/jumpcloud-client-id" --type String \
  --value "file://"<(printf '%s' "$CLIENT_ID") >/dev/null
aws ssm put-parameter --region "$REGION" --overwrite --name "/$NAME/jumpcloud-client-secret" --type SecureString \
  --value "file://"<(printf '%s' "$CLIENT_SECRET") >/dev/null
unset CLIENT_SECRET
echo "Enregistré dans /$NAME/jumpcloud-client-id et /$NAME/jumpcloud-client-secret."
