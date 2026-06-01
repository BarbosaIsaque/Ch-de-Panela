# HANDOFF — Chá de Panelas (Isana)

> **Para o próximo agente / próximo chat.** Leia este arquivo **antes** de qualquer
> outra coisa, depois `WORKLOG.md` (linha do tempo completa), `AGENTS.md` e `CLAUDE.md`.
>
> Última atualização: 2026-06-01 — by Claude.

---

## TL;DR

- **Site 100% no ar** em `https://cha.isana.ia.br` ✅
- Stack: **Vercel** + **Supabase** Postgres + **Brevo** (e-mail OTP) + **AbacatePay** (PIX dinâmico) + **InfinitePay** (Cartão/Débito)
- Login por OTP via e-mail funcionando, remetente `cha@isana.ia.br`
- Pagamento PIX com QR code inline (sem sair do site) via AbacatePay
- Pagamento Cartão/Débito via InfinitePay (redireciona pro checkout deles)
- GitHub conectado na Vercel → auto-deploy a cada push na `main`
- **Pendente:** setar `ABACATEPAY_WEBHOOK_SECRET` na Vercel + trocar chave dev→prod do AbacatePay

---

## Estado atual (2026-06-01)

### ✅ Concluído
- Site no ar em `https://cha.isana.ia.br` com SSL
- DNS no Cloudflare (5 registros: DKIM Brevo x2, TXT verificação, DMARC, CNAME cha)
- SPF corrigido (`v=spf1 include:spf.brevo.com ~all`)
- Brevo autenticado, e-mail OTP chegando no Hotmail e Gmail
- Login OTP funcional — código chega em `cha@isana.ia.br`
- Carrinho, lista de presentes, checkout
- PIX dinâmico AbacatePay: QR code inline no carrinho, polling de status a cada 5s
- Cartão/Débito via InfinitePay: redireciona pro checkout deles
- Webhook AbacatePay: `POST /api/webhooks/abacatepay` — cria pedido + reserva itens + limpa carrinho
- Webhook InfinitePay: `POST /api/webhooks/infinitepay` — mesmo fluxo
- Carrinho intacto até confirmação de pagamento (pedido só é criado no webhook)
- CTA modal ao adicionar item ao carrinho ("Finalizar" / "Continuar escolhendo")
- Admin em `/admin.html`
- GitHub repo `isaquediasdev/Ch-de-Panela` conectado na Vercel (auto-deploy)

### ⏳ Pendente
1. **Setar `ABACATEPAY_WEBHOOK_SECRET=isana2026chaPix` na Vercel** → redeploy
2. **Trocar chave AbacatePay de dev → produção** (a atual `abc_dev_*` é modo teste)
3. Testar fluxo PIX ponta-a-ponta (QR code → pagamento → webhook → item some da lista)

---

## Identificadores / refs / contas

### Vercel
- **Time:** `Isaque's projects` → `team_X6djzH2eg3IbgVr8yurfn6yk`
- **Projeto:** `cha-panelas` → `prj_qLWJK1NfQUoBRVCe8oblYGq779XE`
- **URL produção:** `https://cha.isana.ia.br`
- **Deploy:** `vercel deploy --prod` ou push no GitHub (auto-deploy configurado)
- **CLI:** logado como `isaquebarbosadev-1000`

### Supabase
- **Projeto:** `cha-panelas-isana` → ref `fwhnsizxqthbugviraoo`
- **URL:** `https://fwhnsizxqthbugviraoo.supabase.co`
- **Região:** `sa-east-1` (São Paulo) · **Org:** `iofkieyvotvyknoukvpu`
- ⚠️ Outro projeto `juda` na mesma org — **NÃO USAR**

### Brevo (e-mail OTP)
- Conta `isaquebarbosa.dev@gmail.com`, free 300/dia
- Domínio `isana.ia.br` **autenticado** ✅
- Remetente: `cha@isana.ia.br`
- ⚠️ "Authorised IPs" DESLIGADO — não religar (Vercel não tem IP fixo)

### Cloudflare (DNS)
- Conta: `Isaquebarbosa.dev@gmail.com` → `cca2706351d43ee2c7ac894059541c97`
- Zona `isana.ia.br` — todos os registros necessários já inseridos
- MCP Cloudflare só cobre Workers/D1/KV/R2 — pra DNS usar API REST ou painel

### AbacatePay (PIX dinâmico)
- **API Key (DEV):** `abc_dev_BLN3Fjq6GkSMAg4CXkbmDM2U` — modo teste
- **Webhook URL cadastrada:** `https://cha.isana.ia.br/api/webhooks/abacatepay`
- **Webhook Secret:** `isana2026chaPix` ← ⚠️ ainda NÃO setado na Vercel
- ⚠️ Trocar chave dev pela de **produção** antes do evento

### InfinitePay (Cartão/Débito)
- **Handle:** `isaque-barbosa-dias`
- **Webhook URL cadastrada:** `https://cha.isana.ia.br/api/webhooks/infinitepay`
- **Redirect URL:** `https://cha.isana.ia.br`

### GitHub
- Repo: `isaquediasdev/Ch-de-Panela` (privado), branch `main`
- CLI logada como `isaquediasdev`

---

## Variáveis de ambiente na Vercel (Production)

| Variável | Status | Observação |
|---|---|---|
| `SUPABASE_URL` | ✅ setada | |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ setada | |
| `JWT_SECRET` | ✅ setada | |
| `ADMIN_PASSWORD` | ✅ setada | |
| `BREVO_API_KEY` | ✅ setada | |
| `EMAIL_FROM` | ✅ setada | `cha@isana.ia.br` |
| `INFINITEPAY_HANDLE` | ✅ setada | `isaque-barbosa-dias` |
| `SITE_URL` | ✅ setada | `https://cha.isana.ia.br` |
| `ABACATEPAY_API_KEY` | ✅ setada | chave DEV — trocar pela de prod |
| `ABACATEPAY_WEBHOOK_SECRET` | ❌ **FALTA** | `isana2026chaPix` |

