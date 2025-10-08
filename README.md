# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

-------

# TP1 — Initialisation du projet & Premier composant

# 🎯 Objectifs

- Créer **une seule application Expo** qui servira de support à **tous les TP** du cours.
- Mettre en place un **dépôt GitHub** propre (branches, PR, tags).
- Organiser le code pour accueillir **un dossier par TP**.
- Réaliser un **premier écran complet** : une *Profile Card* interactive utilisant **state** et **useEffect**.

---

## 1️⃣ Pré-requis

- **Node.js** ≥ 20.19.4
- **Git**
- **VS Code** avec extensions recommandées (*React Native Tools*, *Prettier*).
- **Expo Go** installé sur smartphone.
- ⚠️ Créez le projet dans un chemin **sans espaces ni caractères spéciaux** (pas de `&`, `(`, `)`, etc.).

---

## 2️⃣ Création du projet Expo

1. Dans un terminal, allez dans votre dossier de travail :
    
    ```bash
    npx create-expo-app rn-advanced-labs
    
    ```
    
2. Choisissez **TypeScript** si vous êtes à l’aise (sinon JavaScript).
3. Vérifiez que l’application démarre :
    
    ```bash
    cd rn-advanced-labs
    npx expo start
    
    ```
    
    Scannez le QR code avec **Expo Go** et assurez-vous que l’écran par défaut s’affiche.
    

---

## 3️⃣ Mise en place Git & GitHub

1. Créez un **nouveau dépôt GitHub** (public ou privé).
2. Dans le dossier `rn-advanced-labs`, initialisez Git et liez le dépôt :
    
    ```bash
    git init
    git remote add origin <url-du-depot>
    ```
    
3. Créez un fichier **.gitignore** adapté (ignorer `node_modules/`, `.expo/`, etc.).
4. Faites un premier commit et poussez :
    
    ```bash
    git add .
    git commit -m "chore: initial commit"
    git push -u origin main
    ```
    
5. Rédigez un **README.md** minimal avec :
    - Nom du projet
    - Version de Node recommandée
    - Commandes de lancement (`npx expo start`)
    - Rappel de la structure attendue (voir ci-dessous)

---

## 4️⃣ Organisation du code par TP

**Tout au long du cours, chaque TP doit être rangé dans un dossier dédié**.

Arborescence attendue après le TP1 :

```
rn-advanced-labs/
├─ app/
│  ├─ tp1-profile-card/
│  │   ├─ components/         # composants spécifiques au TP1
│  │   ├─ screens/            # écrans du TP1
│  │   └─ index.tsx           # point d'entrée du TP1
│  └─ ...
├─ App.tsx
└─ ...
```

Règles :

- **Un dossier par TP** (`tp1-profile-card`, `tp2-navigation`, etc.).
- `components/` et `screens/` dans chaque dossier.
- `index.tsx` exporte l’écran principal du TP.
- Pas encore de navigation : **dans le TP1, App.tsx importe directement l’écran TP1**.

---

## 5️⃣ Contenu du TP1 – Profile Card

Dans le dossier `app/tp1-profile-card/` :

1. **Écran principal** : une carte de profil affichant :
    - une photo (image en ligne au choix)
    - un nom et une fonction
    - un bouton **Follow**
    - un compteur de **followers**
2. **State (`useState`)** :
    - Le bouton Follow/Unfollow modifie le nombre de followers et le texte du bouton.
3. **Effet (`useEffect`)** :
    - Augmenter automatiquement le nombre de followers toutes les X secondes (ex. toutes les 5 s).
    - Nettoyer correctement le timer lorsque l’écran est quitté.
4. **Positionnement & style** :
    - Carte centrée à l’écran avec Flexbox.
    - Bords arrondis, ombre ou élévation pour un effet “carte”.

> ⚠️ Aucun code n’est fourni. Cherchez dans la documentation React Native / Expo.
>
---

# TP2 — Navigation, Persistance & Deep Linking avec Expo Router

## 🎯 Objectifs pédagogiques

