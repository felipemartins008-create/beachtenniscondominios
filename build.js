const fs = require('fs');
const path = require('path');
const { generateCondoPage } = require('./template');

function build() {
  console.log('🎾 Iniciando build dos links dos condomínios...');

  const configPath = path.join(__dirname, 'config.json');
  let config = { baseUrl: '' };
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  const condominiosPath = path.join(__dirname, 'condominios.json');
  const condominios = JSON.parse(fs.readFileSync(condominiosPath, 'utf8'));

  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Copy assets folder to dist
  const assetsSrc = path.join(__dirname, 'public', 'assets');
  const assetsDest = path.join(distDir, 'assets');
  if (fs.existsSync(assetsSrc)) {
    fs.mkdirSync(assetsDest, { recursive: true });
    const files = fs.readdirSync(assetsSrc);
    for (const file of files) {
      fs.copyFileSync(path.join(assetsSrc, file), path.join(assetsDest, file));
    }
    console.log(`✓ Assets copiados para dist/assets (${files.length} arquivos)`);
  }

  // Build each condominium page as dist/<slug>/index.html
  for (const condo of condominios) {
    const condoDir = path.join(distDir, condo.slug);
    if (!fs.existsSync(condoDir)) {
      fs.mkdirSync(condoDir, { recursive: true });
    }
    const html = generateCondoPage(condo, config.baseUrl);
    fs.writeFileSync(path.join(condoDir, 'index.html'), html, 'utf8');
    console.log(`✓ Página criada: /${condo.slug} (${condo.nome})`);
  }

  // Copy or create root index.html
  const publicIndex = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(publicIndex)) {
    fs.copyFileSync(publicIndex, path.join(distDir, 'index.html'));
  }

  console.log('\n🎉 Build concluído com sucesso!');
  console.log(`📁 Todos os arquivos prontos na pasta 'dist/' para hospedar no Vercel/Netlify/GitHub.`);
}

build();
