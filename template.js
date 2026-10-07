function generateCondoPage(condo, baseUrl = '') {
  // Ensure absolute image URL for WhatsApp Open Graph scraper
  const absoluteImageUrl = condo.bannerUrl.startsWith('http')
    ? condo.bannerUrl
    : `${baseUrl.replace(/\/$/, '')}${condo.bannerUrl.startsWith('/') ? '' : '/'}${condo.bannerUrl}`;

  const pageTitle = `🎾 Beach Tennis no ${condo.nome} | Agendamento`;
  const pageDesc = condo.descricao || '';

  const beneficiosHtml = (condo.beneficios || [
    'Aulas práticas na quadra do seu condomínio',
    'Horários flexíveis (manhã, tarde e noite)',
    'Material fornecido pelo professor (raquetes e bolinhas)',
    'Turmas para iniciantes, intermediários e crianças'
  ]).map(b => `
    <li class="benefit-item">
      <span class="check-icon">✓</span>
      <span>${b}</span>
    </li>
  `).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${pageTitle}</title>

  <!-- Open Graph / WhatsApp Preview Tags (Essencial para WhatsApp) -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${pageTitle}" />
  <meta property="og:description" content="${pageDesc ? pageDesc : '&#x200B;'}" />
  <meta name="description" content="${pageDesc ? pageDesc : '&#x200B;'}" />
  <meta property="og:image" content="${absoluteImageUrl}" />
  <meta property="og:image:secure_url" content="${absoluteImageUrl}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="800" />
  <meta property="og:image:height" content="800" />
  <meta property="og:site_name" content="Aulas de Beach Tennis" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="${pageDesc ? pageDesc : '&#x200B;'}" />
  <meta name="twitter:image" content="${absoluteImageUrl}" />

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --primary: #059669;
      --primary-hover: #047857;
      --accent: #f97316;
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --border: #334155;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: radial-gradient(circle at top, #1e293b 0%, #0f172a 100%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .container {
      width: 100%;
      max-width: 460px;
      background: var(--card-bg);
      border-radius: 24px;
      border: 1px solid var(--border);
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.1);
      position: relative;
    }

    .banner-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
      background: #0f172a;
    }

    .banner-img {
      width: 100%;
      height: auto;
      display: block;
    }

    .banner-badge {
      position: absolute;
      bottom: 12px;
      left: 12px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .content {
      padding: 24px 20px 28px;
    }

    .condo-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(249, 115, 22, 0.15);
      color: #fb923c;
      border: 1px solid rgba(249, 115, 22, 0.3);
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }

    h1 {
      font-size: 24px;
      font-weight: 800;
      line-height: 1.25;
      margin-bottom: 8px;
      color: #ffffff;
    }

    .location {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-muted);
      font-size: 13px;
      margin-bottom: 18px;
    }

    .desc {
      font-size: 14px;
      line-height: 1.5;
      color: #cbd5e1;
      margin-bottom: 20px;
    }

    .benefits-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .benefits-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #94a3b8;
      margin-bottom: 12px;
    }

    .benefits-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .benefit-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 13.5px;
      color: #e2e8f0;
      line-height: 1.35;
    }

    .check-icon {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .btn-whatsapp {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      width: 100%;
      background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 18px 24px;
      border-radius: 16px;
      font-size: 16px;
      font-weight: 800;
      box-shadow: 0 10px 25px -5px rgba(37, 211, 102, 0.4);
      transition: all 0.2s ease;
      cursor: pointer;
      text-align: center;
    }

    .btn-whatsapp:hover, .btn-whatsapp:active {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px -5px rgba(37, 211, 102, 0.6);
      filter: brightness(1.05);
    }

    .btn-whatsapp svg {
      width: 26px;
      height: 26px;
      fill: currentColor;
      flex-shrink: 0;
    }

    .redirect-note {
      text-align: center;
      color: var(--text-muted);
      font-size: 12px;
      margin-top: 14px;
    }

    .footer {
      margin-top: 24px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="banner-wrapper">
      <img src="${condo.bannerUrl}" alt="Aulas de Beach Tennis" class="banner-img" />
      <div class="banner-badge">
        <span>🎾</span> Moradores & Aulas
      </div>
    </div>

    <div class="content">
      <div class="condo-badge">
        Exclusivo para Moradores
      </div>

      <h1>${condo.nome}</h1>

      <div class="location">
        <span>📍 ${condo.cidade || 'Condomínio'}</span>
        <span>•</span>
        <span>${condo.quadra || 'Quadra de Areia'}</span>
      </div>

      ${condo.descricao ? `<p class="desc">${condo.descricao}</p>` : ''}

      <div class="benefits-card">
        <div class="benefits-title">Como funcionam as aulas:</div>
        <ul class="benefits-list">
          ${beneficiosHtml}
        </ul>
      </div>

      <a href="${condo.whatsappLink}" class="btn-whatsapp" id="btnGroup">
        <svg viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.45 0.742.966 1.201.664.591 1.224.774 1.397.86.173.086.275.072.376-.044.101-.116.433-.506.549-.679.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.42-.101.825zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.179L2 22l4.957-1.398A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
        </svg>
        <span>Entrar no Grupo para Agendar</span>
      </a>

      <div class="redirect-note">
        🔒 Acesso direto e seguro pelo aplicativo WhatsApp
      </div>
    </div>
  </div>

  <div class="footer">
    Aulas de Beach Tennis no Condomínio • Todos os direitos reservados
  </div>

</body>
</html>`;
}

module.exports = { generateCondoPage };
