# Ore a Palavra 🙏

App mobile-first que **ajuda a orar e declarar a Bíblia**: você escreve pelo que quer orar, o app encontra versículos para a sua situação e monta uma oração com eles.

Funciona no navegador, guarda tudo **no seu dispositivo** e pode ser instalado como app (PWA). A IA é opcional.

## Funcionalidades

- **Boas-vindas em conversa** — uma pergunta por tela: nome, como prefere ser tratado(a) (feminino, masculino ou sem marcar gênero), caminhada com Deus, temas, o que está no caminho, cônjuge, filhos, pessoas por quem ora, trabalho e o "pedido maior". As respostas principais recebem um versículo de volta. Tudo fica só no aparelho.
- **Para você** — orações prontas a partir das respostas: por quem a pessoa ama (pelo nome), pelos temas escolhidos, pelo pedido maior e para entregar o passado.
- **Orações com nome e gênero certos** — "Eu Te agradeço pela vida de Calebe…"; "cansada" / "cansado" / "cansado(a)". O gênero nunca é deduzido do nome: vem da resposta da pessoa.
- **Orar** — escreva a situação ("estou ansiosa com uma entrevista amanhã") ou escolha um dos 22 temas. O app traz versículos, uma declaração em primeira pessoa para cada um, e uma oração guiada com eles.
- **Personalizar com IA** (opcional) — o Claude escolhe versículos e escreve uma oração sobre a sua situação específica.
- **Declarar** — uma declaração bíblica por dia, com contador de dias seguidos, e declarações por tema.
- **Diário de oração** — salve orações e marque quando forem respondidas.
- **Cuidado em crise** — se o texto indicar risco de suicídio ou autolesão, o app mostra contatos de ajuda (CVV 188, SNS 24).
- **Modo claro / escuro / automático**, **backup** em JSON, **compartilhar** orações.

## Rodando

```bash
cd ore-a-palavra
npm install
npm run dev          # só o app, sem IA (biblioteca offline)
```

### Com IA

A chave da API fica só no servidor, nunca no navegador:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
npm run server       # servidor de oração em http://localhost:8787
npm run dev          # em outro terminal; /api é redirecionado para o servidor
```

Depois, em **Ajustes → Oração com IA**, escolha **Sim**.

Para produção, `npm start` gera o app e o servidor serve o app e a API no mesmo endereço.

## Estrutura

```
src/
  data/themes.ts   # biblioteca: temas, palavras-chave, versículos, declarações
  lib/search.ts    # encontra temas a partir do texto (e detecta crise)
  lib/gender.ts    # ajusta "(a)" conforme o tratamento escolhido
  lib/prayer.ts    # monta a oração e escolhe a declaração do dia
  lib/ai.ts        # chama o servidor de IA
  pages/           # Onboarding, Pray, Declare, Journal, Settings
  store.tsx        # estado + localStorage
server/server.mjs  # API /api/orar (Claude) + arquivos do app
```

Para adicionar um tema, inclua um item em `src/data/themes.ts`: palavras-chave sem acento (termine com `=` para exigir a palavra inteira), abertura, encerramento e versículos com declaração.

## Antes de publicar

- **Tradução da Bíblia:** os textos seguem a tradição Almeida. Traduções como ARA, ARC, NVI e NAA têm direitos autorais; para um app comercial, licencie a tradução ou use um texto de domínio público/licença livre, e confira cada versículo.
- **IA:** orações geradas por IA podem errar a citação; o app avisa para conferir na Bíblia.
- **Privacidade (LGPD):** crença religiosa e dados de família são dados sensíveis. Sem IA, nada sai do aparelho. Com IA, vão ao servidor e à API da Anthropic apenas o texto da situação, a forma de tratamento e os nomes do cônjuge e dos filhos. Antes de publicar, inclua política de privacidade e consentimento.
