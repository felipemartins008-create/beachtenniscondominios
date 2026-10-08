const express = require('express');
const fs = require('fs');
const path = require('path');
const { generateCondoPage } = require('./template');

const app = express();
const PORT = process.env.PORT || 3333;

const { exec } = require('child_process');

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'condominios.json');
const CONFIG_FILE = path.join(__dirname, 'config.json');

function getCondominios() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveCondominios(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function getConfig() {
  if (!fs.existsSync(CONFIG_FILE)) return { baseUrl: `http://localhost:${PORT}` };
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
}

function saveConfig(data) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// API: Obter todos os condomínios
app.get('/api/condominios', (req, res) => {
  const condominios = getCondominios();
  const config = getConfig();
  res.json({ condominios, config });
});

// API: Atualizar configuração (domínio/baseUrl)
app.post('/api/config', (req, res) => {
  const { baseUrl } = req.body;
  const config = getConfig();
  config.baseUrl = baseUrl ? baseUrl.replace(/\/$/, '') : '';
  saveConfig(config);
  res.json({ success: true, config });
});

// Helper to generate slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// API: Criar novo condomínio (com suporte a imagem personalizada)
app.post('/api/condominios', (req, res) => {
  try {
    if (process.env.VERCEL) {
      return res.status(400).json({ 
        error: 'Para cadastrar condomínios e subir imagens, acesse o painel no seu computador em http://localhost:3333 e clique em Sincronizar com a Vercel!' 
      });
    }

    const { nome, whatsappLink, cidade, quadra, descricao, imageBase64 } = req.body;
    if (!nome || !whatsappLink) {
      return res.status(400).json({ error: 'Nome e Link do WhatsApp são obrigatórios' });
    }

    const condominios = getCondominios();
    let slug = generateSlug(nome);

    // Avoid duplicate slugs
    let count = 1;
    let finalSlug = slug;
    while (condominios.some(c => c.slug === finalSlug)) {
      finalSlug = `${slug}-${count++}`;
    }

    // Handle custom image upload if provided
    let bannerUrl = '/assets/banner-beach-tennis.jpg';
    if (imageBase64 && typeof imageBase64 === 'string') {
      try {
        const base64Data = imageBase64.includes('base64,')
          ? imageBase64.split('base64,')[1]
          : imageBase64;
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `banner-${finalSlug}.jpg`;
        const assetsDir = path.join(__dirname, 'public', 'assets');
        if (!fs.existsSync(assetsDir)) {
          fs.mkdirSync(assetsDir, { recursive: true });
        }
        fs.writeFileSync(path.join(assetsDir, fileName), buffer);
        bannerUrl = `/assets/${fileName}`;
      } catch (err) {
        console.error('Erro ao salvar imagem customizada:', err);
      }
    }

    const novo = {
      id: Date.now().toString(),
      slug: finalSlug,
      nome: nome.trim(),
      cidade: cidade ? cidade.trim() : 'Condomínio',
      quadra: quadra ? quadra.trim() : 'Quadra de Areia',
      whatsappLink: whatsappLink.trim(),
      bannerUrl: bannerUrl,
      descricao: descricao ? descricao.trim() : `Turmas para iniciantes, intermediários, adultos e crianças. Aprenda ou evolua seu jogo sem sair de casa!`,
      beneficios: [
        'Aulas práticas na quadra do seu condomínio',
        'Horários flexíveis (manhã, tarde e noite)',
        'Material fornecido pelo professor (raquetes e bolinhas)',
        'Turmas divididas por nível e idade'
      ]
    };

    condominios.unshift(novo);
    saveCondominios(condominios);

    res.json({ success: true, item: novo });
  } catch (err) {
    console.error('Erro ao cadastrar condomínio:', err);
    res.status(500).json({ error: 'Erro interno ao salvar: ' + err.message });
  }
});

// API: Publicar/Sincronizar com o GitHub / Vercel com 1 clique
app.post('/api/publish', (req, res) => {
  exec('git add . && git commit -m "feat: adicionar condominios e imagens" && git push origin main', (error, stdout, stderr) => {
    if (error) {
      // If nothing to commit, still consider it fine
      if (stderr && stderr.includes('nothing to commit')) {
        return res.json({ success: true, message: 'Já está tudo atualizado na Vercel!' });
      }
      console.error('Erro no git push:', stderr || error.message);
      return res.status(500).json({ error: 'Erro ao enviar para o GitHub: ' + (stderr || error.message) });
    }
    res.json({ success: true, message: 'Alterações enviadas para a Vercel com sucesso!' });
  });
});

// API: Excluir condomínio
app.delete('/api/condominios/:id', (req, res) => {
  let condominios = getCondominios();
  condominios = condominios.filter(c => c.id !== req.params.id);
  saveCondominios(condominios);
  res.json({ success: true });
});

// API: Upload de imagem para nuvem com Imgur CDN ultra-rápido e permanente
async function uploadToCloud(buffer) {
  const base64Data = buffer.toString('base64');
  const clientIds = ['546c25a59c58ad7', 'e1ff1b53c613e51', '28eb2e1f1634699'];

  for (const clientId of clientIds) {
    try {
      const res = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': `Client-ID ${clientId}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: base64Data, type: 'base64' })
      });
      const json = await res.json();
      if (json.success && json.data?.link) {
        return json.data.link.replace('http://', 'https://');
      }
    } catch (err) {
      console.warn(`Imgur ${clientId} falhou:`, err.message);
    }
  }

  throw new Error('Não foi possível hospedar a imagem no momento. Tente novamente em alguns segundos.');
}

