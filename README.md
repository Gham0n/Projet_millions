# Projet_millions

# 🔍 Moteur de Recherche Produits Électriques

Ce projet est une application web permettant de rechercher des produits électriques à partir de leur **référence fabricant** dans une base de données CSV. Si le produit n’est pas trouvé, un script Python est lancé pour récupérer automatiquement les informations et enrichir la base.

---

## 🚀 Fonctionnalités

- Recherche par **référence fabricant**
- Affichage des résultats avec :
  - Image produit
  - Liens vers Rexel, Sonepar, Yesss
- Saisie vide = affichage **de toute la base de données**
- Mise à jour dynamique via un **script Python**
- Frontend en **React.js**
- Backend en **Express.js** avec base CSV

---

## 📁 Structure du projet

```
.
├── backend/
│ ├── server.js # Serveur Express.js
│ ├── produits.csv # Base de données produit (CSV)
│ ├── add_in_bdd.py # Script Python pour scraper les infos manquantes
│ └── venv/ # Environnement virtuel Python
├── frontend/
│ ├── src/
│ │ └── Recherche.jsx # Composant React principal
│ └── public/
├── README.md
```

---

## 🛠️ Installation

### 1. Cloner le dépôt
```bash
git clone https://github.com/ton-utilisateur/ton-repo.git
cd ton-repo
```

### 2. Backend (Node.js + Express)
```bash
cd backend
npm install
node server.js
```
### 3. Script Python (Scraping)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 🐍 Le script add_in_bdd.py accepte une référence fabricant et met à jour produits.csv.

### 4. Frontend (React)
```bash
cd frontend
npm install
npm start
```

## 🌐 Utilisation
- Lancer le backend :
```bash
cd backend
node server.js
```
-Lancer le frontend :
```bash
cd frontend
npm start
```
Aller sur : http://localhost:3000

## ✅ Fonctionnement de la recherche
Si une référence est saisie :
Recherche dans produits.csv
Si absente, appel au script Python
Si le champ est vide :
Retourne toute la base de données

## 🧩 Améliorations possibles
-Pagination des résultats
-Passage à une vraie base de données (SQLite, PostgreSQL…)
-Interface d’administration
-Filtres par fournisseur, prix, marque…