- Mettre en place **Expo Router** pour la navigation d’une app multi-écrans.
- Créer une **architecture de fichiers claire** (routing basé sur les dossiers).
- Mettre en œuvre **Stack** et **Tabs** avec layouts imbriqués.
- Gérer le **passage de paramètres**, la **persistance de l’état de navigation** et le **deep linking** (liens internes/externes).

---

## 0️⃣ Pré-requis

- Projet **`rn-advanced-labs`** opérationnel avec **TP1** terminé.
- Node.js ≥ 20.19.4, Expo CLI et Git installés.
- Application déjà versionnée sur GitHub (`main` à jour avec tag `tp1-done`).

---

## 1️⃣ Architecture et consignes

Organisez votre projet selon l’approche **file-based routing** d’Expo Router :

```
app/
  _layout.tsx                 # layout racine : Stack global
  (main)/                     # section principale
    _layout.tsx               # onglets principaux
    home.tsx                  # page d’accueil
    tp1-profile-card.tsx      # écran du TP1 (intégré à la nav)
    tp2-navigation/           # écrans spécifiques au TP2 si besoin
  (auth)/                     # section authentification (préparée pour l’avenir)
    _layout.tsx
components/                   # composants partagés
lib/                           # services, helpers

```

- Chaque **fichier est une route**.
- Les dossiers `(main)` et `(auth)` sont des **groupes** : ils organisent l’URL et permettent des layouts imbriqués.
- `_layout.tsx` définit la **navigation** (Stack, Tabs ou Drawer) de son dossier.

---

## 2️⃣ Installation des dépendances

1. Installez Expo Router :
    
    ```bash
    npm install expo-router react-native-safe-area-context react-native-screens
    
    ```
    
2. Assurez-vous que `expo-router` est bien déclaré comme **entry point** dans `package.json` :
    
    ```json
    "main": "expo-router/entry"
    
    ```
    

---

## 3️⃣ Mise en place de la navigation

1. **Layout racine (`app/_layout.tsx`)**
    - Créez une `<Stack />` qui servira de conteneur global.
    - Définissez un écran `(main)` comme entrée principale.
2. **Layout principal `(main)/_layout.tsx`**
    - Créez un `<Tabs />` avec au moins deux onglets (ex. `home`, `tp1-profile-card`).
    - Chaque fichier (ex. `home.tsx`) devient automatiquement un onglet.
3. **Ecrans**
    - `home.tsx` : page d’accueil.
    - `tp1-profile-card.tsx` : réutilisez l’écran du TP1, accessible comme onglet.

---

## 4️⃣ Passage de paramètres & écran de détail

1. Créez un écran dynamique : `(main)/detail/[id].tsx`.
2. Depuis `home.tsx`, ajoutez un lien vers une page de détail (ex. `/detail/42`).
3. Dans `[id].tsx`, récupérez le paramètre `id` avec `useLocalSearchParams()` et affichez-le.

Critères :

- Navigation vers `Detail` avec un paramètre `id`.
- Retour possible via le header natif.

---

## 5️⃣ Persistance de l’état de navigation

- Vérifiez que, si l’utilisateur :
    1. Ouvre l’app, va sur l’onglet TP1 puis sur Detail,
    2. **Ferme** complètement l’app,
    3. **Relance**,
        
        il retrouve la même page et la même pile de navigation.
        
- Si vous souhaitez une page d’accueil forcée, explorez la config `unstable_settings.initialRouteName`.
- Documentez dans le README :
    - Ce qui est effectivement persistant,
    - Les choix UX que vous avez faits.

---

## 6️⃣ Deep linking

### 6.1 Configurer le schéma et les liens

Dans `app.json` :

```tsx
export default {
  expo: {
    scheme: "rnadvancedlabs",
    name: "RN Advanced Labs",
    slug: "rn-advanced-labs",
    ios: { bundleIdentifier: "com.exemple.rnadvancedlabs" },
    android: { package: "com.exemple.rnadvancedlabs" }
  }
}

```

