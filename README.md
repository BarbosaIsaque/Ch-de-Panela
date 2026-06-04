# Chá de Panelas — Ana Clara & Isaque 💝

Lista de presentes online para o evento de **20 de junho de 2026**.

Site: [cha.isana.ia.br](https://cha.isana.ia.br)  
Repo: `isaquediasdev/Ch-de-Panela` (privado)

---

## Setup após git clone

### 1. Instalar dependências

```bash
npm install
```

> Requer Node 22. No Mac com Homebrew: `/opt/homebrew/opt/node@22/bin/node`

### 2. Criar o arquivo `.env`

```bash
cp .env.example .env
```

Preencha as variáveis — veja a seção abaixo ou o `HANDOFF.md` para os valores reais.

### 3. Rodar localmente

```bash
npm start
```

Acesse em `http://localhost:3000`.

> Sem o `.env` preenchido o OTP aparece no console em vez de ser enviado por e-mail.

---

## Variáveis de ambiente

| Variável | O que é |
|---|---|
| `SUPABASE_URL` | URL do projeto Supabase (`https://xxx.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service_role do Supabase (painel → Settings → API) |
| `JWT_SECRET` | String aleatória para assinar cookies de sessão |
| `ADMIN_PASSWORD` | Senha do painel `/admin.html` |
| `BREVO_API_KEY` | Chave da API Brevo (envia e-mail OTP) |
| `EMAIL_FROM` | Remetente dos e-mails (`cha@isana.ia.br`) |
| `INFINITEPAY_HANDLE` | InfiniteTag da conta (`isaque-barbosa-dias`) |
| `ABACATEPAY_API_KEY` | Chave da API AbacatePay (PIX dinâmico) |
| `ABACATEPAY_WEBHOOK_SECRET` | Secret do webhook AbacatePay |
| `SITE_URL` | URL pública (`https://cha.isana.ia.br` em prod, `http://localhost:3000` local) |

Os valores de produção estão todos setados na Vercel — consulte o `HANDOFF.md`.

---

## Deploy

Push na branch `main` dispara auto-deploy via Vercel.

```bash
git push origin main
```

Para deploy manual:

```bash
vercel deploy --prod
```

---

## Stack

- **Frontend:** HTML/CSS/JS estático em `public/`
- **Backend:** Express em `server.js`, exposto como serverless via `api/index.js`
- **Banco:** Supabase Postgres (região `sa-east-1`)
- **Auth:** OTP por e-mail via Brevo + cookie JWT (`jose ^5`)
- **Pagamento PIX:** AbacatePay (QR code inline)
- **Pagamento Cartão/Débito:** InfinitePay (checkout externo)
- **Hospedagem:** Vercel
- **DNS:** Cloudflare

## Leia também

- `HANDOFF.md` — estado atual, pendências e todos os IDs/credenciais de referência
- `WORKLOG.md` — histórico cronológico de todas as mudanças
- `AGENTS.md` — regras para agentes de IA (Claude Code / Codex)
