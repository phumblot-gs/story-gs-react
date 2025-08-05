# Instructions IA - Développement Feature CC01

## Contexte du Projet
Projet: **story-gs-react**
Repository: /Users/phf/story-gs-react

## Contexte du Développement
Tu assistes un développeur pour implémenter la feature **CC01 - User Access**.

## Objectifs
- Suivre exactement les spécifications de la feature
- Respecter l'architecture du module GS Connect Catalog
- Ajouter les headers Notion obligatoires
- Créer du code testable et maintenable
- S'adapter au type de projet (détecté automatiquement)

## Spécifications Complètes
# Feature CC01 - User Access

**Status:** Review
**Module:** GS Connect Catalog

## Feature Documentation

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

Lorsqu'une personne autorisée tente de s'authentifier, elle est redirigée vers le dashboard.

Dans le menu account du module, l'utilisateur peut se déloguer pour fermer sa session. Il peut aussi se reloguer en utilisant un autre compte Google.

Critères d'acceptation :

🎨 Spécifications UX/UI

Wireframes

Page Login

La page de login comporte le nom du module et le widget standard d’authentification Google. Une mention indique que l’accès est restreint.

Il n’y a pas la possibilité de créer un compte, ni de réinitialiser son mot de passe.

Page 403

Lorsque l’authentification échoue, l’utilisateur est redirigé vers une page “Access denied” qui comporte un lien vers la page Login.

Page Dashboard

La page Dashboard est définie dans une autre fonction. Elle est accessible uniquement aux utilisateurs authentifiés. Elle comporte un menu principal et dans ce menu principal il y a une entrée “Compte” qui ouvre un sous-menu qui comprend :

• Se déconnecter → ferme la session et redirige vers la page Login

• Se connecter avec un autre compte Google → ouvre le widget Google pour choisir et s’authentifier avec un autre compte.

Interactions

• S’authentifier → Redirection vers Dashboard ou 403

• Se déconnecter → Redirection vers Login

• Se connecter avec un autre compte Google → Redirection vers Dashboard ou 403

Cette feature fait partie du projet GS Sync Connect Catalog.

## Module Documentation - GS Connect Catalog

Project Requirement Description (PRD)

📋 Informations Générales

• Nom du projet : GS Sync Connect Catalog

• Date de création : 18/07/2024

• Responsable produit : Pierre Humblot-Ferrero

🎯 Objectif du Projet

Le catalogue est un élément central de Grand Shooting qui peut nécessiter des intégrations avec des systèmes tiers. Selon les besoins d’un client, il peut arriver que des opérations de chargement ou de synchronisation de données soient nécessaires. C’est l’objectif de ce module.

D’un point de vue métier, le module comporte 2 principales fonctions :

Synchronisation unidirectionnelle du catalogue entre 2 comptes GS

Dans certains cas, un client peut avoir plusieurs comptes Grand Shooting. Pour ce type de client, il peut être intéressant de synchroniser les catalogues entre les différents comptes Grand Shooting, de telle sorte que si compte principal est régulièrement mis à jour avec les données du client, alors ces mises à jour soient répercutées au fil de l’eau sur les autres comptes Grand Shooting.

La synchronisation est unidirectionnelle. Les données du compte principal sont synchronisées vers un compte secondaire. Si jamais le client possède plusieurs comptes secondaires, la mise à jour est en étoile, c'est-à-dire qu'il faut créer autant de synchronisations entre le compte principal et tous les comptes secondaires associés à ce compte principal.

Le mécanisme de synchronisation s'appuie sur les webhooks Grand Shooting pour la création, la modification et la suppression de références dans le catalogue du compte principal. Ce module de synchronisation expose donc des callback_url qui acceptent les notifications des webhooks. Les notifications sont prises en charge dans une pile, traitées au fil de l'eau, pour mettre à jour le compte secondaire.

Le mécanisme de synchronisation s'appuie aussi sur l'API Grand Shooting pour requêter le compte principal à fréquence paramétrable pour mettre à jour par batch le compte secondaire. Les 2 mécanismes sont actifs simultanément pour plus de résilience : le mécanisme de webhook n’est pas infaillible, il est possible de rater des notifications.

