#!/bin/bash
# Premier démarrage de l'instance (Amazon Linux 2023, arm64) : Docker,
# Compose, swap et rotation des logs. Le reste arrive au premier déploiement.
set -euxo pipefail

dnf install -y docker
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<'EOF'
{ "log-driver": "json-file", "log-opts": { "max-size": "10m", "max-file": "3" } }
EOF
systemctl enable --now docker

mkdir -p /usr/local/lib/docker/cli-plugins
curl -fsSL -o /usr/local/lib/docker/cli-plugins/docker-compose \
  https://github.com/docker/compose/releases/download/v5.6.0/docker-compose-linux-aarch64
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# 2 Go de swap : marge pour les pics de Storybook (compilation esbuild).
if [ ! -f /swapfile ]; then
  dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  echo '/swapfile none swap defaults 0 0' >> /etc/fstab
fi
swapon -a
sysctl -w vm.swappiness=10
echo 'vm.swappiness=10' > /etc/sysctl.d/90-swappiness.conf

mkdir -p /opt/gs-storybook
chmod 700 /opt/gs-storybook
