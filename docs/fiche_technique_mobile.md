# Fiche Technique : Application Mobile PARQ

## 1. Informations Générales
- **Nom du Projet** : PARQ Mobile
- **Type d'Application** : Marketplace & Wallet
- **Plateforme** : iOS & Android (Cross-platform)
- **Framework** : Flutter (SDK >=3.0.0)

## 2. Stack Technique
- **Langage** : Dart
- **Gestion d'État** : Riverpod (`flutter_riverpod`)
- **Client HTTP** : Dio (`dio`)
- **Stockage Local Sécurisé** : Flutter Secure Storage
- **Localisation** : `intl`
- **Gestion d'Images** : `cached_network_image`, `image_picker`

## 3. Architecture Logique
L'application suit une architecture modulaire basée sur les fonctionnalités (`feature-based architecture`) :
- **Core** : Contient les éléments partagés (API Client, thèmes, widgets communs, providers globaux).
- **Features** :
  - **Auth** : Gestion de l'authentification via OTP (SMS).
  - **Listings** : Consultation, recherche et gestion des annonces.
  - **Wallet** : Gestion du solde, recharges et preuves de paiement.
  - **Messaging** : Système de messagerie interne entre acheteurs et vendeurs.

## 4. Authentification (OTP)
Le système d'authentification a été simplifié pour une expérience utilisateur fluide :
1. **Saisie du numéro de téléphone** : L'utilisateur entre son numéro.
2. **Envoi d'un OTP** : Le backend Laravel génère et envoie un code de vérification.
3. **Vérification** : Une fois le code validé, l'application reçoit un token **Sanctum** pour sécuriser les appels API futurs.

## 5. Fonctionnalités Clés
### A. Marketplace (Listings)
- Affichage dynamique des annonces par catégorie.
- Système de favoris.
- Détails complets des annonces avec images et stats.

### B. Wallet & Paiements
- Consultation du solde en temps réel.
- Demande de recharge de compte.
- Upload de preuve de paiement (image) pour validation administrative.
- Historique des transactions.

### C. Messagerie
- Liste de conversations.
- Échanges de messages textes entre utilisateurs.
- Compteur de messages non-lus.

## 6. Intégration Backend
- **Technologie** : PHP Laravel 10+
- **API** : RESTful JSON API (Endpoints sous `/api/v1`)
- **Sécurité** : Laravel Sanctum (Token-based)
- **Media** : Gestion des images via le filesystem Laravel.

## 7. Outils de Développement
- **IDE recommandé** : VS Code ou Android Studio avec plugins Flutter & Dart.
- **Gestionnaire de versions** : Git.
- **Base de données mobile** : (Optionnel) Intégration de Hive pour le cache local si nécessaire.
