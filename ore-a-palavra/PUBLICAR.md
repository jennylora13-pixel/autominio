# Como publicar o Ore a Palavra nas lojas

Guia para publicar como **pessoa física**, **sem Mac**. O app já está preparado: projetos de iPhone (`ios/`) e Android (`android/`) feitos com Capacitor, ícones e tela de abertura gerados, lembrete diário e a configuração de compilação na nuvem (`codemagic.yaml`, na raiz do repositório).

Identificador do app nas lojas: **`com.oreapalavra.app`** (não muda depois da primeira publicação).

---

## 1. Criar as contas

| | Apple | Google |
|---|---|---|
| Onde | developer.apple.com/programs/enroll | play.google.com/console/signup |
| Tipo | **Individual** (pessoa física) | **Pessoal** |
| Custo | US$ 99 por ano | US$ 25, uma vez |
| Precisa de | ID Apple com verificação em duas etapas, nome legal, cartão | Documento de identidade, cartão |
| Aparece na loja como | seu nome | seu nome |

- A Apple pode levar de 1 a 2 dias para aprovar a conta.
- No Google, contas pessoais novas precisam de um **teste fechado com pelo menos 12 pessoas por 14 dias** antes de publicar para todos. Comece a juntar esses testadores cedo (família, amigos, igreja).
- Se depois você abrir uma empresa (Integrally Well), dá para **transferir o app** para a conta da empresa sem perder avaliações nem assinantes.

## 2. Antes de enviar para revisão (pendências)

- [ ] **Bíblia Livre:** trocar os versículos da biblioteca (`src/data/themes.ts`) pelo texto oficial da BLIVRE e mostrar o crédito no app ("Bíblia Livre (BLIVRE), 2018 — licença Creative Commons").
- [ ] **Compra dentro do app:** a Apple e o Google exigem a compra deles para assinaturas. Nos apps de loja, os links externos (Hotmart/Kiwify) ficam desativados. Falta integrar a compra (sugestão: RevenueCat). **Não envie para revisão com a tela de assinatura sem compra funcionando**, porque a Apple rejeita.
- [ ] **Política de privacidade e termos de uso** publicados num endereço público (site, Notion público ou GitHub Pages).
- [ ] **E-mail de suporte.**
- [ ] **IA (opcional):** para a "Personalizar com IA" funcionar no app instalado, o servidor (`server/server.mjs`) precisa estar hospedado e o endereço configurado em `VITE_API_URL`. Sem isso, deixe a IA de fora da primeira versão (ela já vem desligada).

## 3. Compilar na nuvem com o Codemagic (sem Mac)

1. Entre em **codemagic.io** com a sua conta do GitHub e adicione o repositório `autominio`. O plano gratuito inclui 500 minutos por mês em máquinas macOS.
2. Em **Environment variables**, crie o grupo **`ore_a_palavra`** com:
   - `APP_STORE_APPLE_ID`: o número do app no App Store Connect (passo 4).
   - `VITE_API_URL` e `VITE_CHECKOUT_*`: só se for usar.

### Android
3. Em **Code signing identities → Android keystores**, gere uma chave com o nome **`ore_a_palavra_upload`**. Guarde a senha num lugar seguro: sem ela não dá para atualizar o app.
4. Rode o fluxo **"Android (Google Play)"**. Ele gera um arquivo `.aab`.
5. No Google Play Console, crie o app e **envie esse primeiro `.aab` manualmente** (o Google exige o primeiro envio pela página). Para os próximos, crie uma conta de serviço do Google Cloud e coloque o JSON em `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS`. O Codemagic passa a enviar sozinho para o teste interno.

### iPhone
6. No **App Store Connect → Usuários e acesso → Integrações**, crie uma **chave de API** com acesso de "App Manager" e baixe o arquivo `.p8`.
7. No Codemagic, em **Integrations → App Store Connect**, adicione essa chave com o nome **`Ore a Palavra`**.
8. No App Store Connect, crie o app com o identificador **`com.oreapalavra.app`**. O número que aparece em "Apple ID" vai em `APP_STORE_APPLE_ID`.
9. Em **Code signing identities → iOS certificates**, deixe o Codemagic gerar o certificado de distribuição, e em **iOS provisioning profiles**, busque o perfil do app.
10. Rode o fluxo **"iPhone (App Store / TestFlight)"**. O app vai para o **TestFlight**. Instale o app TestFlight no seu iPhone para testar antes de publicar.

## 4. Página na loja

- **Nome:** Ore a Palavra (confira se está livre na loja e no INPI).
- **Categoria:** Estilo de vida (ou Referência).
- **Classificação etária:** 4+.
- **Capturas de tela:** iPhone 6,9" e 6,5"; Android de telefone. Posso gerar a partir do app.
- **Privacidade (formulário da Apple e "Segurança dos dados" do Google):** sem IA, o app **não coleta dados** (tudo fica no aparelho). Com IA, o texto da oração, a forma de tratamento e os nomes da família são enviados para gerar a oração e não são usados para rastreamento.

## 5. Custos iniciais

| Item | Valor |
|---|---|
| Apple Developer | US$ 99 por ano |
| Google Play | US$ 25, uma vez |
| Codemagic | gratuito até 500 min/mês |
| Bíblia Livre | gratuita (com crédito) |
| RevenueCat (assinaturas) | gratuito até US$ 2,5 mil por mês de receita |
| Comissão das lojas sobre assinaturas | 15% (programa para pequenas empresas da Apple e taxa padrão do Google para assinaturas) |
