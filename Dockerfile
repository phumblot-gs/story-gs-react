FROM node:20-alpine

WORKDIR /app

# Installer les outils nécessaires
RUN apk add --no-cache git

# Configurer npm pour utiliser le registry public npmjs.org par défaut
RUN npm config set registry https://registry.npmjs.org/

# Configurer l'authentification Nexus pour les packages @gs
# Le secret NPM_NEXUS_AUTH sera passé via Fly.io secrets (build args)
ARG NPM_NEXUS_AUTH
RUN if [ -n "$NPM_NEXUS_AUTH" ]; then \
      echo "@gs:registry=https://nexus.grand-shooting.org/repository/npm-gs/" >> ~/.npmrc && \
      echo "//nexus.grand-shooting.org/repository/npm-gs/:_auth=$NPM_NEXUS_AUTH" >> ~/.npmrc && \
      echo "✅ Configuration Nexus ajoutée"; \
    else \
      echo "⚠️ NPM_NEXUS_AUTH non défini, Nexus ne sera pas utilisé"; \
    fi

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (y compris devDependencies pour Storybook)
# Limiter la mémoire utilisée par npm pour éviter les problèmes d'OOM
RUN npm ci --production=false --prefer-offline --no-audit

# Copier le reste du code
COPY . .

# Appliquer le patch pour MCP
RUN npm run postinstall || true

# Exposer le port
EXPOSE 8080

# Commande pour démarrer Storybook en mode serveur
# Limiter la mémoire Node.js pour éviter les problèmes d'OOM (768MB sur 1GB total)
# --no-open : Empêche Storybook d'essayer d'ouvrir un navigateur (non disponible dans Docker)
CMD ["node", "--max-old-space-size=768", "node_modules/.bin/storybook", "dev", "-p", "8080", "--host", "0.0.0.0", "--no-open"]
