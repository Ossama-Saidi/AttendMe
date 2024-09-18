# AttendMe (Created By idealDev )

    `With AttendMe, Record Attendance data in Real Time`

* "Attend" means to be present or participate in something "Me" refers to oneself.
* Une application mobile développée en utilisant React Native et Expo.

## Plan

* Prérequis
* Installation des dépendances
* Configuration
* Exécution de l'application
* Structure du projet
* Problèmes connus
* Outils recommandés
* Notre équipe (idealDev)

## Prérequis

Avant de pouvoir exécuter cette application, assurez-vous d'avoir les éléments suivants installés :

* [Node.js LTS](https://nodejs.org) : Seules les versions LTS (Long Term Support) de Node.js (versions avec des numéros pairs) sont recommandées. Les applications en production devraient utiliser les versions LTS actives ou de maintenance. Vous pouvez installer Node.js en utilisant un gestionnaire de versions (comme nvm, volta ou tout autre de votre choix) pour passer entre différentes versions de Node.js.
* [Git](https://git-scm.com) : Assurez-vous d'avoir Git installé sur votre système.
* [Watchman](https://facebook.github.io/watchman) (pour les utilisateurs de Linux ou macOS) : Watchman est requis pour le développement sur les plateformes Linux ou macOS.
* [Yarn](https://yarnpkg.com) : Yarn est recommandé comme gestionnaire de paquets alternatif à NPM. Vous pouvez l'installer en suivant les instructions fournies sur le site officiel.
* [Expo Go](https://expo.dev/client) : Installez Expo Go sur votre appareil mobile. Il est disponible à la fois sur le Play Store Android et l'App Store iOS. Pour Android, il est compatible avec Android Lollipop (5) et les versions ultérieures. Pour iOS, il est compatible avec iOS 13 et les versions ultérieures.

## Installation des dépendances

Après avoir extrait le dossier compressé, suivez les étapes ci-dessous pour installer les dépendances nécessaires :

1. Assurez-vous d'avoir Node.js et NPM (ou Yarn) installés sur votre machine
2. Installez Expo CLI en ouvrant votre terminal et en exécutant la commande suivante :

   > npm install -g expo-cli
   >
3. Accédez au répertoire `AttendMe`.

   > cd AttendMe
   >
4. Exécutez la commande suivante pour installer les dépendances avec npm or yarn :

   > npm install
   >

   or

   > yarn install
   >

Cela installera toutes les dépendances nécessaires pour exécuter l'application.

Assurez-vous d'avoir Node.js et npm installés sur votre système avant d'exécuter la commande `npm install`.

Pour toute question ou préoccupation, n'hésitez pas à nous contacter à l'adresse email `team.idealdev@outlook.com` .

## Configuration

Avant de pouvoir exécuter l'application, vous devez effectuer la configuration suivante :

1. Ouvrez le fichier `config.js` situé à la racine du projet.
2. Pour trouver l'adresse IP de votre API, suivez les étapes ci-dessous en fonction de votre système d'exploitation :

   -**Windows** :

   * Ouvrez une fenêtre de commande.
   * Tapez la commande suivante :

     > ipconfig
     >
   * Recherchez l'adresse IP associée à votre connexion réseau dans la section "Carte Ethernet" ou "Carte sans fil".

   -**macOS/Linux** :

   * Ouvrez un terminal.
   * Tapez la commande suivante :

     > ifconfig
     >
   * Recherchez l'adresse IP associée à votre connexion réseau dans la section "en0" (pour Ethernet) ou "wlan0" (pour Wi-Fi).
3. Dans ce fichier, recherchez la variable `API_URL` et remplacez sa valeur par l'adresse IP de votre API. Par exemple :

   ```javascript
   // config.js
   const API_URL = 'http://192.168.0.109:3001/'; // Remplacez cette adresse IP par l'adresse IP de votre API

   export default API_URL;
   ```

## Exécution de l'application

Pour lancer l'application sur votre appareil ou émulateur, exécutez les commandes suivantes :

1. Démarrez le serveur de développement Expo :

   > npx expo start --tunnel
   >
2. Ouvrez l'application Expo Go sur votre appareil mobile.
3. Scannez le code QR généré dans le terminal Expo CLI en utilisant l'application Expo Go. Cela connectera votre appareil au serveur de développement et lancera l'application.
4. Démarrez le serveur Express :

   > node server.js
   >

## Structure du projet

Voici la structure de base du projet :

  -`/attendme` : C'est le répertoire principal qui contient tous les fichiers sources de votre application.
  -`/attendme/components` : Ce répertoire contient les composants réutilisables utilisés dans l'application.
  -`/attendme/components/screens` : Ce sous-répertoire spécifique contient les écrans de l'application.
  -`/attendme/components/constants` : Les fichiers contenant les constantes utilisées dans l'application telles que les éléments d'interface utilisateur, les codes d'erreur, les messages, etc.
  -`/attendme/database` : Ce répertoire est dédié à la gestion de la base de données de l'application.
  -`/attendme/assets` : Ce répertoire est destiné à stocker Les ressources telles que les images, les polices de caractères, etc.
  -`App.js` : Ce fichier est le point d'entrée de l'application. Il contient la configuration de base de l'application, la navigation entre les écrans.
  -`package.json` : Ce fichier est utilisé pour définir les dépendances et d'autres métadonnées importantes, telles que le nom de l'application, la version, les scripts de construction, etc.
  -`app.json` : Ce fichier contient la configuration de l'application, notamment les métadonnées, les permissions, les icônes, etc.
  -`babel.config.js` : Ce fichier est utilisé pour configurer Babel, qui est un outil de compilation JavaScript. Il peut contenir des plugins ou des presets nécessaires pour transpiler le code source.
  -`server.js` : Ce fichier représente le serveur backend, basé sur Node.js et Express. Il contient la logique d' API, les routes, la gestion des requêtes et des réponses, etc.

## Problèmes connus

* L'application peut rencontrer des problèmes de compatibilité avec certains appareils Android plus anciens en raison de fonctionnalités récentes utilisées dans React Native.

N'hésitez pas à nous contacter à l'adresse email `team.idealdev@outlook.com` pour toute question ou préoccupation.

---

**Note :**
Il est recommandé d'utiliser les outils suivants dans [VS Code Editor](https://code.visualstudio.com) pour faciliter le développement :

* [Office Viewer (Markdown Editor)](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) : Une extension pour la visualisation et l'édition des fichiers Markdown.
* [SQLite3 Editor](https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite) : Une extension pour l'édition et l'exécution de requêtes sur des bases de données SQLite.
* [SQLite](https://www.sqlite.org/index.html) : Un moteur de base de données relationnelle intégré utilisé pour stocker les données de l'application.

Veuillez vous assurer d'installer ces outils dans votre environnement de développement pour une expérience optimale.

## Notre équipe (idealDev Team)

AttendMe a été créé par notre équipe, idealDev Team, composée de deux étudiants passionnés de développement d'applications mobiles. Ce projet est le fruit de notre travail dans le cadre de notre projet de fin d'études à l'université.

Nous avons mis tout notre cœur et notre expertise dans la conception et le développement de cette application. Notre objectif était de créer une solution efficace pour la gestion des présences, en fournissant une expérience utilisateur fluide et intuitive.

Nous sommes reconnaissants envers notre université pour nous avoir offert l'opportunité de réaliser ce projet ambitieux. Nous tenons également à remercier tous ceux qui nous ont soutenus et encouragés tout au long de ce parcours.

Nous sommes fiers du résultat et nous espérons que notre application, AttendMe, répondra à vos attentes et vous apportera une réelle valeur.

Pour toute question ou préoccupation, n'hésitez pas à nous contacter à l'adresse email `team.idealdev@outlook.com`.

---

background-image: 

linear-gradient(112.5deg, rgb(214, 214, 214) 0%, rgb(214, 214, 214) 10%,rgb(195, 195, 195) 10%, rgb(195, 195, 195) 53%,rgb(176, 176, 176) 53%, rgb(176, 176, 176) 55%,rgb(157, 157, 157) 55%, rgb(157, 157, 157) 60%,rgb(137, 137, 137) 60%, rgb(137, 137, 137) 88%,rgb(118, 118, 118) 88%, rgb(118, 118, 118) 91%,rgb(99, 99, 99) 91%, rgb(99, 99, 99) 100%),

linear-gradient(157.5deg, rgb(214, 214, 214) 0%, rgb(214, 214, 214) 10%,rgb(195, 195, 195) 10%, rgb(195, 195, 195) 53%,rgb(176, 176, 176) 53%, rgb(176, 176, 176) 55%,rgb(157, 157, 157) 55%, rgb(157, 157, 157) 60%,rgb(137, 137, 137) 60%, rgb(137, 137, 137) 88%,rgb(118, 118, 118) 88%, rgb(118, 118, 118) 91%,rgb(99, 99, 99) 91%, rgb(99, 99, 99) 100%),

linear-gradient(135deg, rgb(214, 214, 214) 0%, rgb(214, 214, 214) 10%,rgb(195, 195, 195) 10%, rgb(195, 195, 195) 53%,rgb(176, 176, 176) 53%, rgb(176, 176, 176) 55%,rgb(157, 157, 157) 55%, rgb(157, 157, 157) 60%,rgb(137, 137, 137) 60%, rgb(137, 137, 137) 88%,rgb(118, 118, 118) 88%, rgb(118, 118, 118) 91%,rgb(99, 99, 99) 91%, rgb(99, 99, 99) 100%),

linear-gradient(90deg, rgb(195, 195, 195),rgb(228, 228, 228)); 

background-blend-mode:overlay,overlay,overlay,normal;
