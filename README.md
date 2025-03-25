# Yevent

Yevent est une application mobile développée en **React Native** avec **Expo**, conçue pour permettre aux utilisateurs de réserver facilement des événements. Ce projet met en avant une interface utilisateur intuitive et des fonctionnalités robustes de gestion d'événements et de réservations.

## Table des matières
1. [Résumé du Projet](#résumé-du-projet)
2. [Fonctionnalités](#fonctionnalités)
3. [Technologies Utilisées](#technologies-utilisées)
4. [Instructions pour Exécuter le Projet](#instructions-pour-exécuter-le-projet)
5. [Contributeurs](#contributeurs)

---

## Résumé du Projet
Yevent est conçu pour offrir une expérience fluide et rapide aux utilisateurs souhaitant :
- Découvrir des événements disponibles.
- Réserver des billets pour leurs événements préférés.
- Gérer leurs réservations et leurs informations personnelles.

L'application utilise **Supabase** pour la gestion des données et intègre des fonctionnalités natives telles que la géolocalisation et les QR Codes.

---

## Fonctionnalités
### Utilisateur
- Connexion et déconnexion sécurisées.
- Consultation et recherche d'événements.
- Réservation et annulation de billets.
- Consultation des réservations passées et à venir.
- Génération de QR Codes pour les réservations.
- Visualisation de l'emplacement des événements sur une carte.
---

## Technologies Utilisées
- **React Native** avec **Expo** pour le développement front-end.
- **Supabase** pour le backend (gestion des utilisateurs, événements, et réservations).

---

## Instructions pour Exécuter le Projet
1. Clonez ce repository :
   ```bash
   git clone https://github.com/juva-quentin/YEvent-React.git
   ```
    
2. Créez un fichier **.env.local** à la racine du projet et ajoutez les variables suivantes :
    ```bash
    EXPO_PUBLIC_SUPABASE_URL=https://vqfqfcyqnejpwwlrrvtl.supabase.co
    EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxZnFmY3lxbmVqcHd3bHJydnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNTc0OTYsImV4cCI6MjA0OTkzMzQ5Nn0.7bwbZL2yd5HVcDd9c_TW4ItSuIuBt8BhWyz0M10fD8A
    ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez l'application avec Expo :
   ```bash
   npx expo start
   ```
4. Scannez le QR Code avec l'application Expo Go sur votre smartphone ou lancez un émulateur.
---

## Contributeurs
- **Célian Frasca** - Développeur
- **Quentin Juvet** - Développeur