# WORKLOG — shared agent log (Claude + Codex)

Append-only diary. **Newest entries on top.** Read this before starting a task; write
here whenever you finish something, decide something, or find a bug.

**Entry format:**

```
## [YYYY-MM-DD HH:MM] — <Claude|Codex> — <short title>
- **What:** what was done / found / decided
- **Files:** files touched (if any)
- **Next / open:** next step or open question
```

---

## [2026-06-17 15:02] — Claude — 🍊 Novo item na lista: Espremedor Mondial Premium (R$100)
- **What:** Isaque pediu pra adicionar um espremedor de frutas Mondial Premium à lista de presentes, valor R$100. Adicionado `id:79` (cat Cozinha, price 100.0) ao array de `lib/items.js`, fonte única servida por `/api/items`. Imagem do produto convertida (PNG→JPG) e salva em `public/img/itens/79.jpg`, seguindo o padrão dos demais.
- **Files:** lib/items.js (novo item id:79), public/img/itens/79.jpg (nova imagem).
- **Next / open:** deploy `vercel --prod` pra publicar em cha.isana.ia.br.

## [2026-06-14] — Claude — ✉️ E-mail de agradecimento ao comprador (pós-pagamento)
- **What:** Nova feature pedida pelo Isaque: quando o pagamento é confirmado, manda e-mail de agradecimento ("Sua compra foi concluída. Obrigado por nos ajudar a montar o nosso cantinho 💛"). Reusa a infra de e-mail que já existe (Brevo API HTTP, fallback SMTP/nodemailer). Novas funções `sendThankYouEmail(to, buyerName, items)` e `notifyThankYou(orderId)` (busca comprador via `orders→pessoas`, itens via `order_items`→`ITEMS`). Disparo em 3 pontos, todos só na confirmação real de pagamento: webhook AbacatePay (PIX), webhook InfinitePay (cartão), e endpoint admin `POST /api/admin/orders/:id/paid` (cobre dinheiro confirmado no evento). Todas as chamadas são best-effort (try/catch, não derrubam o webhook). Admin tem guarda contra reenvio (só agradece na transição pending→paid). Decisão do Isaque: agradecer SÓ quando pago, nunca na reserva.
- **Files:** server.js (sendThankYouEmail, notifyThankYou, 3 call-sites).
- **Verificação:** ✅ **TESTE REAL OK (15/06 ~02:08 UTC)** — Isaque comprou o item de teste (id 999, R$1,00) via InfinitePay/PIX. Webhook `/api/webhooks/infinitepay` logou "Pedido #11 criado e pago (R$ 1)", pedido marcado `paid`, e o e-mail de agradecimento chegou perfeito na caixa de entrada (Brevo, prod). Fluxo ponta a ponta confirmado.
- **Limpeza pós-teste:** item 999 voltou pra `hidden:true` (redeploy chá `cha-panelas-jchy77xm7` → cha.isana.ia.br). Removidos do banco: pedido #11 (+ order_items/reserved_items), payment_session, login_code e a pessoa de teste 310 (origem=comprador) — base limpa de novo.
- **Next / open:** (1) texto final do e-mail é dos noivos (placeholder atual pode ser ajustado a pedido); (2) PENDENTE separado: avaliar WhatsApp como canal alternativo (Isaque vai pensar) — anotado no HANDOFF do isana-core (PUNCH-LIST #6).

## [2026-06-09 22:40] — Claude — 🌙 Dark mode: traços/linhas reapareceram
- **What:** No escuro as linhas sumiam. Clareei `--border` (#383027→#4D4234) e `--gold-light` (#4A3F2A→#6E5C3C) no bloco `[data-theme="dark"]`, e dei dourado translúcido `rgba(212,185,126,0.45)` aos `.divider::before/::after` (o traço com 💐). Deploy prod.
- **Files:** public/css/style.css
- **Next / open:** —

## [2026-06-09 22:10] — Claude — 🌙 Modo noturno (dark mode)
- **What:** Dark mode em todo o chá. (1) `style.css` já usava CSS vars → adicionei bloco `[data-theme="dark"]` remapeando as vars (--cream/--card-bg/--text/--border etc.) + overrides pros `#fff` hardcoded (`.nav`, `.hero`, `.page-header`, `.filter-tabs/.filter-tab`, `.pix-box`, inputs, badges pastel). Regra `[style*="background:#fff"]:not(img)` cobre os fundos brancos inline do HTML **sem** escurecer o QR do PIX (que é `<img>` e precisa ficar branco pra escanear). (2) Script anti-flash inline no `<head>` das 9 páginas (lê `localStorage.theme`, senão `prefers-color-scheme`, e seta `data-theme` antes da pintura). (3) Botão de alternar (🌙/☀️) injetado no nav via `app.js` (`initThemeToggle`), persiste em `localStorage`.
- **Files:** public/css/style.css, public/js/app.js, public/*.html (9, snippet no head)
- **Next / open:** —

## [2026-06-09 21:30] — Claude — +Sanduicheira (id 78) e −Kit panos rosa #2 (id 74)
- **What:** Adicionei ao catálogo a **Sanduicheira Grill Electrolux** (`id:78`, cat Cozinha, R$99,90 contribuição simbólica média, imagem `/img/itens/78.jpg` que já estava na pasta). **Removi** o `Kit 5 panos de prato — rosa #2` (`id:74`) a pedido do Isaque — confirmei no banco que nenhum `order_items` referencia o 74 (remoção segura, sem quebrar pedidos). Catálogo: 77 itens visíveis. Build/`node --check` OK, deploy em prod (`cha-panelas-7ged0m15b`).
- **Files:** lib/items.js
- **Next / open:** —

## [2026-06-09 20:20] — Claude — Item de teste oculto (id 999) para validar PIX
- **What:** AbacatePay tem **mínimo de R$1,00** (API: `Expected number to be greater or equal to 100` centavos — 1 centavo não rola). Criei item de teste `id:999`, `hidden:true`, R$1,00 em `lib/items.js`. Filtrei `hidden` das rotas `/api/items` e `/api/items/stats` (não aparece na lista nem nos contadores), mas segue acessível por URL direta `/item.html?id=999`. Verificado em prod: GET /api/items/999 retorna; lista não contém id 999.
- **Files:** lib/items.js, server.js (rotas items/stats e items)
- **Next / open:** ⚠️ **REMOVER o item id:999 + o filtro hidden depois de validar o PIX** (ou deixar hidden se quiser manter pra testes futuros). Webhook secret ainda pendente de rotação.

## [2026-06-09 20:05] — Claude — PIX corrigido: chave nova v1 + QR centralizado
- **What:** PIX não gerava QR. Causa raiz: a `ABACATEPAY_API_KEY` antiga (`key_CGTNeR...`) foi **revogada** pela AbacatePay numa rotação de segurança → API retornava `401 Invalid or inactive API key`. Isaque gerou chave nova v1 no painel (`abc_prod_ssKw...`), atualizou na Vercel; testei via curl no endpoint v1 (`success:true`, devMode:false, brCode+QR ok) e fiz redeploy de produção. PIX confirmado gerando (R$69,90, QR + copia-e-cola na própria página). Em seguida centralizei o QR (estava colado à esquerda) com `display:block;margin:0 auto`.
- **Files:** public/carrinho.html (linha ~157)
- **Next / open:** (1) ⚠️ rotacionar `ABACATEPAY_WEBHOOK_SECRET` (vazou no chat) — sem isso a confirmação automática fica vulnerável. (2) testar fluxo completo: pagar PIX real → webhook `billing.paid` → pedido concluído. (3) apagar 4 convidados "Teste" de `pessoas`.

## [2026-06-09 17:35] — Claude — AbacatePay configurado e armado em produção
- **What:** fechado o setup do PIX. (1) `ABACATEPAY_API_KEY` de **produção** nova gravada na Vercel
  + redeploy → `pixEnabled:true` ao vivo. (2) Webhook **v1** criado no dashboard AbacatePay
  (evento `billing.paid`) apontando p/ `https://cha.isana.ia.br/api/webhooks/abacatepay`; secret
  novo (`openssl rand -hex 24`) gravado nos dois lados (campo Secret do AbacatePay + env
  `ABACATEPAY_WEBHOOK_SECRET`/Production na Vercel, marcada Sensitive). (3) Verificado por curl:
  secret errado → **401**; secret certo → passa a validação e cai em "Sessão não encontrada"
  (esperado, sem sessão real) → prova que Vercel e AbacatePay batem e o parsing de
  `billing.paid`/`externalId` funciona.
- **Files:** nenhum (só env vars + dashboard). Deploy `cha-panelas-km8jpmm4u` READY.
- **⚠️ PENDENTE (Isaque):**
  1. **Rotacionar o `ABACATEPAY_WEBHOOK_SECRET`** — o valor usado no setup apareceu no chat do
     Claude. Depois de validar o fluxo: `openssl rand -hex 24` → trocar no AbacatePay **e** na
     Vercel (Production) → redeploy.
  2. **Testar um PIX real ponta a ponta** (login → carrinho → Pagar com PIX → pagar → confirma
     sozinho → Meus Pedidos / pedido pago / item reservado).
  3. Depois do teste OK, **apagar os 4 convidados `Teste …`** do RSVP (tabela `pessoas`).

## [2026-06-09 16:20] — Claude — PIX QR AbacatePay vira o fluxo principal (InfinitePay → secundário)
- **What:** o frontend nunca chamava o AbacatePay — o único botão "Pagar" do carrinho ia pro
  `/api/card-link` (InfinitePay). Reescrevi o checkout: botão **📱 Pagar com PIX** → `/api/pix-charge`
  → mostra QR (`brCodeBase64`) + copia-e-cola na própria página + polling `/api/pix-status` →
  redireciona p/ `/meus-pedidos.html` ao confirmar. InfinitePay virou link discreto "pagar com cartão".
  **Bug grave corrigido no backend:** a integração AbacatePay estava na API errada
  (`/v2/transparents/create`, corpo `{method,data}`, validava `json.success` que não existe →
  **sempre lançava erro**). Trocado p/ **`v1/pixQrCode/create`** (corpo plano, `amount` centavos,
  `description`≤37, `metadata.externalId`, valida `data/error`). Removido `customer` (a API exige
  os 4 campos name+cellphone+email+taxId e só tínhamos 2). Webhook tornado robusto: aceita
  `billing.paid`/`transparent.completed`, secret via `?webhookSecret=` (era só `?secret=`), acha a
  sessão por `externalId` **ou** `charge_id`. Deploy READY, `pixEnabled:true`, carrinho novo no ar.
- **Files:** `public/carrinho.html`, `server.js` (commit + `vercel --prod`).
- **Next / open (Isaque):** (1) trocar `ABACATEPAY_API_KEY` na Vercel pela nova key de produção +
  eu redeployo; (2) no painel AbacatePay, cadastrar webhook
  `https://cha.isana.ia.br/api/webhooks/abacatepay?webhookSecret=<ABACATEPAY_WEBHOOK_SECRET>`;
  (3) testar um PIX real ponta a ponta.

## [2026-06-09 16:00] — Claude — Lista: +Sanduicheira Electrolux, −panos rosa #2, 4 convidados de teste
- **What:** no DB unificado isana-core (`fwhnsizxqthbugviraoo`): (1) item **78** "Sanduicheira
  Electrolux" inserido (Cozinha, R$ 139,90, `/img/itens/78.jpg`); (2) item **74** "Kit 5 panos
  de prato — rosa #2" desativado (`ativo=false`, soft-delete) → some da lista; (3) 4 `pessoas`
  de teste com nome `Teste …` (origem=convidado) p/ o Isaque validar o RSVP do site do casamento.
  Imagem `78.jpg` extraída do PDF do WhatsApp (pdfimages+sips), commitada e deployada.
- **Files:** `public/img/itens/78.jpg` (commit + `vercel --prod` cha-panelas READY).
- **Next / open:** AbacatePay QR PIX (substituir InfinitePay) — aguardando definição com o Isaque.
  Apagar os 4 `Teste …` quando o RSVP estiver validado.

---

## [2026-06-07] — Claude — CUTOVER APLICADO + DEPLOYADO (unificação isana-core concluída no lado chá)
- **What:** o refactor da entrada anterior foi para produção. Apliquei `isana-core/db/STAGED_cutover.sql` no banco vivo
  (`users`→VIEW sobre `pessoas`, colunas `user_id`→`pessoa_id`, `place_order(p_pessoa_id)`), com dry-run ROLLBACK validando
  antes (schema+dados reais) + snapshot. Mergeei `cutover/pessoa-id`→`main` e deployei na Vercel (prod READY).
- **Validação ao vivo:** `/api/items` 200/77; embed `orders→pessoas` resolve (200); login email inexistente 404.
  Advisor: revogado EXECUTE de anon/authenticated nas funções de trigger da VIEW.
- **Files:** `server.js` (já na entrada anterior), banco (cutover). Branch `cutover/pessoa-id` deletada (mergeada).
- **Next / open:** o app agora depende da VIEW `users` + `place_order(p_pessoa_id)`. NÃO recriar tabela `users`.
  Pós-cutover há 0 pedidos; testar um fluxo de compra real (OTP→carrinho→PIX) quando o chá voltar a vender.

---

## [2026-06-05] — Claude — Refactor user_id→pessoa_id p/ cutover isana-core (branch, NÃO deployado)
- **What:** refatorado `server.js` para o cutover unificado do isana-core. Todas as refs de coluna
  `user_id`→`pessoa_id` (cart_items/orders/payment_sessions, inclusive `session.user_id` e `o.user_id`);
  as 3 chamadas `rpc('place_order', { p_user_id })`→`{ p_pessoa_id }`; embed do admin
  `users(name,email,phone)`→`pessoas(nome,email,phone)` com map `nome→name`. As 6 queries `from('users')`
  foram MANTIDAS (passam a operar sobre a VIEW de compat criada pelo cutover). 23 linhas, `node --check` OK.
- **Por quê / como casa:** este refactor SÓ funciona junto do `isana-core/db/STAGED_cutover.sql`
  (renomeia colunas, dropa a tabela `users` e cria VIEW+triggers + `place_order(p_pessoa_id)`). DEVE subir
  no MESMO deploy do cutover. `req.user.id` passa a ser `pessoa.id` via a VIEW (OTP insert/select retornam pessoa.id).
- **Files:** `server.js` (branch `cutover/pessoa-id` — NÃO mergeado em `main`, que faz auto-deploy).
- **Next / open:** revisão adversarial do par (rodando); validar em branch Supabase ou cutover live
  (orders=0 → baixo risco) com snapshot + modo manutenção; só então merge→main (deploy) coordenado com o SQL.

---

## [2026-06-01] — Claude — CTA de carrinho + pagamento unificado
- **What:** (1) Modal CTA ao adicionar item ao carrinho (`showCartCTA` em `app.js` +
  `.cart-cta-*` em `style.css`): sheet bottom-up com "Finalizar compra →" e
  "✦ Continuar escolhendo ✦" (bold, destaque). Dismiss ao clicar fora ou no "continuar".
  (2) Página de confirmação reformulada: removidas as 3 abas (PIX/Cartão/Dinheiro),
  substituídas por 2 botões — "💳 Pagar — PIX / Débito / Crédito" (InfinitePay, primário)
  e "💵 Vou pagar em dinheiro no dia do chá" (outline, secundário).
- **Files:** `public/js/app.js`, `public/css/style.css`, `public/item.html`,
  `public/confirmacao.html`.
- **Next / open:** Testar fluxo ponta-a-ponta no site.

## [2026-06-01] — Claude — Integração InfinitePay implementada
- **What:** Integração InfinitePay Checkout via API REST (`POST https://api.checkout.infinitepay.io/links`).
  - `CONFIG.infinitepay` com `handle` (env `INFINITEPAY_HANDLE`), `apiUrl`, `siteUrl` (env `SITE_URL`).
  - `cardEnabled` agora é getter dinâmico: `true` quando `INFINITEPAY_HANDLE` estiver setado.
  - `createInfinitePayLink(order, items)` → gera link com `redirect_url` + `webhook_url`.
  - `POST /api/card-link` (autenticado) → retorna `{ url }` do checkout InfinitePay.
  - `POST /api/webhooks/infinitepay` → recebe confirmação, marca pedido `status=paid`.
  - Coluna `paid_amount numeric(10,2)` adicionada na tabela `orders` (Supabase).
  - `public/confirmacao.html` atualizado: textos de cartão agora mencionam InfinitePay.
- **Files:** `server.js`, `public/confirmacao.html`, `WORKLOG.md`.
- **Next / open:** Isaque adiciona `INFINITEPAY_HANDLE` na Vercel (InfiniteTag sem `$`),
  faz redeploy → botão de cartão ativa automaticamente. Testar fluxo ponta-a-ponta.
  Também avaliar: login Google + checkout sem registro (guest).

## [2026-06-01] — Claude — DNS configurado + site no ar em cha.isana.ia.br
- **What:** Todos os 5 registros DNS inseridos via API Cloudflare (token `Zone:DNS:Edit`
  na zona `isana.ia.br`): CNAME `brevo1._domainkey`, CNAME `brevo2._domainkey`,
  TXT `@` (brevo-code), TXT `_dmarc`, CNAME `cha → cname.vercel-dns.com`. Removido
  DMARC conflitante (`p=reject`) que estava pré-existente. Brevo confirmou todos os
  registros `status:true`. E-mail de teste enviado com sucesso via `cha@isana.ia.br`
  (DKIM funcional). Vars `BREVO_API_KEY` e `EMAIL_FROM` setadas na Vercel. `SHOW_DEV_CODE`
  removido da Vercel. Redeploy feito. Domínio `cha.isana.ia.br` adicionado ao projeto
  Vercel → `https://cha.isana.ia.br` retorna 200. ✅ Site 100% pronto para o público.
  Nota: o endpoint PUT `/senders/domains/{domain}/authenticate` do Brevo retorna erro
  mesmo com DNS correto (bug conhecido); o e-mail funciona pois os registros DKIM estão
  validados. Autenticar via painel Brevo (app.brevo.com → Senders → Domains → Authenticate)
  é opcional e só afeta o status visual na conta Brevo, não o envio.
- **Files:** `WORKLOG.md`.
- **Next / open:** (opcional) clicar "Authenticate" no painel Brevo para o status ficar
  verde. Conectar repo GitHub na Vercel para auto-deploy. Evento: 20/06/2026. 🎉

## [2026-06-01] — Claude — Flash de nomes corrigido; DNS pendente (aguardando token)
- **What:** Substituído o placeholder `[Nome da Noiva] & [Nome do Noivo]` pelo nome real
  `Ana Clara & Isaque` direto no HTML de todas as páginas (`index.html`, `lista.html`,
  `carrinho.html`, `item.html`, `admin.html`). O `data-config="nomes"` continua e
  sobrescreve com o mesmo valor da API — sem flash. Título da aba também corrigido.
  Para o DNS no Cloudflare (5 registros: 2 CNAME DKIM Brevo + 1 TXT verificação Brevo
  + 1 TXT DMARC + 1 CNAME `cha` → Vercel), precisa de API token com `Zone:DNS:Edit`
  ou inserção manual no painel.
- **Files:** `public/index.html`, `public/lista.html`, `public/carrinho.html`,
  `public/item.html`, `public/admin.html`.
- **Next / open:** Isaque gera API token Cloudflare (Edit zone DNS, zona isana.ia.br)
  OU insere os 5 registros manualmente → Claude autentica domínio Brevo → seta
  BREVO_API_KEY+EMAIL_FROM na Vercel → remove SHOW_DEV_CODE → redeploy → adiciona
  domínio cha.isana.ia.br no projeto Vercel.

## [2026-05-29 14:57] — Codex — DNS Cloudflare ainda pendente
- **What:** Li `HANDOFF.md`, `WORKLOG.md`, `AGENTS.md`, `CLAUDE.md` e `MEMORY.md`.
  Confirmei por DNS público que ainda não existem os CNAMEs DKIM do Brevo
  (`brevo1._domainkey`, `brevo2._domainkey`), o TXT de verificação Brevo no apex, nem
  o CNAME `cha.isana.ia.br`. Também confirmei que não há token Cloudflare no `.env`;
  só `BREVO_API_KEY` e `EMAIL_FROM` estão presentes localmente.
- **Files:** `WORKLOG.md`.
- **Next / open:** Inserir registros no Cloudflare pelo painel ou fornecer API token
  Cloudflare com `Zone:DNS:Edit` para a zona `isana.ia.br`; depois autenticar Brevo,
  configurar env vars na Vercel, remover `SHOW_DEV_CODE`, redeployar e só então apontar
  `cha.isana.ia.br` para a Vercel.

## [2026-05-27 03:00] — Claude — HANDOFF.md atualizado + commit dos artefatos do deploy
- **What:** A Ana pediu pra documentar tudo (vai abrir num novo chat). Reescrevi o
  `HANDOFF.md` pra refletir o estado REAL atual: o site já está em
  `https://cha-panelas.vercel.app` (deployed), Brevo integrado, falta SÓ o DNS no
  Cloudflare (4 registros Brevo + 1 CNAME pro subdomínio do chá).
- **Commit do deploy ainda não estava no Git:** `api/index.js`, `vercel.json`,
  `.vercelignore`, edits em `server.js` (Brevo + SHOW_DEV_CODE + dotenv quiet),
  `package.json`/`lock` (jose ^5), `.gitignore` (+.vercel) e as entradas anteriores
  do WORKLOG só existiam local. Commito todos juntos agora pra o próximo chat ver
  o estado real ao puxar o repo. `.env` continua gitignored.
- **Files:** `HANDOFF.md` (reescrito), `WORKLOG.md` (esta entrada).
- **Next:** Próximo chat → começar em `HANDOFF.md` → seção **PRÓXIMOS PASSOS**.
  Resumo: casal insere DNS no Cloudflare → autenticar domínio Brevo → setar
  `BREVO_API_KEY`+`EMAIL_FROM` na Vercel + remover `SHOW_DEV_CODE` → redeploy →
  CNAME `cha` no Cloudflare → adicionar domínio no projeto Vercel.

## [2026-05-27 02:25] — Claude — Brevo OK (IP liberado) + domínio add; faltam DNS
- **IP restriction desligada** → chave de API do Brevo funciona (200). Conta **Isana**
  (`isaquebarbosa.dev@gmail.com`), free 300/dia. Remetente ativo já existe:
  `isaquebarbosa.dev@gmail.com` (id 1). SMTP relay (caso precise): user
  `aca682001@smtp-brevo.com`, `smtp-relay.brevo.com:587`.
- **Domínio `isana.ia.br` adicionado no Brevo** (id `6a1655c39ca547d25903c24f`,
  authenticated:false). Registros DNS p/ autenticar (Brevo detectou provider=Cloudflare):
  - `CNAME brevo1._domainkey` → `b1.isana-ia-br.dkim.brevo.com`  (DNS only / sem proxy)
  - `CNAME brevo2._domainkey` → `b2.isana-ia-br.dkim.brevo.com`  (DNS only / sem proxy)
  - `TXT @` → `brevo-code:7862b9f89b71bb19475e6628497e6a36`
  - `TXT _dmarc` → `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com`  (opcional, status já true)
- **Cloudflare MCP NÃO edita DNS** (só Workers/D1/KV/R2 + docs). Preciso de **token de
  API Cloudflare** (template "Edit zone DNS", zona `isana.ia.br`) OU casal no painel.
- **Próximo:** DNS no Cloudflare → autenticar domínio no Brevo → setar
  `BREVO_API_KEY`+`EMAIL_FROM` na Vercel → teste real de envio → **remover
  SHOW_DEV_CODE** → redeploy → `CNAME cha.isana.ia.br` → Vercel.

## [2026-05-26 23:40] — Claude — Brevo via API HTTP + bloqueio de IP descoberto
- **Change:** `sendLoginCodeEmail` agora envia pela **API HTTP do Brevo**
  (`POST /v3/smtp/email`, header `api-key`) quando `BREVO_API_KEY` está setada; SMTP/
  nodemailer vira fallback. Melhor p/ serverless (sem conexão SMTP). Chave do Brevo
  (a "MCP key" base64 que o casal mandou = `{"api_key":"xkeysib-…"}`) decodificada e
  guardada no `.env` (gitignored). **NÃO setada na Vercel ainda** — senão quebraria o
  modo devCode atual antes do domínio estar autenticado.
- **Bloqueio:** a chave de API veio com **"Authorised IPs" ativo** no Brevo → toda
  chamada dá `401 unrecognised IP`. Vercel não tem IP de saída fixo → tem que
  **DESLIGAR a restrição de IP** (app.brevo.com/security/authorised_ips), não
  whitelistar. Trava testes da API + autenticação de domínio até desligar.
- **Files:** `server.js` (sendLoginCodeEmail reescrito), `.env` (+BREVO_API_KEY,
  +EMAIL_HOST/PORT/SECURE Brevo, +EMAIL_FROM). Code change ainda NÃO redeployado
  (inerte na Vercel sem BREVO_API_KEY → devCode segue funcionando).
- **Aguardando casal:** (1) desligar Authorised IPs no Brevo; (2) acesso Cloudflare
  (token DNS ou painel). Depois (Claude): validar chave → add domínio via API → pegar
  DNS → Cloudflare → autenticar → setar BREVO_API_KEY+EMAIL_FROM na Vercel → teste
  real → remover SHOW_DEV_CODE → redeploy → apontar cha.isana.ia.br.

## [2026-05-26 23:10] — Claude — E-mail OTP: escolhido Brevo + suporte a EMAIL_FROM
- **Decisão (casal):** serviço de envio do código de login = **Brevo** (SMTP, plano
  grátis 300/dia, remetente do domínio). Resend foi a alternativa avaliada (entrega
  ligeiramente melhor, mas teto de 100/dia) — escolhido Brevo pela folga diária + PT-BR.
- **Change:** `server.js` agora aceita **`EMAIL_FROM`** separado do `EMAIL_USER` (no
  Brevo o login SMTP ≠ endereço remetente). Fallback p/ EMAIL_USER se EMAIL_FROM vazio
  (Gmail continua funcionando sem mudança). `.env` pré-preenchido com SMTP do Brevo
  (`smtp-relay.brevo.com:587`, secure=false, EMAIL_FROM=cha@isana.ia.br).
- **Files:** `server.js` (CONFIG.email.from + uso no campo `from`), `.env`.
- **Aguardando do casal:** (1) criar conta Brevo + gerar **chave SMTP**; (2) adicionar
  domínio no Brevo → ele gera **registros DNS** (DKIM/verificação); (3) **acesso ao
  Cloudflare** (token DNS ou painel) p/ inserir os registros.
- **Depois (Claude):** setar EMAIL_* na Vercel (Production) → autenticar domínio →
  enviar e-mail de teste real → **remover SHOW_DEV_CODE** → redeploy. Aí o domínio
  `cha.isana.ia.br` pode ser apontado.

## [2026-05-26 22:35] — Claude — Deploy na Vercel no ar (cha-panelas.vercel.app) ✅
- **What:** Empacotei o Express pra Vercel e publiquei em **produção**. Site testado
  **ponta a ponta** contra o Supabase real: estático (8 páginas → 200), API pública
  (config / items / stats), login por cookie JWT (verify→me), carrinho, checkout
  atômico (`place_order`), admin (senha certa 200 / errada 403). Banco **truncado**
  de novo (0 linhas) após o teste → base limpa.
- **URL de teste:** https://cha-panelas.vercel.app — projeto `cha-panelas`
  (`prj_qLWJK1NfQUoBRVCe8oblYGq779XE`, time `team_X6djzH2eg3IbgVr8yurfn6yk`).
- **Bug achado/corrigido:** `jose` v6 é **ESM-only**; `require('jose')` quebrava no
  Node da Vercel → `server.js` não carregava → TODA rota `/api/*` dava 500
  `FUNCTION_INVOCATION_FAILED` (estático funcionava). Fix: **`jose@^5`** (dual
  CJS/ESM, API idêntica, 0 mudança de código). Local passava por usar Node 22.12+
  (require-esm nativo).
- **Files:** `api/index.js` (entrypoint serverless → reexporta o app de server.js),
  `vercel.json` (rewrite `/api/(.*)`→`/api/index`; `public/` servido estático pela
  Vercel), `.vercelignore` (não sobe `.env`/`*.db`/`node_modules`/`*.md`), `.gitignore`
  (+`.vercel`), `server.js` (flag `SHOW_DEV_CODE` + `dotenv {quiet:true}`),
  `package.json`/`lock` (jose ^6→^5).
- **Env vars (Production, via `vercel env add` lendo do `.env`):** SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET, ADMIN_PASSWORD, SHOW_DEV_CODE=true.
  ⚠️ Não existe tool de env var no MCP da Vercel — feito pelo CLI (logado como
  `isaquebarbosadev-1000`).
- **Modo teste:** sem e-mail configurado, `SHOW_DEV_CODE=true` devolve o código de
  login na resposta (mostra na tela). A Vercel força `NODE_ENV=production` no runtime,
  então o gate antigo (`NODE_ENV!==production`) nunca mostraria o código. ⚠️ INSEGURO
  pro público — qualquer um loga como qualquer e-mail. Só pra teste no link `.vercel.app`.
- **Next / open (2 bloqueios, dependem do casal):**
  1. **E-mail OTP** (Isaque/Zoho): setar EMAIL_* na Vercel → remover SHOW_DEV_CODE →
     redeploy. Só então é seguro abrir pro público.
  2. **DNS `cha.isana.ia.br`** (Cloudflare): apontar SÓ depois do e-mail. Adicionar
     domínio no projeto Vercel + CNAME no Cloudflare. MCP Cloudflare não tem tool de
     DNS → precisa de API token ou dashboard.
- **Deploy é direto via CLI** (não ligado ao GitHub ainda) — futuras mudanças exigem
  `vercel deploy --prod` ou conectar o repo `isaquediasdev/Ch-de-Panela` na Vercel.

## [2026-05-26] — Claude — Backend migrated to Supabase + JWT (tested locally) ✅
- **What:** Rewrote `server.js` to use **Supabase** (instead of better-sqlite3) and a
  **stateless JWT cookie** (instead of express-session). New shared modules:
  `lib/supabase.js`, `lib/auth.js`, `lib/items.js` (77 items). Added deps
  `@supabase/supabase-js` + `jose`; removed `better-sqlite3`, `connect-sqlite3`,
  `express-session`, `bcryptjs` (unused now, and better-sqlite3 would break the Vercel
  build). `server.js` exports the Express `app` and only `listen`s when run directly
  (ready to wrap for Vercel).
- **DB function:** `place_order(p_user_id, p_items jsonb)` RPC = atomic checkout
  (conflict check + order + order_items + reserved_items + clear cart in one tx).
  Hardened: `execute` revoked from anon/authenticated (only service_role calls it).
- **Tested locally vs real Supabase — all green:** register→code→verify (cookie login),
  cart add/list, atomic order, cash, /orders/me, admin (name+phone+pay), reserve conflict
  (409), admin cancel (cascade frees gift). Test rows truncated afterwards.
- **Security:** RLS on all tables, no anon policies (service-role-only) — INFO advisories
  are expected/intended.
- **Next / open:** Vercel deploy = wrap app + `vercel.json` + set env vars on Vercel
  (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `ADMIN_PASSWORD`,
  `NODE_ENV=production`) → then Cloudflare DNS for `cha.isana.ia.br`. Email service TBD.
- **For Codex:** frontend (`public/*`) is essentially unchanged (same `/api` endpoints).
  Backend (`server.js`, `lib/`) is Claude's workstream — please don't edit those.

## [2026-05-26] — Claude — Access verified (Vercel + Cloudflare) + domain = isana.ia.br
- **Domain:** `isana.ia.br` (DNS on Cloudflare). Chá subdomain **confirmed by user:
  `cha.isana.ia.br`** (`casamento.` is the couple's other Vite site).
- **Vercel:** team "Isaque's projects" (`team_X6djzH2eg3IbgVr8yurfn6yk`). Existing
  projects: juda, countdown, fincontrol, leticia-50, **casamento**. ⚠️ "casamento" is a
  **separate Vite app** already serving `casamento.isana.ia.br` — NOT our chá. We must
  create a **NEW Vercel project** for this repo (`Ch-de-Panela`).
- **Cloudflare:** account `cca2706351d43ee2c7ac894059541c97`
  (Isaquebarbosa.dev@gmail.com). ⚠️ The connected Cloudflare MCP is Workers/D1/KV/R2-
  focused — **no DNS-record tools visible**. The chá subdomain DNS may need an API token
  or the dashboard.
- **Supabase:** API URL `https://fwhnsizxqthbugviraoo.supabase.co`.
- **Blocker (need from Isaque):** Supabase **service_role** secret key — NOT exposed via
  MCP; copy from Supabase dashboard → Project Settings → API. Needed as a Vercel env var
  (`SUPABASE_SERVICE_ROLE_KEY`) + local `.env` so the serverless functions can read/write
  the DB. Also will need a `JWT_SECRET` (any long random string) for cookie auth.
- **Next / open:** confirm subdomain + get service_role key → then build migration
  (Express → `/api/*` serverless + Supabase + JWT cookie auth) and deploy via Vercel MCP.

## [2026-05-26] — Claude — Supabase project + schema created
- **What:** Created dedicated Supabase project **cha-panelas-isana** (ref
  `fwhnsizxqthbugviraoo`, sa-east-1, free $0/mo) and applied migration `initial_schema`:
  tables `users`, `cart_items`, `orders`, `order_items`, `reserved_items`,
  `login_codes` — all RLS-enabled (API uses the **service_role** key, which bypasses
  RLS; no anon/public access).
- **Schema notes:** dropped legacy `password_hash` (OTP-only auth now).
  `reserved_items.order_id` is now `on delete cascade` (cancelling/deleting an order
  auto-frees the gift). Gift items stay in code for now (not yet a DB table).
- **Next / open:** Vercel access, Cloudflare token, email service still pending. The
  code migration (Express routes → `/api/*` serverless + Supabase client + JWT cookie
  auth) can start now; split with Codex per the AGENTS.md workstreams.

## [2026-05-26] — Claude — Coordination set up + Supabase MCP confirmed

- **What:** Read Codex's `AGENTS.md`, `MEMORY.md` and `docs/deployment-plan.md` and
  aligned with them. Added the mandatory **logging rule** to `AGENTS.md`, created
  `CLAUDE.md`, and created this `WORKLOG.md` as the shared diary both agents must use.
- **Supabase:** MCP **is** available (Codex couldn't see it before). Existing project
  **"juda"** (`titpyhocbzvnzlieckde`, sa-east-1) belongs to ANOTHER system
  (tenants/sales, 915 rows) → **do NOT use it.** Need a dedicated project for the chá.
- **Decision:** backend target = **Option A** (Vercel serverless API + Supabase
  Postgres). Sessions must become **stateless JWT in an httpOnly cookie**
  (express-session can't run on Vercel serverless).
- **Files:** `AGENTS.md`, `CLAUDE.md`, `MEMORY.md`, `WORKLOG.md`.
- **Next / open (blockers awaiting the couple):**
  1. Confirm creating a **dedicated Supabase project** for the chá.
  2. **Vercel** access (connect the GitHub repo / CLI token).
  3. **Cloudflare** API token for the Isana zone (to create DNS records).
  4. **Email** service decision for the OTP code (ZeptoMail/Resend/SMTP).
  Once unblocked: create schema migration → port API routes to `/api/*` → wire
  Supabase client + JWT auth → deploy to Vercel → point Cloudflare DNS.

## [2026-06-01] — Claude — Carrinho intacto até pagamento confirmado
- **What:** Novo fluxo de pagamento: `POST /api/card-link` agora NÃO cria pedido.
  Cria uma `payment_session` (uuid, expires 30min) com os itens do carrinho. O link
  InfinitePay usa `order_nsu = session.id`. Carrinho fica intacto. Webhook confirma →
  aí sim: `place_order` RPC cria pedido + reserva itens + limpa carrinho + marca `paid`.
  Tabela `payment_sessions` criada no Supabase. Fluxo dinheiro: botão separado no
  carrinho → `POST /api/orders` → `confirmacao.html` (só para esse caso).
  `confirmacao.html` simplificada para mostrar apenas o fluxo dinheiro.
- **Files:** `server.js`, `public/carrinho.html`, `public/confirmacao.html`.
- **Next / open:** Testar fluxo ponta-a-ponta (InfinitePay + webhook).

## [2026-06-01] — Claude — PIX dinâmico AbacatePay integrado
- **What:** PIX com QR code nativo via AbacatePay (`POST /api/pix-charge`). O convidado
  não sai do site — QR code aparece inline no carrinho. Polling a cada 5s via
  `GET /api/pix-status?sessionId=X` detecta confirmação do webhook. Webhook em
  `POST /api/webhooks/abacatepay` valida secret na query string, evento
  `transparent.completed` → `place_order` RPC → marca pago → limpa carrinho.
  Coluna `charge_id` adicionada em `payment_sessions`. `ABACATEPAY_API_KEY` setada
  na Vercel. Chave de teste: `abc_dev_*`. Falta: webhook secret (quando o Isaque
  cadastrar a URL no painel AbacatePay). Botões no carrinho: PIX (primário), Cartão
  InfinitePay, Dinheiro.
- **Files:** `server.js`, `public/carrinho.html`.
- **Next / open:** Isaque cadastra webhook URL no painel AbacatePay →
  `https://cha.isana.ia.br/api/webhooks/abacatepay?secret=XXXXX` → me manda o secret
  → seto `ABACATEPAY_WEBHOOK_SECRET` na Vercel → testar fluxo ponta-a-ponta.
  Trocar chave `abc_dev_*` pela chave de produção quando pronto.
