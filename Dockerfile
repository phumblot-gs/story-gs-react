# syntax=docker/dockerfile:1
FROM node:22-alpine

WORKDIR /app

# Installer les outils nécessaires
RUN apk add --no-cache git

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances (y compris devDependencies pour Storybook).
# L'authentification Nexus (certains paquets du lockfile en viennent) est
# passée en secret de build : montée le temps de cette commande seulement,
# elle n'est écrite dans aucune couche de l'image.
#   docker build --secret id=NPM_NEXUS_AUTH,env=NPM_NEXUS_AUTH .
RUN --mount=type=secret,id=NPM_NEXUS_AUTH \
    printf 'registry=https://registry.npmjs.org/\n' > /tmp/npmrc && \
    if [ -s /run/secrets/NPM_NEXUS_AUTH ]; then \
      printf '@gs:registry=https://nexus.grand-shooting.org/repository/npm-gs/\n//nexus.grand-shooting.org/:_auth=%s\n' \
        "$(cat /run/secrets/NPM_NEXUS_AUTH)" >> /tmp/npmrc; \
    fi && \
    npm install --userconfig /tmp/npmrc --production=false --prefer-offline --no-audit; \
    status=$?; rm -f /tmp/npmrc; exit $status

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 8080

# Commande pour démarrer Storybook en mode serveur
# Limiter la mémoire Node.js pour éviter les problèmes d'OOM (768MB sur 1GB total)
# --no-open : Empêche Storybook d'essayer d'ouvrir un navigateur (non disponible dans Docker)
CMD ["node", "--max-old-space-size=768", "node_modules/.bin/storybook", "dev", "-p", "8080", "--host", "0.0.0.0", "--no-open"]
