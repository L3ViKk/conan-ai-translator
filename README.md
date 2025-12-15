# Conan AI Translator - Module Foundry VTT

Module pour traduire automatiquement les compendiums Conan 2d20 en français en utilisant DeepSeek v3.1 via Ollama.

## Installation

### Prérequis

1. **Ollama installé et démarré**
   - Téléchargez Ollama depuis https://ollama.com
   - Installez-le sur votre système
   - Démarrez Ollama

2. **Modèle DeepSeek v3.1 installé**
   ```bash
   ollama pull deepseek-v3.1:671b-cloud
   ```

### Installation du module

1. Copiez le dossier `conan-ai-translator` dans le dossier `modules` de votre installation Foundry VTT
2. Redémarrez Foundry VTT
3. Activez le module dans les paramètres du monde

## Configuration

1. Ouvrez les **Paramètres du monde** dans Foundry VTT
2. Trouvez la section **Conan AI Translator**
3. Configurez :
   - **URL Ollama** : Par défaut `http://localhost:11434`
   - **Modèle Ollama** : Par défaut `deepseek-v3.1:671b-cloud`

## Utilisation

1. Ouvrez le **Compendium Directory** dans Foundry VTT
2. Cliquez sur le bouton **"Traduire les compendiums"** en haut à droite
3. Sélectionnez les compendiums à traduire
4. Cliquez sur **"Traduire"**
5. Attendez que la traduction se termine (une barre de progression s'affiche)

## Fonctionnalités

- ✅ Traduction automatique de tous les champs textuels (noms, descriptions, etc.)
- ✅ Support de tous les types de compendiums (Items, Actors, Journal Entries, etc.)
- ✅ Cache de traduction pour éviter les traductions en double
- ✅ Barre de progression en temps réel
- ✅ Interface utilisateur intuitive
- ✅ Configuration flexible (URL et modèle Ollama)

## Champs traduits

Le module traduit automatiquement :
- **Noms** (`name`)
- **Descriptions** (`description`)
- **Contenu système** (`system.description`, `system.effects`, etc.)
- **Biographies** (pour les acteurs)
- **Contenu des journaux** (pour les entrées de journal)

## Notes importantes

- ⚠️ **Sauvegarde** : Faites une sauvegarde de votre monde avant d'utiliser le module
- ⚠️ **Temps de traduction** : La traduction peut prendre du temps selon le nombre d'éléments
- ⚠️ **Qualité** : Vérifiez toujours les traductions, surtout pour les termes techniques
- ⚠️ **Ollama** : Assurez-vous qu'Ollama est démarré avant de lancer une traduction

## Dépannage

### Ollama n'est pas disponible

- Vérifiez qu'Ollama est démarré : `ollama list`
- Vérifiez l'URL dans les paramètres du module
- Testez la connexion : `curl http://localhost:11434/api/tags`

### Le modèle n'est pas trouvé

- Vérifiez que le modèle est installé : `ollama list`
- Installez-le si nécessaire : `ollama pull deepseek-v3.1:671b-cloud`

### Traductions incorrectes

- Le module utilise un prompt optimisé, mais certaines traductions peuvent nécessiter des ajustements manuels
- Vérifiez les traductions importantes après utilisation

## Structure du module

```
conan-ai-translator/
├── module.json              # Manifeste du module
├── scripts/
│   └── translate-compendium.js  # Script principal
├── templates/
│   └── translate-dialog.html     # Interface utilisateur
├── styles/
│   └── translate-module.css      # Styles CSS
├── lang/
│   ├── fr.json                   # Traductions françaises
│   └── en.json                   # Traductions anglaises
└── README.md                     # Ce fichier
```

## Licence

Ce module est fourni tel quel, sans garantie. Utilisez-le à vos risques et périls.

## Support

Pour toute question ou problème, consultez la documentation Foundry VTT ou la communauté.

