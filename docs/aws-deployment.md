# Déploiement Storybook sur AWS

Storybook (avec le serveur MCP) tourne sur une instance EC2 à Paris, derrière
une authentification JumpCloud.

**URL :** https://gs-components-library.grand-shooting.org
**MCP :** https://gs-components-library.grand-shooting.org/mcp

## Architecture

```
Internet → Caddy (HTTPS Let's Encrypt) ─┬─ /mcp, OAuth MCP → mcp-auth-proxy → Storybook /mcp
                                        └─ tout le reste   → oauth2-proxy   → Storybook
```

- **EC2** `t4g.small` (2 vCPU ARM, 2 Go + 2 Go de swap), Amazon Linux 2023,
  région `eu-west-3`, IP fixe `35.181.82.70` (enregistrement A chez OVH).
  Ports 80/443 seulement : pas de SSH, l'administration passe par SSM.
- **Conteneurs** (`deploy/aws/docker-compose.yml`) : `storybook`
  (`storybook dev`, nécessaire pour l'addon MCP), `caddy`, `oauth2-proxy`,
  `mcp-auth-proxy`, `redis`.
- **Authentification** : une application OIDC JumpCloud. L'accès se règle en
  assignant des groupes d'utilisateurs à cette application.
  - Navigateur : `oauth2-proxy`, session par cookie.
  - Clients MCP : `mcp-auth-proxy`, serveur OAuth 2.1 avec enregistrement
    dynamique des clients, qui délègue la connexion à JumpCloud. Chaque
    utilisateur s'authentifie une fois depuis son client MCP.
- **Secrets** : SSM Parameter Store, `/gs-components-library/*`. Lus par
  l'instance au déploiement, jamais dans le dépôt ni dans les logs.

## Déploiement

Automatique à chaque push sur `latest` (`.github/workflows/deploy-aws.yml`) :

1. GitHub obtient un rôle AWS temporaire par OIDC (pas de clé stockée),
   limité à la branche `latest`.
2. L'image arm64 est construite et poussée dans ECR
   (`gs-components-library-storybook`). L'authentification Nexus est passée
   en secret de build, absente de l'image.
3. SSM Run Command exécute `deploy/aws/deploy.sh` sur l'instance : lecture des
   secrets, `docker compose pull` et `up`.

Le déploiement coupe le Storybook une à deux minutes (une seule instance).

Secrets du dépôt GitHub : `AWS_DEPLOY_ROLE_ARN`, `AWS_INSTANCE_ID`,
`NPM_NEXUS_AUTH`. Variable : `AWS_DEPLOY_ENABLED=true` (désactive les
déploiements automatiques si retirée).

## Administration

Prérequis : AWS CLI et le [plugin Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html).

```bash
# Shell sur l'instance
aws ssm start-session --region eu-west-3 --target <instance-id>

# Puis, sur l'instance
sudo -i
cd /opt/gs-storybook
docker compose ps
docker compose logs -f storybook        # ou caddy, oauth2-proxy, mcp-auth-proxy
docker compose restart storybook
free -m
```

L'identifiant de l'instance : `aws ec2 describe-instances --region eu-west-3
--filters Name=tag:Name,Values=gs-components-library-storybook
--query 'Reservations[].Instances[].InstanceId' --output text`.

## Opérations courantes

- **Changer les identifiants JumpCloud** : `deploy/aws/set-jumpcloud-secret.sh`
  (saisie masquée), puis relancer le dernier déploiement.
- **Recréer l'infrastructure** : `deploy/aws/provision.sh` (idempotent).
- **Changer de taille d'instance** : arrêter l'instance, modifier son type,
  la redémarrer (environ 2 minutes de coupure). L'IP fixe est conservée.
- **Certificat** : obtenu et renouvelé automatiquement par Caddy
  (validation HTTP, aucun enregistrement DNS supplémentaire).

## Coût

Environ 20 $/mois à la demande (instance, disque de 30 Go, IPv4). Environ
15 $/mois avec un engagement d'un an (Savings Plan ou Reserved Instance).
