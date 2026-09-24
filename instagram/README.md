# Instagram agent — 13 skills de Claude

Pacote [instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill)
do Jake Schincariol (licença MIT, commit `d03c56b`), instalado como skills
**locais do projeto** em `.claude/skills/ig-*`. Qualquer sessão do Claude Code
aberta neste repositório já enxerga os comandos. Nada posta sozinho: as skills
escrevem, você revisa e posta.

## Os comandos

| comando | o que faz |
| --- | --- |
| `/ig-reel` | Uma ideia vira Reel: 3 ganchos (26 fórmulas) com nota, roteiro, texto na tela e beat sheet cronometrado. |
| `/ig-viral` | Encontra o que está performando no seu nicho e ranqueia pelo múltiplo sobre a mediana de cada conta. |
| `/ig-caption` | Legenda revisada, mostrando os ~125 caracteres que aparecem antes do "... mais". |
| `/ig-carousel` | Carrossel: capa, texto de cada slide, arquivos 1080x1350. |
| `/ig-story` | Sequência de stories do dia, stickers e funil de DM. |
| `/ig-profile` | Nota do perfil de 0 a 100 (rubrica de 12 partes) e reescrita. |
| `/ig-plan` | O plano da semana: o que postar, formato, horário, 10 contas pra interagir. |
| `/ig-human` | O humanizador: tira travessões, clichês e caracteres invisíveis e dá nota. |
| `/ig-comment` | Comentários em posts de outras pessoas (9 tipos). |
| `/ig-reply` | Respostas aos comentários do seu post, em ordem de prioridade. |
| `/ig-dm` | Entrega por palavra-chave, primeira mensagem, pitch de collab e 2 follow-ups. |
| `/ig-repurpose` | Um vídeo/podcast/newsletter vira uma semana de reels e carrosséis. |
| `/ig-audit` | Análise do que já foi postado: múltiplo de outlier e envios por alcance. |

## Primeiro passo: `voice.md`

Todas as skills leem `~/.claude/instagram/voice.md`. Use o modelo deste
repositório:

```bash
mkdir -p ~/.claude/instagram
cp instagram/voice.template.md ~/.claude/instagram/voice.md
```

Preencha à mão, ou mande três legendas/roteiros seus pro Claude e diga
"escreva meu voice.md a partir destes". Coloque no campo de idioma
**português do Brasil** para as skills escreverem em PT-BR.

> Sessões na nuvem (claude.ai/code) começam com a pasta `~` vazia. Lá, peça
> "copie `instagram/voice.md` para `~/.claude/instagram/voice.md`" no início,
> ou salve seu `voice.md` preenchido em `instagram/voice.md` neste repositório.

## As ferramentas em Python (sem dependências, sem internet)

```bash
python3 .claude/skills/ig-reel/hookscore.py ganchos.txt       # nota dos ganchos
python3 .claude/skills/ig-reel/beats.py roteiro.txt --target 30
python3 .claude/skills/ig-caption/caption.py legenda.txt --keywords "fé,oração"
python3 .claude/skills/ig-human/humanize.py rascunho.txt --report
python3 .claude/skills/ig-human/detect.py rascunho.txt
python3 .claude/skills/ig-viral/swipe.py capturado.tsv --out ~/.claude/instagram/swipe.md
```

**Atenção com português:** os scripts foram feitos para inglês. A contagem de
caracteres, a prévia do feed, o limite de 5 hashtags, a remoção de caracteres
invisíveis e de travessões funcionam em qualquer idioma. Já a lista de clichês
(`ig-human/slop.json`), os padrões de gancho (`ig-reel/hooks.json`) e a
detecção de CTA/saudação reconhecem expressões em inglês. Em PT-BR, trate as
notas desses pontos como orientação, não como veredito — ou acrescente termos
em português no `slop.json`.

## Atualizar

```bash
git clone --depth 1 https://github.com/Jakeschincariol/instagram-agent-skill.git /tmp/igs
cp -r /tmp/igs/skills/ig-* .claude/skills/
```
