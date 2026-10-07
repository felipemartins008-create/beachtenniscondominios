# 🎾 Gerador de Links de Beach Tennis para Condomínios

Sistema completo para criar links de divulgação para grupos de WhatsApp com **carregamento automático de foto de capa (Open Graph)** e página personalizada para cada condomínio.

---

## 🚀 Como Usar no seu Computador

1. Abra o terminal nesta pasta e execute:
   ```bash
   npm start
   ```
2. Abra o navegador em: [http://localhost:3333](http://localhost:3333)
3. Você verá o painel onde pode:
   - **Cadastrar novos condomínios** (Nome e Link do WhatsApp).
   - **Copiar o Link** de cada condomínio com 1 clique.
   - **Copiar a Mensagem Pronta de WhatsApp** com formatação e emojis.
   - **Visualizar a simulação** de como o card aparecerá no WhatsApp.

---

## 🌐 Como Colocar na Internet de Graça (Vercel)

Para que o WhatsApp consiga ler sua imagem e exibir a capa nos celulares de todos os moradores, o site precisa estar online em HTTPS.

### Passo a passo rápido:
1. Crie uma conta gratuita no [GitHub.com](https://github.com) (se ainda não tiver).
2. Crie um repositório e envie estes arquivos:
   ```bash
   git init
   git add .
   git commit -m "Links Beach Tennis"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git push -u origin main
   ```
3. Acesse [Vercel.com](https://vercel.com), faça login com seu GitHub e clique em **Add New Project**.
4. Selecione o repositório e clique em **Deploy**.
5. Pronto! A Vercel vai gerar um link como:
   `https://beachtennis-condominios.vercel.app`
6. No painel local, coloque esse link no campo **"Endereço do seu Site"** para que todos os links gerados apontem para ele.
