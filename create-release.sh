#!/bin/bash
# Script bash pour créer un ZIP du module pour la release
# Utilisation: ./create-release.sh

MODULE_NAME="conan-ai-translator"
VERSION="1.0.0"
ZIP_NAME="${MODULE_NAME}-v${VERSION}.zip"

echo "Création du ZIP pour la release..."

# Supprimer l'ancien ZIP s'il existe
if [ -f "$ZIP_NAME" ]; then
    rm "$ZIP_NAME"
    echo "Ancien ZIP supprimé"
fi

# Créer le ZIP en excluant certains fichiers
zip -r "$ZIP_NAME" . \
    -x "*.git*" \
    -x "*.zip" \
    -x "*.ps1" \
    -x "*.sh" \
    -x "*.md" \
    -x "create-release.*"

echo ""
echo "ZIP créé: $ZIP_NAME"
echo "Taille: $(du -h "$ZIP_NAME" | cut -f1)"
echo ""
echo "Prochaines étapes:"
echo "1. Uploadez ce ZIP sur GitHub/GitLab dans une release"
echo "2. Mettez à jour manifest.json avec l'URL de téléchargement de la release"
echo "3. L'URL devrait être: https://github.com/VOTRE-USERNAME/$MODULE_NAME/releases/download/v$VERSION/$ZIP_NAME"

