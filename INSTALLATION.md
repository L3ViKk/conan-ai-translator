# Instructions d'Installation - Conan AI Translator

## Étape 1 : Installer Ollama

1. Téléchargez Ollama depuis https://ollama.com
2. Installez Ollama sur votre système
3. Démarrez Ollama (il devrait être accessible sur http://localhost:11434)

## Étape 2 : Installer le modèle DeepSeek

Ouvrez un terminal et exécutez :

```bash
ollama pull deepseek-v3.1:671b-cloud
```

Cela peut prendre plusieurs minutes selon votre connexion internet.

Vérifiez que le modèle est installé :

```bash
ollama list
```

Vous devriez voir `deepseek-v3.1:671b-cloud` dans la liste.

## Étape 3 : Installer le module dans Foundry VTT

### Option A : Installation manuelle (recommandée pour le développement)

1. Trouvez le dossier `modules` de votre installation Foundry VTT
   - Windows : `%LOCALAPPDATA%\FoundryVTT\Data\modules`
   - Linux/Mac : `~/.local/share/FoundryVTT/Data/modules`

2. Copiez le dossier `conan-ai-translator` dans le dossier `modules`

3. Redémarrez Foundry VTT

### Option B : Installation via manifest (recommandée si vous n'avez pas accès direct au serveur)

Cette méthode permet d'installer le module directement depuis une URL, sans avoir besoin d'accéder aux fichiers du serveur.

#### Prérequis

Vous devez héberger le module quelque part (GitHub, GitLab, serveur web, etc.)

#### Méthode 1 : Hébergement sur GitHub (recommandée)

1. **Créer un dépôt GitHub** :
   - Allez sur https://github.com et créez un nouveau dépôt
   - Nommez-le `conan-ai-translator` (ou autre nom)
   - Rendez-le public ou privé selon vos besoins

2. **Uploader les fichiers** :
   - Uploadez tous les fichiers du module dans le dépôt
   - Assurez-vous que la structure de dossiers est préservée

3. **Créer une release ou utiliser la branche main** :
   - **Option A** : Créez une release (recommandé pour la stabilité)
     - Allez dans "Releases" > "Create a new release"
     - Tag : `v1.0.0`
     - Téléversez le module en ZIP
   - **Option B** : Utilisez directement la branche main

4. **Configurer le manifest.json** :
   - Ouvrez `manifest.json` dans le dépôt
   - Remplacez `VOTRE-USERNAME` par votre nom d'utilisateur GitHub
   - Remplacez les URLs par les vôtres :
     ```json
     "url": "https://github.com/VOTRE-USERNAME/conan-ai-translator",
     "manifest": "https://raw.githubusercontent.com/VOTRE-USERNAME/conan-ai-translator/main/manifest.json",
     "download": "https://github.com/VOTRE-USERNAME/conan-ai-translator/archive/refs/heads/main.zip"
     ```
   - Si vous utilisez une release, utilisez :
     ```json
     "download": "https://github.com/VOTRE-USERNAME/conan-ai-translator/releases/download/v1.0.0/conan-ai-translator.zip"
     ```

5. **Installer dans Foundry VTT** :
   - Connectez-vous à Foundry VTT en tant qu'admin
   - Allez dans **Configuration** > **Gestionnaire de modules**
   - Cliquez sur **Installer le module**
   - Collez l'URL du manifest : `https://raw.githubusercontent.com/VOTRE-USERNAME/conan-ai-translator/main/manifest.json`
   - Cliquez sur **Installer**

#### Méthode 2 : Hébergement sur un serveur web

1. **Uploadez le module** sur votre serveur web (via FTP, SSH, etc.)
   - Assurez-vous que tous les fichiers sont accessibles via HTTP/HTTPS

2. **Configurez le manifest.json** :
   ```json
   "url": "https://votre-domaine.com/conan-ai-translator",
   "manifest": "https://votre-domaine.com/conan-ai-translator/manifest.json",
   "download": "https://votre-domaine.com/conan-ai-translator/conan-ai-translator.zip"
   ```

3. **Créez un ZIP du module** :
   - Compressez le dossier `conan-ai-translator` en ZIP
   - Uploadez-le à l'URL spécifiée dans `download`

4. **Installez dans Foundry VTT** :
   - Allez dans **Configuration** > **Gestionnaire de modules**
   - Cliquez sur **Installer le module**
   - Collez l'URL du manifest : `https://votre-domaine.com/conan-ai-translator/manifest.json`
   - Cliquez sur **Installer**

#### Méthode 3 : Utiliser GitLab

Similaire à GitHub, mais avec les URLs GitLab :
```json
"url": "https://gitlab.com/VOTRE-USERNAME/conan-ai-translator",
"manifest": "https://gitlab.com/VOTRE-USERNAME/conan-ai-translator/-/raw/main/manifest.json",
"download": "https://gitlab.com/VOTRE-USERNAME/conan-ai-translator/-/archive/main/conan-ai-translator-main.zip"
```

#### Vérification du manifest

Avant d'installer, vérifiez que votre manifest est accessible :
- Ouvrez l'URL du manifest dans un navigateur
- Vous devriez voir le contenu JSON du manifest
- Vérifiez que l'URL de téléchargement fonctionne aussi

## Étape 4 : Activer le module

1. Ouvrez Foundry VTT
2. Sélectionnez votre monde "conan"
3. Allez dans **Configuration** > **Gestionnaire de modules**
4. Cochez **Conan AI Translator**
5. Cliquez sur **Mettre à jour les modules**

## Étape 5 : Configurer le module

1. Dans votre monde, allez dans **Configuration** > **Paramètres du monde**
2. Trouvez la section **Conan AI Translator**
3. Vérifiez que :
   - **URL Ollama** : `http://localhost:11434` (ou votre URL personnalisée)
   - **Modèle Ollama** : `deepseek-v3.1:671b-cloud`

## Étape 6 : Utiliser le module

1. Ouvrez le **Compendium Directory** (icône de livre)
2. Cliquez sur le bouton **"Traduire les compendiums"** en haut à droite
3. Sélectionnez les compendiums à traduire
4. Cliquez sur **"Traduire"**
5. Attendez que la traduction se termine

## Vérification

Pour vérifier que tout fonctionne :

1. Testez la connexion Ollama :
   ```bash
   curl http://localhost:11434/api/tags
   ```
   Vous devriez recevoir une réponse JSON avec la liste des modèles.

2. Dans Foundry VTT, ouvrez la console (F12) et vérifiez qu'il n'y a pas d'erreurs.

## Dépannage

### Ollama ne répond pas

- Vérifiez qu'Ollama est démarré : `ollama list`
- Vérifiez l'URL dans les paramètres du module
- Testez avec : `curl http://localhost:11434/api/tags`

### Le modèle n'est pas trouvé

- Vérifiez que le modèle est installé : `ollama list`
- Installez-le : `ollama pull deepseek-v3.1:671b-cloud`

### Erreurs CORS dans le navigateur

Si vous utilisez une URL Ollama différente de localhost, vous devrez peut-être configurer CORS dans Ollama ou utiliser un proxy.

### Le bouton n'apparaît pas

- Vérifiez que le module est activé
- Rechargez la page (F5)
- Vérifiez la console pour les erreurs (F12)

## Support

Pour toute question, consultez le README.md ou la documentation Foundry VTT.