- Schéma interne : `rnadvancedlabs://`
- Lien web possible : `https://app.votre-domaine.com/...` (préparer mais pas besoin de déployer pour le TP).

### 6.2 Tests attendus

- Ouvrir `rnadvancedlabs://detail/42` → l’écran `[id].tsx` s’affiche avec `id=42`.
- Tester :
    - App fermée (cold start),
    - App en arrière-plan,
    - App déjà ouverte.
- Décrire chaque scénario dans le README (action, résultat attendu, résultat obtenu).

---

## 7️⃣ Qualité d’implémentation

- **Un seul `_layout.tsx` racine** dans `app/`.
- Groupes `(main)`, `(auth)` bien distincts.
- Pas de logique métier (fetch, API) directement dans les fichiers de layout.
- Paramètres **validés** : gérer les erreurs (ex. afficher une page 404 si l’ID est absent ou invalide).
- Table de routes à jour dans le README.

---

# TP3 — Formulaires avancés : Formik+Yup **ET** RHF+Zod

## 🎯 Objectifs pédagogiques

- Construire un formulaire multi-champs robuste.
- Implémenter **deux versions** : **Formik+Yup** et **RHF+Zod**.
- Maîtriser l’**UX mobile** (clavier, focus, haptique, submit conditionnel).
- **Assurer la navigation** depuis l’accueil jusqu’à **chacune** des deux versions de formulaire.

---

## 0) Pré-requis & périmètre

- Projet **`rn-advanced-labs`** avec **Expo Router** (TP2 fait).
- Dossier dédié : `app/(main)/TP3-forms/` contenant deux sous-pistes :
    - `formik/` et `rhf/`.

---

## 1) Écran cible (mêmes règles pour les 2 versions)

Champs : `email`, `password`, `confirmPassword`, `displayName`, `termsAccepted`.

Comportements : validation temps réel, **submit désactivé** si invalide, **KeyboardAvoidingView**, **focus chain**, **haptique** succès/erreur, **reset** sur succès + message de confirmation.

---

## 2) Implémentation A — **Formik + Yup**

Arborescence :

```
app/(main)/TP3-forms/formik/
  index.tsx
  validation/schema.ts
  components/...

```

Contraintes : schéma Yup centralisé, gestion `errors/touched`, submit bloqué si invalide.

## 4) 🔗 **Navigation jusqu’aux formulaires (obligatoire)**

- Ajoutez **depuis l’écran d’accueil** de `(main)` un accès clair vers :
    - **TP3 – Formik** → route **`/TP3-forms/formik`**
    - **TP3 – RHF** → route **`/TP3-forms/rhf`**
- L’accès peut se faire via :
    - un **onglet** dédié dans `(main)/_layout.tsx` (Tabs),
    - **ou** des **liens** (`<Link href="...">`) visibles depuis `home.tsx`,
    - **ou** une **liste** “Tous les TP” menant aux deux écrans.
- Exigences :
    - Les deux écrans sont **atteignables en 2 taps max** depuis l’accueil.
    - Le **retour** fonctionne (header natif ou bouton Back).
    - Les routes sont **documentées** dans le README (table de routes + chemins).

*(Optionnel)* : Ajouter un **lien croisé** en haut de chaque écran pour basculer Formik ⇄ RHF rapidement.

---

## 5) UX Mobile (checks)

---

- Clavier ne masque rien (KAV).
- Focus chain : `email → password → confirm → displayName → submit`.
- Submit désactivé tant que non valide.
- Messages d’erreur clairs.
- Haptique perceptible.

---

## 6) Qualité & archi

- Schémas dans `validation/`.
- Composants de champ réutilisables si pertinent.
- Pas de logique métier dans les layouts/router.
- README : arborescence, routes, choix techniques.

---

# TP4-A — Zustand : CRUD “Robots” (liste + formulaire + delete)

# 

## 🎯 Objectifs pédagogiques