Le service de synchronisation propose également une fonction d'initialisation qui consiste à réinitialiser le catalogue du compte secondaire avec l'intégralité du catalogue du compte principal.

Chargement des données catalogue par FTP

Note : cette fonction est en cours de rédaction

Certains comptes déposent des fichiers plats soit sur un serveur FTP externe, soit sur notre serveur FTP interne. Le module se charge alors de se connecter sur le serveur FTP, pour détecter la présence d’un ou de plusieurs fichiers à charger.

Un système de mapping et de formatting est nécessaire pour prendre en compte les spécificités de certaines colonnes à charger.

To be finished

📖 Description Détaillée

Ce projet comprend un frontend qui permet de :

• Gérer les accès utilisateurs au module

• Configurer des comptes Grand Shooting

• À propos de la synchronisation entre 2 comptes GS :

• À propos du chargement des données par FTP

Le module intègre un service qui permet de :

• Enregistrer dans une pile les webhooks qui notifient les mises à jours sur le catalogue d'un compte principal (ajout, modification et suppression)

• Appliquer les mises à jour au compte secondaire en respectant les contrainte de API rate limiting

• Centraliser les erreurs lorsque les mises à jour renvoient des codes autres que 2xx.

• Implémenter un mécanisme de retry limité à 1 essai (si le retry échoue la mise à jour est abandonnée).

• Envoyer un email aux utilisateurs qui ont accès au frontend pour alerter lorsqu'il y a des erreurs

🔧 Fonctionnalités Principales

Frontend : Interface Principale

Frontend : Interface de Configuration

Moteur de Synchronisation

Dashboard de Monitoring

🏗️ Architecture Technique

Stack Générale

• Frontend : Next.js (React + TypeScript) déployé sur Vercel

• Backend/API : API routes Next.js (serverless functions sur Vercel) pour la gestion des webhooks, des batchs et de l'orchestration

• Base de données : PostgreSQL (hébergé sur Supabase)

• Authentification : Supabase Auth (Google, email, etc.)

• Stockage : Supabase Storage (pour logs, fichiers éventuels)

• Queue/traitement asynchrone :

• Notifications : Email (Resend ou SendGrid), Slack (webhooks)

• Monitoring : Statistiques et logs stockés dans Supabase, visualisés dans le dashboard Next.js

Gestion des environnements (dev, test, prod)

• Variables d'environnement distinctes pour chaque environnement (URL Supabase, clés API, Notion, etc.)

• Bases de données séparées sur Supabase pour dev, test et prod

• Déploiement :

• Secrets : stockés dans Vercel (Environment Variables) et Supabase (Project Settings)

• CI/CD : GitHub Actions pour automatiser les tests et le déploiement

Gestion de la pile des traitements (webhook & batch)

• Pile centralisée :

• Alimentation de la pile :

• Traitement asynchrone :

• Scalabilité :

• Monitoring :

• indexation, purge et monitoring :

• La pile (table PostgreSQL) est indexée pour garantir la performance.

• Les traitements de plus de 7 jours sont automatiquement purgés de la pile.

Authentification à l'API Grand Shooting (batch)

• Pour chaque synchronisation par batch, la connexion à l'API Grand Shooting se fait avec deux tokens Bearer distincts :

• Les tokens sont stockés de façon sécurisée (chiffrés en base, jamais exposés côté client)

• Chaque synchronisation référence explicitement les deux tokens nécessaires à son exécution

Sécurisation des tokens API

• Les tokens Bearer sont chiffrés en base avec AES256.

• Pas de rotation automatique : l'âge des clés est affiché pour information.

## Instructions de Code
1. **Headers obligatoires** dans tous les fichiers
2. **Tests unitaires** pour chaque fonction
3. **Gestion d'erreurs** appropriée
4. **Documentation** inline pour les fonctions complexes
5. **Respect des patterns** du module existant

## Détection automatique du projet
- Cache local: /Users/phf/story-gs-react/.notion-dev
- Structure détectée automatiquement depuis le dossier courant

## Validation
Avant de proposer du code, vérifier :
- [ ] Header Notion présent
- [ ] Code aligné avec les specs
- [ ] Gestion des cas d'erreur
- [ ] Tests unitaires inclus
