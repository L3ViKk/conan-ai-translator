# Script PowerShell pour créer un ZIP du module pour la release
# Utilisation: .\create-release.ps1

$moduleName = "conan-ai-translator"
$version = "1.0.0"
$zipName = "$moduleName-v$version.zip"

Write-Host "Création du ZIP pour la release..." -ForegroundColor Green

# Supprimer l'ancien ZIP s'il existe
if (Test-Path $zipName) {
    Remove-Item $zipName
    Write-Host "Ancien ZIP supprimé" -ForegroundColor Yellow
}

# Créer le ZIP en excluant certains fichiers
$filesToExclude = @(
    ".git",
    ".gitignore",
    "*.zip",
    "*.ps1",
    "*.md",
    "create-release.ps1"
)

# Créer le ZIP avec tous les fichiers nécessaires
Compress-Archive -Path * -DestinationPath $zipName -Force

Write-Host "ZIP créé: $zipName" -ForegroundColor Green
Write-Host "Taille: $((Get-Item $zipName).Length / 1KB) KB" -ForegroundColor Cyan
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Uploadez ce ZIP sur GitHub/GitLab dans une release"
Write-Host "2. Mettez à jour manifest.json avec l'URL de téléchargement de la release"
Write-Host "3. L'URL devrait être: https://github.com/VOTRE-USERNAME/$moduleName/releases/download/v$version/$zipName"