- Créer un **store global** avec **Zustand** pour gérer une collection de robots.
- Implémenter un **CRUD** complet : **Create, Read (liste/détail), Update, Delete**.
- Concevoir un **formulaire** robuste (au choix : Formik+Yup ou RHF+Zod) avec validation.
- Intégrer la **navigation** (Expo Router) : liste → création/édition → retour.
- Gérer la **persistance** locale (AsyncStorage ou SecureStore selon vos choix).

---

## 0) Modèle & règles métier (à respecter)

**Robot** :

- `id` (uuid)
- `name` (*string*, min 2, obligatoire)
- `label` (*string*, min 3, obligatoire)
- `year` (*number*, entre 1950 et année courante, obligatoire)
- `type` (*enum*) : `industrial | service | medical | educational | other` (obligatoire)

**Contraintes :**

- Unicité du **name** dans la collection (refuser doublon).
- `year` doit être un entier valide (ex. 1998), dans l’intervalle autorisé.
- `type` sélectionné via un **picker** / select clair.

---

## 1) Arborescence attendue

```
app/(main)/tp4A-robots/
  index.tsx            # écran Liste des robots
  create.tsx           # écran Création
  edit/[id].tsx        # écran Édition (même formulaire en mode édition)
store/
  robotsStore.ts       # Zustand : state + actions (CRUD) + persistance
validation/
  robotSchema.(ts)     # Yup ou Zod (au choix)
components/
  RobotForm.tsx        # composant formulaire réutilisable (create/edit)
  RobotListItem.tsx    # item de liste (nom, type, année, actions)

```

---

## 2) Store global (Zustand)

Implémentez dans `store/robotsStore.ts` :

- **State** :
    - `robots: Robot[]`
    - `selectedId?: string` (optionnel)
- **Actions** *(toutes requises)* :
    - `create(robotInput)`: ajoute un robot (génère `id`, applique règles d’unicité)
    - `update(id, robotInput)`: met à jour
    - `remove(id)`: supprime
    - `getById(id)`: renvoie un robot ou `undefined`
- **Persistance** :
    - Middleware `persist` (AsyncStorage).
    - Bonus : séparer **données publiques** (AsyncStorage) et **sensibles** (SecureStore) si vous en aviez — ici tout peut rester AsyncStorage.
    

**Critères d’acceptation**

- Les robots persistent après **redémarrage** de l’app.
- Les opérations **create/update/delete** modifient **immédiatement** la liste (sans rechargement).

---

## 3) Formulaire (Create & Edit)

- Un **seul composant** `RobotForm` utilisé par `create.tsx` et `edit/[id].tsx`.
- **Validation** (obligatoire) :
    - `name`: min 2, non vide, unique.
    - `label`: min 3, non vide.
    - `year`: entier, 1950 ≤ `year` ≤ année courante.
    - `type`: valeur parmi l’enum.
- **UX / Mobile** :
    - `KeyboardAvoidingView` pour éviter le clavier qui masque les champs.
    - Navigation fluide entre champs (`returnKeyType="next"`, `onSubmitEditing`).
    - Bouton **Submit désactivé** tant que le formulaire n’est **pas valide**.
    - Message de **succès/erreur** visible (et **haptique** si dispo).
- **Mode Édition** :
    - Charger les valeurs existantes via `getById(id)`.
    - Enregistrer via `update(id, input)`.

> Vous pouvez utiliser Formik+Yup ou RHF+Zod (au choix).
> 
> 
> Indiquez votre choix et vos raisons dans le README.
> 

---

## 4) Liste + actions

**Écran `index.tsx`** :

- Afficher la **liste** des robots (tri par `name` ou `year` au choix).
- Chaque item (`RobotListItem`) montre : `name`, `type`, `year` + **actions**:
    - **Edit** → route `/tp6-robots/edit/[id]`
    - **Delete** (confirmation) → `remove(id)` puis feedback.
- Bouton flottant **“+”** ou CTA visible → route `/tp4A-robots/create`.

**Critères d’acceptation**

- La liste se **met à jour** en temps réel après création/édition/suppression.
- Le **retour** fonctionne depuis create/edit vers la liste (header back ou CTA).

---

## 5) Navigation (Expo Router)