---

## Banco (Supabase) — schema atual

| Tabela | Função |
|---|---|
| `users` | id, name, email (único), phone, created_at |
| `cart_items` | user_id, item_id, unique(user_id, item_id) |
| `orders` | id, user_id, total, status (`pending`/`paid`), payment_method, paid_amount, external_payment_id |
| `order_items` | snapshot do preço. `ON DELETE CASCADE` |
| `reserved_items` | item_id PK, order_id. `ON DELETE CASCADE` (cancelar libera) |
| `login_codes` | OTP: email, code, name, phone, expires_at, used |
| `payment_sessions` | id (uuid PK), user_id, items (jsonb), total, charge_id, expires_at (30min), used |

Todas com **RLS on, sem policies** = só `service_role` acessa.

### Função RPC
- `place_order(p_user_id bigint, p_items jsonb)` → checkout atômico (confere conflito → cria order → order_items → reserved_items → limpa cart)

---

## Fluxo de pagamento

### PIX (AbacatePay) — inline, sem sair do site
```
Carrinho → "📱 Pagar com PIX"
  → POST /api/pix-charge
    → cria payment_session (30min TTL)
    → cria cobrança AbacatePay (retorna brCode + brCodeBase64)
  → QR code exibido inline no carrinho
  → Convidado paga no banco
  → AbacatePay → POST /api/webhooks/abacatepay?secret=isana2026chaPix
    → place_order RPC → reserva itens → limpa carrinho
    → order.status = 'paid'
  → Frontend polling GET /api/pix-status → detecta em até 5s → celebra 🎉
```

### Cartão/Débito (InfinitePay) — redireciona
```
Carrinho → "💳 Cartão / Débito — via InfinitePay"
  → POST /api/card-link
    → cria payment_session (30min TTL)
    → cria link InfinitePay (order_nsu = session.id)
  → Redireciona convidado pro checkout InfinitePay
  → Paga → InfinitePay → POST /api/webhooks/infinitepay
    → place_order RPC → reserva itens → limpa carrinho
    → order.status = 'paid'
```

### Dinheiro — fluxo direto
```
Carrinho → "💵 Vou pagar em dinheiro no dia"
  → POST /api/orders → place_order → reserva itens imediatamente
  → POST /api/orders/:id/cash → payment_method = 'dinheiro'
  → confirmacao.html (status manual pelo admin)
```

---

## Estrutura de arquivos

```
/
├── server.js              # Express + toda a lógica. Exporta `app`.
├── api/
│   └── index.js           # Entrypoint Vercel: module.exports = require('../server.js')
├── vercel.json            # Rewrites /api/(.*) → /api/index
├── lib/
│   ├── supabase.js        # cliente service_role
│   ├── auth.js            # cookie JWT (jose ^5 — NÃO subir pra ^6)
│   └── items.js           # 77 itens do catálogo
├── public/
│   ├── index.html         # Hero + convite
│   ├── lista.html         # Catálogo de presentes
│   ├── item.html          # Detalhe do item + CTA modal ao adicionar
│   ├── carrinho.html      # Carrinho + botões de pagamento (PIX/Cartão/Dinheiro)
│   ├── confirmacao.html   # Só para fluxo dinheiro
│   ├── login.html / cadastro.html / minha-conta.html / meus-pedidos.html
│   ├── admin.html         # Painel admin
│   ├── js/app.js          # Utilitários compartilhados + showCartCTA
│   └── css/style.css      # Estilos + .cart-cta-* (modal CTA)
├── .env                   # GITIGNORED — segredos locais
├── .gitignore             # node_modules, *.db, .env, .vercel
├── AGENTS.md / CLAUDE.md  # Regras dos agentes (LEIA antes de qualquer task)
├── WORKLOG.md             # Diário cronológico — LEIA antes de começar
└── HANDOFF.md             # ESTE arquivo
```

---

## ⚠️ Gotchas

- **`jose` precisa ser `^5`** — v6 é ESM-only, quebra na Vercel
- **AbacatePay chave `abc_dev_*`** é modo teste — trocar pela prod antes do evento
- **`ABACATEPAY_WEBHOOK_SECRET`** ainda não está na Vercel — PIX webhook não valida até setar
- `.env` **nunca commitar** — tem segredos do Supabase, Brevo e AbacatePay
- `pix-utils` fixado em `1.0.0` — versões maiores quebram
- `better-sqlite3`/`express-session`/`bcryptjs` **removidos** — não reinstalar (não rodam serverless)
- Cloudflare MCP não edita DNS — usar API REST (`curl`) com token `Zone:DNS:Edit`

---

## 🚀 Próximos passos imediatos

1. **Setar `ABACATEPAY_WEBHOOK_SECRET=isana2026chaPix` na Vercel** → `vercel env add ABACATEPAY_WEBHOOK_SECRET production` → redeploy
2. **Testar fluxo PIX ponta-a-ponta** no `https://cha.isana.ia.br`
3. Quando for ao ar de verdade: trocar `ABACATEPAY_API_KEY` pela chave de produção do AbacatePay

---

## Como abrir no novo chat

> *"Leia HANDOFF.md primeiro, depois WORKLOG.md. O site está no ar em cha.isana.ia.br.
> Falta setar ABACATEPAY_WEBHOOK_SECRET na Vercel e testar o fluxo PIX ponta-a-ponta."*

Boa! 💝
