# React Book - GitHub Pages Activation Script (PowerShell)
# Ce script aide à activer GitHub Pages pour le repository

Write-Host "🌐 Activation de GitHub Pages pour React Book" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""

# Configuration
$REPO_OWNER = "michaelgermini"
$REPO_NAME = "react-book"
$GITHUB_API_URL = "https://api.github.com"

Write-Host "📋 Méthodes d'activation disponibles :" -ForegroundColor Cyan
Write-Host "1. 🔗 Lien direct vers les paramètres GitHub Pages" -ForegroundColor Yellow
Write-Host "2. 🤖 Activation automatique via API (nécessite un token)" -ForegroundColor Yellow
Write-Host ""

# Option 1 : Lien direct
Write-Host "🔗 Lien direct vers GitHub Pages :" -ForegroundColor Green
Write-Host "https://github.com/$REPO_OWNER/$REPO_NAME/settings/pages" -ForegroundColor White
Write-Host ""

# Instructions manuelles
Write-Host "📋 Étapes manuelles :" -ForegroundColor Cyan
Write-Host "1. Cliquez sur le lien ci-dessus" -ForegroundColor White
Write-Host "2. Dans 'Source', sélectionnez 'Deploy from a branch'" -ForegroundColor White
Write-Host "3. Dans 'Branch', sélectionnez 'main'" -ForegroundColor White
Write-Host "4. Dans 'Folder', sélectionnez '/(root)'" -ForegroundColor White
Write-Host "5. Cliquez sur 'Save'" -ForegroundColor White
Write-Host ""

# Option 2 : Activation automatique
$useApi = Read-Host "🤖 Voulez-vous essayer l'activation automatique ? (y/N)"

if ($useApi -eq "y" -or $useApi -eq "Y") {
    Write-Host ""
    Write-Host "💡 Pour créer un token GitHub :" -ForegroundColor Cyan
    Write-Host "1. Allez sur : https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "2. Cliquez sur 'Generate new token'" -ForegroundColor White
    Write-Host "3. Sélectionnez 'repo' et 'workflow' permissions" -ForegroundColor White
    Write-Host "4. Copiez le token généré" -ForegroundColor White
    Write-Host ""
    
    $token = Read-Host "🔑 Entrez votre token GitHub (ou appuyez sur Entrée pour ignorer)"
    
    if ($token) {
        Write-Host "🔄 Activation de GitHub Pages via API..." -ForegroundColor Yellow
        
        $headers = @{
            "Authorization" = "token $token"
            "User-Agent" = "React-Book-GitHub-Pages-Activator"
            "Accept" = "application/vnd.github.v3+json"
            "Content-Type" = "application/json"
        }
        
        $body = @{
            source = @{
                type = "branch"
                branch = "main"
            }
        } | ConvertTo-Json
        
        try {
            $response = Invoke-RestMethod -Uri "$GITHUB_API_URL/repos/$REPO_OWNER/$REPO_NAME/pages" -Method POST -Headers $headers -Body $body
            
            Write-Host "✅ GitHub Pages activé avec succès !" -ForegroundColor Green
            Write-Host "🌐 Votre site sera disponible sur : https://$REPO_OWNER.github.io/$REPO_NAME" -ForegroundColor White
            Write-Host "⏱️  Le déploiement peut prendre quelques minutes..." -ForegroundColor Yellow
        }
        catch {
            Write-Host "Erreur lors de l'activation :" -ForegroundColor Red
            Write-Host $_.Exception.Message -ForegroundColor Red
            Write-Host ""
            Write-Host "📋 Utilisez la méthode manuelle :" -ForegroundColor Cyan
            Write-Host "https://github.com/$REPO_OWNER/$REPO_NAME/settings/pages" -ForegroundColor White
        }
    }
    else {
        Write-Host "⚠️  Aucun token fourni. Utilisez la méthode manuelle." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🌐 Votre site sera sur : https://$REPO_OWNER.github.io/$REPO_NAME" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Activation terminée !" -ForegroundColor Green