- Routes attendues :
    - `/tp4-robots` (liste),
    - `/tp4-robots/create` (création),
    - `/tp4-robots/edit/[id]` (édition).
- Ajoutez un lien d’accès à **TP4 A Robots** depuis votre menu principal (Module 2).

---

## 6) Qualité & architecture

- **Zustand** : pas de logique UI dans le store ; state + actions pures.
- **Validation** : isolée dans `validation/robotSchema`.
- **Composants** : `RobotForm` réutilisable (props : `initialValues`, `onSubmit`, `mode`).
- **Sélecteurs** : dans les écrans, sélectionnez **uniquement** les slices nécessaires (`useStore(state => state.robots)`) pour limiter les re-renders.
- **Accessibilité** : labels/placeholder clairs, erreurs sous champs.

---
# TP5 — Stockage local avec SQLite : Robots Offline

## 🎯 Objectifs pédagogiques

- Créer et gérer une **base de données locale SQLite** dans une application Expo/React Native.
- Mettre en place des **migrations versionnées** (v1, v2, v3).
- Implémenter un **CRUD complet** (Create, Read, Update, Delete) pour des robots.
- Intégrer **TanStack Query** ou votre store global pour un affichage réactif.
- Mettre en place l’**export / import** de données avec `expo-file-system`.

---

## 0) Contexte

Dans la continuité des TP précédents (TP5 et TP6), vous allez **stocker les robots en local** au lieu de (ou en plus de) l’état en mémoire.

L’application doit fonctionner **complètement offline**, tout en permettant une **évolution du schéma** et une **synchronisation future** avec un back-end.

---

## 1) Modèle Robot (identique au TP6)

- `id` (uuid)
- `name` (*string*, min 2, **unique**, requis)
- `label` (*string*, min 3, requis)
- `year` (*number*, 1950 ≤ year ≤ année courante, requis)
- `type` (*enum*) : `industrial | service | medical | educational | other`
- `created_at` (timestamp)
- `updated_at` (timestamp)
- (v3) `archived` (*boolean*, défaut `false`)

---

## 2) Arborescence attendue

```
app/(main)/TP5-robots-db/
  index.tsx                # écran Liste
  create.tsx               # écran Création
  edit/[id].tsx            # écran Édition
db/
  index.ts                 # ouverture DB + runner de migrations
  migrations/
    001_init.sql
    002_add_indexes.sql
    003_add_archived.sql
services/
  robotRepo.ts             # toutes les requêtes SQL (DAO/Repository)
validation/
  robotSchema.ts           # Yup ou Zod
components/
  RobotForm.tsx            # formulaire réutilisable
  RobotListItem.tsx

```

---

## 3) Dépendances (README obligatoire)

- `expo-sqlite`
- `expo-file-system` (pour export/import)
- `uuid`
- Form stack : **Formik+Yup** ou **RHF+Zod**
- (Optionnel) TanStack Query (pour cache/invalidation)

Expliquez dans le README le rôle de chaque dépendance.

---

## 4) Initialisation de la base

- Créez `db/index.ts` pour :
    - **ouvrir** la base (`openDatabaseAsync` recommandé),
    - exécuter les **migrations** manquantes au démarrage.
- `PRAGMA user_version` pour versionner.
- **Migrations attendues** :
    - `001_init.sql` : table `robots`.
    - `002_add_indexes.sql` : index sur `name` et `year`.
    - `003_add_archived.sql` : ajout colonne `archived` (DEFAULT 0).

---

## 5) Repository (DAO)

Dans `services/robotRepo.ts` :

- Fonctions requises :
    - `create(robotInput)` → INSERT
    - `update(id, changes)` → UPDATE + mise à jour `updated_at`
    - `remove(id)` → DELETE (ou soft delete avec `archived`)
    - `getById(id)` → SELECT
    - `list({q, sort, limit, offset})` → SELECT paginé/filtré
- Toutes les requêtes doivent être **paramétrées** (`?`) pour éviter les injections SQL.

---

## 6) Écrans et navigation

