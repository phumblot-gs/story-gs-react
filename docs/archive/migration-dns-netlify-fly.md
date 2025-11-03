# Guide de migration DNS : Netlify → Fly.io

## Vue d'ensemble

Ce guide explique comment migrer le domaine `gs-components-library.grand-shooting.org` de Netlify vers Fly.io.

## Prérequis

- Accès à l'administration DNS chez OVH
- Application Fly.io déployée et fonctionnelle
- Fly CLI installé et authentifié

## Étapes de migration

### Étape 1 : Vérifier l'application Fly.io

```bash
# Vérifier que l'application est déployée et fonctionne
flyctl status

# Vérifier l'URL actuelle
flyctl open
```

L'URL actuelle devrait être : `https://storybook-gs-components.fly.dev`

### Étape 2 : Ajouter le certificat SSL pour le domaine personnalisé

```bash
flyctl certs add gs-components-library.grand-shooting.org
```

Cette commande va :
- Créer un certificat SSL pour votre domaine
- Vous donner les instructions DNS à configurer chez OVH

**Important** : Notez les valeurs DNS fournies par Fly.io. Elles ressembleront à :
```
Type: A
Name: gs-components-library.grand-shooting.org
Value: [une adresse IP Fly.io]

Type: AAAA
Name: gs-components-library.grand-shooting.org
Value: [une adresse IPv6 Fly.io]
```

### Étape 3 : Configurer les DNS chez OVH

1. **Se connecter à OVH** : https://www.ovh.com/manager/web/
2. **Aller dans la section DNS** de votre domaine `grand-shooting.org`
3. **Modifier l'enregistrement** pour `gs-components-library` :

#### Option A : Supprimer l'ancien enregistrement Netlify et ajouter les nouveaux

1. Supprimer ou modifier l'enregistrement CNAME existant qui pointe vers Netlify
2. Ajouter les nouveaux enregistrements fournis par Fly.io :
   - **Type A** : Pointant vers l'IP IPv4 fournie par Fly.io
   - **Type AAAA** : Pointant vers l'IP IPv6 fournie par Fly.io (si disponible)

#### Option B : Utiliser un CNAME (recommandé)

Si Fly.io fournit un CNAME au lieu d'IPs fixes, vous pouvez utiliser :

```
Type: CNAME
Name: gs-components-library
Target: storybook-gs-components.fly.dev
TTL: 3600 (ou la valeur recommandée)
```

**Note** : Certains providers DNS (comme OVH) peuvent ne pas supporter les CNAME à la racine. Dans ce cas, utilisez les enregistrements A/AAAA fournis par Fly.io.

### Étape 4 : Vérifier la propagation DNS

```bash
# Vérifier que les DNS pointent vers Fly.io
dig gs-components-library.grand-shooting.org

# Ou avec nslookup
nslookup gs-components-library.grand-shooting.org
```

Attendez quelques minutes pour la propagation DNS (peut prendre jusqu'à 24h, mais généralement quelques minutes).

### Étape 5 : Vérifier le certificat SSL

Une fois les DNS propagés, vérifiez que le certificat SSL est actif :

```bash
# Vérifier le statut du certificat
flyctl certs list

# Vérifier que le certificat est valide
flyctl certs show gs-components-library.grand-shooting.org
```

### Étape 6 : Tester l'accès

```bash
# Tester l'accès au domaine
curl -I https://gs-components-library.grand-shooting.org

# Ou ouvrir dans le navigateur
open https://gs-components-library.grand-shooting.org
```

### Étape 7 : Désactiver Netlify (optionnel)

Une fois que tout fonctionne correctement sur Fly.io :

1. Aller sur Netlify Dashboard
2. Sélectionner le projet `gs-components-library.grand-shooting.org`
3. Aller dans les paramètres
4. Désactiver les builds automatiques ou supprimer le projet

## Dépannage

### Le certificat ne se génère pas

```bash
# Vérifier que les DNS pointent bien vers Fly.io
dig gs-components-library.grand-shooting.org

# Réessayer l'ajout du certificat
flyctl certs add gs-components-library.grand-shooting.org
```

### Erreur de résolution DNS

- Vérifier que les enregistrements DNS sont corrects chez OVH
- Attendre la propagation DNS (peut prendre jusqu'à 24h)
- Vérifier avec `dig` ou `nslookup`

### Le site ne charge pas

```bash
# Vérifier les logs Fly.io
flyctl logs

# Vérifier le statut de l'application
flyctl status

# Vérifier les machines
flyctl machine list
```

## Notes importantes

- **Durée de propagation DNS** : Généralement 5-15 minutes, mais peut prendre jusqu'à 24h
- **Downtime** : Il peut y avoir un court downtime pendant la migration si vous supprimez l'ancien enregistrement avant que le nouveau soit propagé
- **HTTPS** : Fly.io génère automatiquement un certificat SSL Let's Encrypt une fois les DNS configurés
- **Monitoring** : Surveillez les logs Fly.io après la migration pour détecter d'éventuels problèmes

## Vérification finale

Une fois la migration terminée, vérifiez :

- ✅ Le domaine fonctionne : `https://gs-components-library.grand-shooting.org`
- ✅ Le serveur MCP fonctionne : `https://gs-components-library.grand-shooting.org/mcp`
- ✅ Le certificat SSL est valide (cadenas vert dans le navigateur)
- ✅ Les logs Fly.io ne montrent pas d'erreurs

