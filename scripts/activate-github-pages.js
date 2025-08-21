#!/usr/bin/env node

/**
 * Script pour activer GitHub Pages automatiquement
 * Utilise l'API GitHub pour configurer le déploiement
 */

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const REPO_OWNER = 'michaelgermini';
const REPO_NAME = 'react-book';
const GITHUB_API_URL = 'api.github.com';

console.log('🌐 Activation de GitHub Pages pour React Book');
console.log('==============================================\n');

// Demander le token GitHub
rl.question('🔑 Entrez votre token GitHub (ou appuyez sur Entrée pour ignorer): ', (token) => {
  if (!token) {
    console.log('\n⚠️  Aucun token fourni. Activation manuelle requise.');
    console.log('\n📋 Étapes manuelles :');
    console.log('1. Allez sur : https://github.com/michaelgermini/react-book/settings/pages');
    console.log('2. Source : Deploy from a branch');
    console.log('3. Branch : main');
    console.log('4. Folder : /(root)');
    console.log('5. Save');
    console.log('\n🌐 Votre site sera sur : https://michaelgermini.github.io/react-book');
    rl.close();
    return;
  }

  activateGitHubPages(token);
});

function activateGitHubPages(token) {
  const data = JSON.stringify({
    source: {
      type: 'branch',
      branch: 'main'
    }
  });

  const options = {
    hostname: GITHUB_API_URL,
    port: 443,
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/pages`,
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'User-Agent': 'React-Book-GitHub-Pages-Activator',
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  console.log('🔄 Activation de GitHub Pages...');

  const req = https.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 201) {
        console.log('✅ GitHub Pages activé avec succès !');
        console.log('🌐 Votre site sera disponible sur : https://michaelgermini.github.io/react-book');
        console.log('⏱️  Le déploiement peut prendre quelques minutes...');
      } else {
        console.log('❌ Erreur lors de l\'activation :', res.statusCode);
        console.log('📄 Réponse :', responseData);
        console.log('\n📋 Utilisez la méthode manuelle :');
        console.log('https://github.com/michaelgermini/react-book/settings/pages');
      }
      rl.close();
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur de connexion :', error.message);
    console.log('\n📋 Utilisez la méthode manuelle :');
    console.log('https://github.com/michaelgermini/react-book/settings/pages');
    rl.close();
  });

  req.write(data);
  req.end();
}

// Instructions pour créer un token GitHub
console.log('💡 Pour créer un token GitHub :');
console.log('1. Allez sur : https://github.com/settings/tokens');
console.log('2. Cliquez sur "Generate new token"');
console.log('3. Sélectionnez "repo" et "workflow" permissions');
console.log('4. Copiez le token généré\n');