- **Liste** (`index.tsx`) :
    - Affiche les robots triés (par nom ou année).
    - Recherche (optionnelle) via `q`.
    - Boutons **Edit** et **Delete**.
    - Bouton “+” → `/TP5-robots-db/create`.
- **Création & Édition** :
    - Utilisent le même composant `RobotForm`.
    - Validation stricte (nom unique, year valide).
    - Sauvegarde dans SQLite via le repository.

**Navigation** : Expo Router, avec routes :

- `/TP5-robots-db`
- `/TP5-robots-db/create`
- `/TP5-robots-db/edit/[id]`

---

## 7) TanStack Query (optionnel mais recommandé)

- Envelopper vos appels `robotRepo` dans des hooks `useRobotsQuery`, `useRobotQuery`, etc.
- Permettre :
    - Cache,
    - Invalidation automatique,
    - Rechargement après create/update/delete.

---

## 8) Export / Import

- **Export JSON** :
    - Bouton “Exporter” → génère un fichier JSON de tous les robots.
    - Stockage dans `DocumentDirectory` via `expo-file-system`.
- **Import JSON** (bonus) :
    - Bouton “Importer” → lit un fichier et fusionne les données (vérification d’unicité sur `name`).

---

## 9) Qualité & UX

- `KeyboardAvoidingView` pour les formulaires.
- Spinner pendant les requêtes longues.
- Messages d’erreur clairs (unicité, année invalide, etc.).
- Pas de blocage de l’UI : **API async** recommandée.

---

# TP6 — Caméra (Expo) : capture, stockage local & galerie

## 🎯 Objectifs pédagogiques

- Demander et gérer les **permissions caméra** (et stockage si nécessaire).
- Utiliser **`expo-camera`** pour **prévisualiser** et **capturer** une photo.
- Enregistrer les fichiers en **local** avec **`expo-file-system`**.
- Construire un **écran Galerie** listant les photos stockées + **détail** d’une photo.
- Respecter une **architecture propre** (services, hooks, UI, navigation).

---

## 0) Pré-requis & périmètre

- Projet **Expo + Expo Router** opérationnel.
- **Pas** d’enregistrement dans la galerie système (Photos) : on reste **dans l’app** (DocumentDirectory / cache).
- **Pas** de back-end : tout est **offline/local**.

---

## 1) Dépendances (documenter dans le README)

- `expo-camera` (capture)
- `expo-file-system` (stockage, lecture, suppression)
- (Optionnel) `expo-media-library` si vous voulez aussi **sauver dans la galerie système** (bonus, non requis)

Expliquez **à quoi sert** chaque package en 1–2 phrases.

---

## 2) Permissions (obligatoire)

- **Déclarer** les clés dans `app.json` (iOS : `NSCameraUsageDescription`; Android : ajouter `CAMERA` si nécessaire).
- **Demander au runtime** la permission caméra **au moment utile** (à l’entrée de l’écran Caméra).
- En cas de refus : **UI explicite** + action “Ouvrir les réglages”.

---

## 3) Architecture attendue

```
app/(main)/TP6-camera/
  index.tsx            # Galerie (liste des miniatures)
  camera.tsx           # Écran de prise de vue
  detail/[id].tsx      # Écran Détail (afficher, supprimer, partager…)
  lib/
	  camera/
	    storage.ts         # Fonctions: savePhoto, listPhotos, getPhoto, deletePhoto
	    types.ts           # Type Photo: { id, uri, createdAt, size? }
	  hooks/
	    useCameraPermission.ts
	    usePhotoStorage.ts  # (optionnel) wrapper stateful autour de storage.ts

```

**Contraintes**

- **Aucun** accès `FileSystem` direct depuis les écrans : passez par `lib/camera/storage.ts`.
- Les écrans consomment des **fonctions/services** et gèrent uniquement l’UI/flux.

---

## 4) Capture & enregistrement local

