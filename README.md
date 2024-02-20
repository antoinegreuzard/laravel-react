# Gestion des Stars avec Laravel Breeze

Ce projet Laravel est une application de gestion des stars (célébrités) qui permet de créer, lire, mettre à jour, et
supprimer (CRUD) des informations sur les stars. Il utilise Laravel Breeze pour l'authentification et inclut des
fonctionnalités avancées telles que la validation des données, les seeders et factories pour les données de test, ainsi
que les tests unitaires.

## Fonctionnalités

- Authentification avec Laravel Breeze.
- CRUD pour les stars incluant nom, image, et description.
- Validation des données avec Form Requests.
- Génération de données de test avec seeders et factories.
- Tests unitaires pour garantir le bon fonctionnement de l'application.

## Prérequis

- PHP >= 8.2
- Composer
- Node.js et npm
- Une base de données prise en charge par Laravel (MySQL, PostgreSQL, SQLite, SQL Server)

## Installation

1. Clonez le dépôt du projet :

```bash
git clone git@github.com:antoinegreuzard/laravel-react projet-stars
cd projet-stars
```

2. Installez les dépendances PHP avec Composer :

```bash
composer install
```

3. Installez les dépendances front-end avec npm :

```bash
npm install
npm run dev
```

4. Copiez le fichier `.env.example` en `.env` et configurez votre environnement et votre base de données :

```bash
cp .env.example .env
```

5. Générez une clé d'application :

```bash
php artisan key:generate
```

6. Migrez la base de données et insérez les données de test :

```bash
php artisan migrate
php artisan db:seed
```

7. Lancez le serveur de développement :

```bash
php artisan serve
```

Votre application devrait maintenant être accessible à l'adresse [http://localhost:8000](http://localhost:8000).

## Tests

Exécutez les tests unitaires avec PHPUnit :

```bash
php artisan test
```

## Routes Utiles

- **Authentification :**
    - Login : `POST /login`
    - Register : `POST /register`
    - Logout : `POST /logout`

- **CRUD Stars :**
    - Lister toutes les stars : `GET /api/stars`
    - Afficher une star : `GET /api/stars/{id}`
    - Créer une nouvelle star : `POST /api/stars`
    - Mettre à jour une star : `PUT /api/stars/{id}`
    - Supprimer une star : `DELETE /api/stars/{id}`

## Utilisation de l'API

### Lister toutes les stars

```bash
curl -X GET http://localhost:8000/api/stars -H "Accept: application/json"
```

### Afficher une star

```bash
curl -X GET http://localhost:8000/api/stars/{id} -H "Accept: application/json"
```

### Créer une nouvelle star

```bash
curl -X POST http://localhost:8000/api/stars \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{"name":"Nom de la Star", "image":"URL de l'image", "description":"Description de la star"}'
```

### Mettre à jour une star

```bash
curl -X PUT http://localhost:8000/api/stars/{id} \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{"name":"Nouveau Nom", "image":"Nouvelle URL de l'image", "description":"Nouvelle description"}'
```

### Supprimer une star

```bash
curl -X DELETE http://localhost:8000/api/stars/{id} -H "Accept: application/json"
```

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