app.post('/api/upload-image', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const base64Data = imageBase64.includes('base64,')
      ? imageBase64.split('base64,')[1]
      : imageBase64;
    const buffer = Buffer.from(base64Data, 'base64');

    const fileUrl = await uploadToCloud(buffer);
    res.json({ success: true, url: fileUrl });
  } catch (err) {
    console.error('Erro no upload de imagem:', err);
    res.status(500).json({ error: 'Erro ao hospedar imagem: ' + err.message });
  }
});

// Rota de condomínio gerada online (100% cloud sem banco)
app.get('/c', (req, res) => {
  const { n, nome, g, zap, w, i, img, c, cidade } = req.query;
  const condoNome = n || nome || 'Condomínio';
  const rawZap = g || zap || w || '';
  const whatsappLink = rawZap.startsWith('http')
    ? rawZap
    : `https://chat.whatsapp.com/${rawZap}`;

  let bannerUrl = i || img || '/assets/banner-beach-tennis.jpg';
  if (bannerUrl && !bannerUrl.startsWith('http') && !bannerUrl.startsWith('/')) {
    bannerUrl = `https://files.catbox.moe/${bannerUrl}`;
  }

  const condo = {
    nome: condoNome,
    cidade: c || cidade || 'Condomínio',
    quadra: 'Quadra de Areia / Beach Tennis',
    whatsappLink: whatsappLink,
    bannerUrl: bannerUrl,
    descricao: ''
  };

  const config = getConfig();
  const host = config.baseUrl || `${req.protocol}://${req.get('host')}`;
  const html = generateCondoPage(condo, host);
  res.send(html);
});

// Rota de cada condomínio com Open Graph dinâmico
app.get('/:slug', (req, res, next) => {
  const condominios = getCondominios();
  const condo = condominios.find(c => c.slug === req.params.slug);

  if (!condo) {
    return next();
  }

  const config = getConfig();
  const host = config.baseUrl || `${req.protocol}://${req.get('host')}`;
  const html = generateCondoPage(condo, host);
  res.send(html);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🎾 Painel de Links de Beach Tennis rodando em:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`=================================================\n`);
  });
}

module.exports = app;
