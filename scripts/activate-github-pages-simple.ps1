# React Book - GitHub Pages Activation Script (PowerShell)
# Ce script aide a activer GitHub Pages pour le repository

Write-Host "Activation de GitHub Pages pour React Book" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""

# Configuration
$REPO_OWNER = "michaelgermini"
$REPO_NAME = "react-book"

Write-Host "Lien direct vers GitHub Pages :" -ForegroundColor Green
Write-Host "https://github.com/$REPO_OWNER/$REPO_NAME/settings/pages" -ForegroundColor White
Write-Host ""

# Instructions manuelles
Write-Host "Etapes manuelles :" -ForegroundColor Cyan
Write-Host "1. Cliquez sur le lien ci-dessus" -ForegroundColor White
Write-Host "2. Dans 'Source', selectionnez 'Deploy from a branch'" -ForegroundColor White
Write-Host "3. Dans 'Branch', selectionnez 'main'" -ForegroundColor White
Write-Host "4. Dans 'Folder', selectionnez '/(root)'" -ForegroundColor White
Write-Host "5. Cliquez sur 'Save'" -ForegroundColor White
Write-Host ""

Write-Host "Votre site sera sur : https://$REPO_OWNER.github.io/$REPO_NAME" -ForegroundColor Green
Write-Host ""
Write-Host "Activation terminee !" -ForegroundColor Green
