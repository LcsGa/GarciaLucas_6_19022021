## Pour lancer le projet de votre côté :

1. Créez une base de données `MongoDB Atlas` ainsi qu'au moins un compte avec les droits en `lecture/écriture`.

2. Dans le dossier `backend`, renommez le fichier `.env.example` en `.env` et modifiez toutes les valeurs de celui-ci, pour que l'application fonctionne avec votre BDD (créée précédemment) et pour ajouter un mot de passe pour votre token et pour (dé)crypter les adresses mail utilisateurs.

3. A partir de la racine du projet (dans le terminal) rendez-vous dans chaque dossier (`cd backend` / `cd frontend`), et pour chacun :

   - installez ses dépendances (modules) via la commande `npm i` de votre terminal.
   - lancez la commande `npm start` afin de démarrer l'application/serveur.

4. Dans votre navigateur, rendez-vous sur `http://localhost:4200/`.
