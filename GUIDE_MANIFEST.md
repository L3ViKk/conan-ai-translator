# Guide d'Installation via Manifest - Conan AI Translator

Ce guide est spécialement conçu pour les administrateurs qui n'ont pas accès direct aux fichiers du serveur Foundry VTT.

## Vue d'ensemble

L'installation via manifest permet d'installer le module directement depuis une URL, sans avoir besoin d'accéder aux fichiers du serveur. C'est idéal si vous êtes admin mais n'avez pas accès SSH/FTP.

## Étape 1 : Préparer le module pour l'hébergement

### Structure des fichiers

Assurez-vous que votre module a cette structure :
```
conan-ai-translator/
├── manifest.json          ← Fichier principal pour l'installation
├── module.json            ← Configuration du module
├── scripts/
│   └── translate-compendium.js
├── templates/
│   └── translate-dialog.html
├── styles/
│   └── translate-module.css
├── lang/
│   ├── fr.json
│   └── en.json
└── README.md
```

## Étape 2 : Choisir un hébergement

### Option A : GitHub (Recommandée - Gratuite)

**Avantages** :
- Gratuit
- Facile à utiliser
- URLs stables
- Versioning automatique

**Étapes** :

1. **Créer un compte GitHub** (si vous n'en avez pas)
   - Allez sur https://github.com
   - Créez un compte gratuit

2. **Créer un nouveau dépôt** :
   - Cliquez sur "New repository"
   - Nom : `conan-ai-translator`
   - Visibilité : Public ou Private (votre choix)
   - Ne cochez PAS "Initialize with README" (vous avez déjà les fichiers)

3. **Uploader les fichiers** :
   - Cliquez sur "uploading an existing file"
   - Glissez-déposez tous les fichiers du module
   - Commitez avec le message "Initial release"

4. **Créer une release (optionnel mais recommandé)** :
   - Allez dans "Releases" > "Create a new release"
   - Tag : `v1.0.0`
   - Title : `Version 1.0.0`
   - Description : Description du module
   - Cliquez sur "Publish release"

5. **Configurer manifest.json** :
   - Ouvrez `manifest.json` dans GitHub
   - Cliquez sur l'icône crayon pour éditer
   - Remplacez `VOTRE-USERNAME` par votre nom d'utilisateur GitHub
   - Exemple :
     ```json
     "url": "https://github.com/monusername/conan-ai-translator",
     "manifest": "https://raw.githubusercontent.com/monusername/conan-ai-translator/main/manifest.json",
     "download": "https://github.com/monusername/conan-ai-translator/archive/refs/heads/main.zip"
     ```
   - Si vous avez créé une release :
     ```json
     "download": "https://github.com/monusername/conan-ai-translator/releases/download/v1.0.0/conan-ai-translator.zip"
     ```
   - Commitez les changements

6. **Vérifier que le manifest est accessible** :
   - Ouvrez dans un navigateur : `https://raw.githubusercontent.com/monusername/conan-ai-translator/main/manifest.json`
   - Vous devriez voir le JSON du manifest

### Option B : GitLab (Alternative gratuite)

Similaire à GitHub, mais avec les URLs GitLab :
```json
"url": "https://gitlab.com/monusername/conan-ai-translator",
"manifest": "https://gitlab.com/monusername/conan-ai-translator/-/raw/main/manifest.json",
"download": "https://gitlab.com/monusername/conan-ai-translator/-/archive/main/conan-ai-translator-main.zip"
```

### Option C : Serveur web personnel

Si vous avez un serveur web (hébergement web classique) :

1. **Uploadez le module** via FTP/SFTP dans un dossier accessible
2. **Créez un ZIP** du module et uploadez-le
3. **Configurez manifest.json** :
   ```json
   "url": "https://votre-domaine.com/modules/conan-ai-translator",
   "manifest": "https://votre-domaine.com/modules/conan-ai-translator/manifest.json",
   "download": "https://votre-domaine.com/modules/conan-ai-translator/conan-ai-translator.zip"
   ```

## Étape 3 : Installer dans Foundry VTT

1. **Connectez-vous à Foundry VTT** en tant qu'administrateur

2. **Allez dans Configuration** > **Gestionnaire de modules**

3. **Cliquez sur "Installer le module"** (bouton en bas)

4. **Collez l'URL du manifest** :
   - Pour GitHub : `https://raw.githubusercontent.com/VOTRE-USERNAME/conan-ai-translator/main/manifest.json`
   - Pour GitLab : `https://gitlab.com/VOTRE-USERNAME/conan-ai-translator/-/raw/main/manifest.json`
   - Pour serveur web : `https://votre-domaine.com/modules/conan-ai-translator/manifest.json`

5. **Cliquez sur "Installer"**

6. **Attendez que l'installation se termine**

7. **Cochez la case** à côté de "Conan AI Translator" pour l'activer

8. **Cliquez sur "Mettre à jour les modules"**

## Étape 4 : Vérifier l'installation

1. **Rechargez la page** Foundry VTT (F5)

2. **Ouvrez le Compendium Directory** (icône de livre)

3. **Vérifiez que le bouton "Traduire les compendiums"** apparaît en haut à droite

4. **Allez dans Configuration** > **Paramètres du monde**

5. **Vérifiez que la section "Conan AI Translator"** est présente

## Mise à jour du module

Quand vous mettez à jour le module :

1. **Mettez à jour les fichiers** sur votre hébergement (GitHub, GitLab, etc.)

2. **Mettez à jour la version** dans `manifest.json` :
   ```json
   "version": "1.0.1"
   ```

3. **Dans Foundry VTT** :
   - Allez dans **Configuration** > **Gestionnaire de modules**
   - Trouvez "Conan AI Translator"
   - Cliquez sur l'icône de mise à jour (flèche circulaire)
   - Ou désinstallez et réinstallez

## Dépannage

### Le manifest n'est pas accessible

- Vérifiez que l'URL est correcte dans votre navigateur
- Vérifiez que le fichier `manifest.json` existe bien à cet emplacement
- Pour GitHub : assurez-vous que le dépôt est public OU que vous avez configuré l'accès

### L'installation échoue

- Vérifiez que l'URL de téléchargement fonctionne (ouvrez-la dans un navigateur)
- Vérifiez que le ZIP contient bien tous les fichiers nécessaires
- Vérifiez la console du navigateur (F12) pour les erreurs

### Le module ne s'active pas

- Vérifiez que tous les fichiers sont présents dans le ZIP
- Vérifiez que `module.json` est valide (JSON valide)
- Vérifiez la console du navigateur (F12) pour les erreurs

### Erreur "Module not found"

- Vérifiez que le chemin dans `module.json` correspond à la structure des fichiers
- Vérifiez que les fichiers JavaScript/CSS existent aux chemins indiqués

## Exemple de manifest.json complet

```json
{
  "id": "conan-ai-translator",
  "title": "Conan AI Translator",
  "description": "Module pour traduire automatiquement les compendiums Conan 2d20 en français",
  "version": "1.0.0",
  "compatibility": {
    "minimum": "13",
    "verified": "13"
  },
  "authors": [
    {
      "name": "Votre Nom"
    }
  ],
  "esmodules": [
    "scripts/translate-compendium.js"
  ],
  "styles": [
    "styles/translate-module.css"
  ],
  "languages": [
    {
      "lang": "fr",
      "name": "Français",
      "path": "lang/fr.json"
    },
    {
      "lang": "en",
      "name": "English",
      "path": "lang/en.json"
    }
  ],
  "url": "https://github.com/monusername/conan-ai-translator",
  "manifest": "https://raw.githubusercontent.com/monusername/conan-ai-translator/main/manifest.json",
  "download": "https://github.com/monusername/conan-ai-translator/archive/refs/heads/main.zip",
  "system": "conan2d20"
}
```

## Support

Si vous rencontrez des problèmes :
1. Vérifiez que tous les fichiers sont bien uploadés
2. Vérifiez que les URLs sont correctes
3. Vérifiez la console du navigateur (F12) pour les erreurs
4. Consultez la documentation Foundry VTT sur les modules

