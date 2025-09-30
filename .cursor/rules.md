# Règles de Développement - story-gs-react

## Projet Courant
**story-gs-react**
- Path: /Users/phf/story-gs-react
- Git Repository: ✅

## Feature Actuelle
**CC01 - User Access**
- Status: Review
- Module: GS Connect Catalog
- Plans: N/A
- User Rights: N/A

## Standards de Code Obligatoires
Tous les fichiers créés ou modifiés doivent avoir un header :

```typescript
/**
 * NOTION FEATURES: CC01
 * MODULES: GS Connect Catalog
 * DESCRIPTION: [Description du rôle du fichier]
 * LAST_SYNC: 2025-06-27
 */
```

## Architecture du Module
Services pour la gestion des catalogues

## Documentation de la Feature
📋 Vue d'ensemble

L'accès au module Connect Catalog (CC) est réservé à des utilisateurs dont l'adresse email appartient au domaine @grand-shooting.com. Exemple: charles@grand-shooting.com

L'authentification est déléguée à Supabase. Seul le provider Google est activé.
Chaque environnement (develop, staging, prod) accède à un projet Supabase distinct.

🎯 Objectifs

📖 Description détaillée

Contexte

La gestion des données catalogue est un service critique. Pour le moment il est réservé aux membres de l'équipe Grand Shooting. Peut-être que plus tard le paramétrage du service sera ouverts aux clients.

Fonctionnalités

Authentification Google

Note : La fonctionnalité est présentée ici avec les paramètres définis pour l’environnement dev. Le principe est le même pour les autres environnements (seuls la configuration change).

La console Google Cloud a un ID CLient OAuth 2 nommé gs-sync-connect-dev. Il est paramétré dans un projet Supabase gs-sync-connect-dev de cette manière :

• De nouveaux utilisateurs ne peuvent pas créer un compte par eux-mêmes

• L'authentification par email/mot de passe est désactivé

• Seule l'authentification par Google est possible

Il est possible d'ajouter manuellement un accès utilisateur depuis l'interface d'administration de Supabase.

Lorsqu'une personne non autorisée tente de s'authentifier, elle est redirigée vers une page "Access denied" avec un lien vers la page de login.

Lorsqu'une personne autorisée tente de s'authentifier, elle est redirig...