- Écran **Caméra** :
    - Prévisualisation temps réel (arrière, option bascule avant/arrière).
    - Bouton **capture** (shutter).
    - Après capture : **enregistrer** l’image physiquement via `expo-file-system` dans un dossier dédié, par ex. `FileSystem.documentDirectory + 'photos/'`.
    - **Naming** : `photo_<timestamp>.jpg` (ou uuid).
    - **Retour** automatique vers la **Galerie** avec feedback de succès.
- **Métadonnées minimales** à stocker (dans le nom de fichier ou un petit .json à côté) :
    - `id` (nom de fichier sans extension), `uri`, `createdAt` (timestamp), `size` (bytes).

---

## 5) Galerie (liste)

- Écran **Galerie** :
    - Scanne le dossier `photos/` pour lister les fichiers image.
    - Affiche une **grille de miniatures** (n colonnes selon la largeur).
    - Chaque miniature → ouvre **Détail** (`/TP6-camera/detail/[id]`).
    - Bouton “**Prendre une photo**” → `/TP6-camera/camera`.
    - **Pull-to-refresh** (ou bouton “Rafraîchir”) pour rescanner le dossier.

**Critères d’acceptation**

- La galerie se met à jour **après chaque capture** (retour de l’écran Caméra).
- Les miniatures s’affichent **sans bloquer l’UI** (si besoin : utilisez une image compressée ou `cache`).

---

## 6) Détail d’une photo

- Écran **Détail** :
    - Affiche la photo **plein écran** (ou zoomable si vous voulez).
    - Affiche les **métadonnées** de base (nom/ID, date, taille).
    - Actions :
        - **Supprimer** (avec confirmation) → retire le fichier + retour Galerie.
        - (Optionnel) **Renommer** (mettez à jour l’ID/nom de fichier).
        - (Optionnel) **Partager** (via Share API).
        - (Optionnel) **Enregistrer dans la galerie système** (Media Library).

---

## 7) Navigation (Expo Router)

- Routes attendues :
    - `/TP6-camera` → **Galerie**
    - `/TP6-camera/camera` → **Caméra**
    - `/TP6-camera/detail/[id]` → **Détail**
- Ajoutez un **point d’entrée** depuis votre menu principal (Module 2).

---

## 8) UX & bonnes pratiques (obligatoire)

- **Permissions** : demander au moment de l’usage, UI claire en cas de refus.
- **Haptique** ou feedback visuel lors de la capture (optionnel mais conseillé).
- **État de chargement** (spinner) pendant l’accès disque (liste/suppression).
- **Économie d’énergie** : désabonner/arrêter la caméra quand l’écran est flouté ou quitté.
- **Accessibilité** : labels sur boutons (Capture, Supprimer, Ouvrir caméra).

---

## 9) Qualité & architecture

- Un **service de stockage** unique (`storage.ts`) avec API claire :
    - `ensureDir()`, `savePhoto(base64|tempUri)`, `listPhotos()`, `getPhoto(id)`, `deletePhoto(id)`.
- **Aucun** chemin de fichier “en dur” dans l’UI.
- Gestion des **erreurs** (écriture disque pleine, fichier manquant) → message utilisateur.

---

# TP7 — Tests automatisés : unitaire, UI et end-to-end

## 🎯 Objectifs pédagogiques

- Écrire des **tests unitaires** pour vérifier la logique métier.
- Tester l’**UI d’un composant** (formulaire, interactions).
- Créer un **scénario E2E** (end-to-end) qui valide un parcours utilisateur complet.
- Comprendre comment isoler les dépendances avec des **mocks**.

---

## 1️⃣ Pré-requis

- Projet **Expo + TypeScript** (votre app des TP précédents).
- TP6 (Zustand ou Redux Toolkit) terminé pour disposer d’un reducer et d’un formulaire de robots.
- Node ≥ 20, npm ≥ 10.

---

## 2️⃣ Dépendances

Dans votre projet, installez les packages de test :

```bash
# Tests unitaires et UI
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native

# Tests end-to-end (choisissez l’un des deux)
npm install --save-dev detox        # ou
npm install --save-dev maestro-cli

```

