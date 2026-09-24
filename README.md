# Notas de Sermão 📖

App mobile-first para **anotar pregações, guardar versículos e organizar seus estudos bíblicos** — inspirado no *Bible Note / Sermon Notes*.

Funciona 100% no navegador (offline‑first), guarda tudo **localmente no seu dispositivo** e pode ser instalado como app (PWA).

## Funcionalidades

- **Notas de sermão** — título, data, pregador, igreja, série, corpo da mensagem
- **Versículos** anexados a cada nota, com um **seletor de referência** que traz os 66 livros da Bíblia (capítulo e versículo)
- **Tags** (#hashtags) para organizar e filtrar
- **Favoritas** ⭐ e busca por título, versículo, pregador, igreja ou tag
- **Biblioteca de versículos** — guarde passagens marcantes com uma anotação pessoal
- **Lista de orações** — pedidos em aberto e marcados como respondidos 🙏
- **Modo claro / escuro / automático**
- **Backup** — exportar e importar todos os dados em JSON
- **Compartilhar** notas (Web Share API / copiar)
- **PWA** — instalável e utilizável sem conexão

## Tecnologias

- React 18 + TypeScript
- Vite
- React Router (HashRouter)
- Persistência via `localStorage` (sem servidor, seus dados não saem do aparelho)

## Rodando o projeto

```bash
npm install
npm run dev        # ambiente de desenvolvimento
npm run build      # gera a versão de produção em dist/
npm run preview    # serve a versão de produção localmente
```

Depois é só abrir a URL mostrada no terminal. No celular, use "Adicionar à tela de início" para instalar como app.

## Estrutura

```
src/
  components/   # TabBar, TopBar, NoteCard, ScripturePicker, ícones
  pages/        # Home, NoteEditor, NoteDetail, Verses, Prayers, Settings
  lib/          # livros da Bíblia, formatação de datas, tema
  store.tsx     # estado global + persistência em localStorage
  types.ts      # modelos de dados
```

> Privacidade: nenhum dado é enviado para servidores. Tudo fica salvo apenas no navegador do dispositivo.

## Instagram agent (skills de Claude)

Este repositório também traz as 13 skills `/ig-*` do pacote instagram-agent-skill (MIT) em `.claude/skills/`. Veja [instagram/README.md](instagram/README.md).