- `jest` : moteur de tests JavaScript/TypeScript.
- `@testing-library/react-native` + `@testing-library/jest-native` : tests de composants et assertions enrichies.
- `detox` ou `maestro` : tests end-to-end sur émulateur/simulateur.

> Expliquez dans votre README quel outil E2E vous avez choisi et pourquoi.
> 

---

## 3️⃣ Organisation des fichiers

```
src/
  __tests__/                 # tests unitaires
  components/__tests__/      # tests de composants
  e2e/                        # scénarios end-to-end

```

- `.test.ts` → tests unitaires et UI
- `.spec.ts` → scénarios end-to-end

---

## 4️⃣ Partie A — Tests unitaires

### Objectif

Vérifier une **logique pure** (sans UI) : par exemple un **reducer** de votre TP6 (Zustand ou Redux Toolkit).

### Tâches

1. Créez un fichier `src/__tests__/robotsReducer.test.ts`.
2. Écrivez au moins **3 tests** :
    - Ajout d’un robot valide.
    - Rejet si le `name` est déjà utilisé.
    - Suppression d’un robot par `id`.

### Exemple d’amorce

```tsx
import robotsReducer, { addRobot, deleteRobot } from '../features/robots/robotsSlice';

test('ajoute un robot', () => {
  const initial = { items: [] };
  const robot = { id:'1', name:'R2D2', label:'Astro', year:2023, type:'service' };
  const state = robotsReducer(initial, addRobot(robot));
  expect(state.items).toHaveLength(1);
});

```

---

## 5️⃣ Partie B — Tests de composants / UI

### Objectif

Tester l’**interactivité** du formulaire de création de robot.

### Tâches

1. Créez `components/__tests__/RobotForm.test.tsx`.
2. Rendez le composant avec `render(<RobotForm … />)`.
3. Vérifiez que :
    - Le bouton **Submit est désactivé** quand le formulaire est vide.
    - Une erreur s’affiche si l’utilisateur saisit une année invalide.
    - Après saisie valide, un clic sur **Submit** appelle bien `onSubmit`.

### Exemple d’amorce

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import RobotForm from '../RobotForm';

test('submit disabled when form invalid', () => {
  const { getByText } = render(<RobotForm onSubmit={() => {}} />);
  expect(getByText('Enregistrer').props.disabled).toBe(true);
});

```

---

## 6️⃣ Partie C — Test end-to-end (E2E)

### Objectif

Rejouer un **parcours utilisateur complet** sur l’application.

### Scénario minimal obligatoire

1. Ouvrir l’app.
2. Aller dans la section **Robots**.
3. Créer un robot nommé `TP7Bot`.
4. Vérifier que `TP7Bot` apparaît dans la liste.
5. Supprimer `TP7Bot` et confirmer qu’il n’est plus présent.

### Étapes

- Choisissez **Detox** ou **Maestro** :
    - **Detox** : nécessite build iOS/Android ; ajoutez des `testID` sur les éléments.
    - **Maestro** : écrit en YAML ou TypeScript, plus rapide pour un premier scénario.

### Exemple d’amorce (Detox)

```jsx
describe('Robots E2E', () => {
  it('crée et supprime un robot', async () => {
    await element(by.id('addRobotBtn')).tap();
    await element(by.id('nameInput')).typeText('TP7Bot');
    await element(by.id('submitBtn')).tap();
    await expect(element(by.text('TP7Bot'))).toBeVisible();
    await element(by.id('delete_TP7Bot')).tap();
    await expect(element(by.text('TP7Bot'))).toBeNotVisible();
  });
});

```

---

## 7️⃣ Bonnes pratiques à respecter

- **Un test = un comportement** : nom explicite.
- Nettoyer les mocks (`afterEach(jest.clearAllMocks)`).
- Ne pas dépendre du réseau : **mocker `fetch`** si nécessaire.
- Séparer **unitaires**, **UI** et **E2E** pour exécuter rapidement les tests courts.

---

## 8️⃣ Tests manuels

En complément (non noté) :

- Vérifier qu’aucun warning ou erreur Jest n’apparaît.
- Vérifier que tous les tests passent avec `npm test`.




