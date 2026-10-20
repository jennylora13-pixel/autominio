// Servidor do Ore a Palavra.
//
// - POST /api/orar  { situacao, temas }  -> { verses, prayer }  (usa o Claude)
// - GET  qualquer outro caminho          -> arquivos do app em dist/
//
// A chave da API fica só aqui no servidor (ANTHROPIC_API_KEY), nunca no navegador.
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Anthropic from '@anthropic-ai/sdk'

const PORT = Number(process.env.PORT ?? 8787)
const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const MAX_SITUACAO = 1500
const NAO_CONFIGURADA = 'IA não configurada: defina ANTHROPIC_API_KEY no servidor.'

const client = new Anthropic()

const SYSTEM = `Você é um assistente de oração cristão do app "Ore a Palavra".
A pessoa descreve uma situação da vida dela. Você:
1. Escolhe de 3 a 5 versículos bíblicos que falam diretamente dessa situação.
   Cite o texto em português na tradução Almeida (Revista e Corrigida), com fidelidade.
   Use apenas versículos que você conhece com segurança; nunca invente ou junte trechos.
2. Para cada versículo, escreve uma declaração curta em primeira pessoa, começando em minúscula,
   que completa a frase "Por isso eu declaro: ..." (ex.: "eu lanço sobre Ti toda a minha ansiedade, porque Tu cuidas de mim.").
3. Escreve uma oração em primeira pessoa, dirigida a Deus, em 4 a 7 parágrafos curtos, que:
   - começa acolhendo a situação com palavras simples e calorosas;
   - ora usando os versículos escolhidos (pode citá-los com a referência entre parênteses);
   - declara as promessas com fé, sem prometer resultados específicos que a Bíblia não promete;
   - termina com "Em nome de Jesus, amém."
Escreva em português do Brasil, com linguagem acessível, sem jargão e sem sermão.
Se vier um perfil: faça a concordância de gênero conforme o "tratamento" (feminino ou masculino) e, quando a situação envolver a família, ore pelo
cônjuge e pelos filhos pelo nome. Nunca invente detalhes sobre essas pessoas.
Se a situação indicar risco de suicídio ou autolesão, inclua na oração um pedido de cuidado e
encoraje com carinho a pessoa a procurar ajuda agora (CVV 188 no Brasil; SNS 24 808 24 24 em Portugal).`

const SCHEMA = {
  type: 'object',
  properties: {
    verses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          reference: { type: 'string' },
          text: { type: 'string' },
          declaration: { type: 'string' },
        },
        required: ['reference', 'text', 'declaration'],
        additionalProperties: false,
      },
    },
    prayer: { type: 'array', items: { type: 'string' } },
  },
  required: ['verses', 'prayer'],
  additionalProperties: false,
}

async function gerarOracao(situacao, temas, perfil) {
  const pedido =
    `Situação: ${situacao}` +
    (temas.length ? `\nTemas sugeridos pelo app: ${temas.join(', ')}` : '') +
    (perfil ? `\nPerfil: ${JSON.stringify(perfil)}` : '')

  let response
  try {
    response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA } },
      system: SYSTEM,
      messages: [{ role: 'user', content: pedido }],
    })
  } catch (err) {
    // erros da API seguem para o tratamento geral; o resto é falta de credenciais
    if (err instanceof Anthropic.APIError) throw err
    throw new HttpError(503, NAO_CONFIGURADA)
  }

  if (response.stop_reason === 'refusal') {
    throw new HttpError(422, 'Não foi possível gerar uma oração para este texto. Tente descrever de outro jeito.')
  }
  const text = response.content.find((b) => b.type === 'text')?.text
  if (!text) throw new HttpError(502, 'A IA não retornou uma oração.')
  return JSON.parse(text)
}

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

async function readBody(req) {
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > 20_000) throw new HttpError(413, 'Texto muito longo.')
  }
  try {
    return JSON.parse(raw)
  } catch {
    throw new HttpError(400, 'Pedido inválido.')
  }
}

/** Keeps only the expected profile fields, with bounded sizes. */
function lerPerfil(p) {
  if (!p || typeof p !== 'object') return null
  const nome = (x) => String(x ?? '').trim().slice(0, 60)
  return {
    tratamento: ['feminino', 'masculino', 'neutro'].includes(p.tratamento) ? p.tratamento : 'neutro',
    conjuge: nome(p.conjuge),
    filhos: Array.isArray(p.filhos) ? p.filhos.slice(0, 10).map(nome).filter(Boolean) : [],
  }
}

async function handleOrar(req, res) {
  const body = await readBody(req)
  const situacao = String(body.situacao ?? '').trim().slice(0, MAX_SITUACAO)
  const temas = Array.isArray(body.temas) ? body.temas.map(String).slice(0, 5) : []
  if (!situacao && !temas.length) throw new HttpError(400, 'Escreva pelo que você quer orar.')
  sendJson(res, 200, await gerarOracao(situacao, temas, lerPerfil(body.perfil)))
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
}

async function serveStatic(req, res) {
  const url = new URL(req.url ?? '/', 'http://x')
  const file = path.normalize(path.join(DIST, url.pathname === '/' ? 'index.html' : url.pathname))
  if (!file.startsWith(DIST)) throw new HttpError(404, 'Não encontrado.')
  try {
    const data = await readFile(file)
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' })
    res.end(data)
  } catch {
    throw new HttpError(404, 'Não encontrado. Rode "npm run build" para gerar o app.')
  }
}

// The store apps load the page from these origins (iOS and Android) and call the API across origins
const APP_ORIGINS = new Set(['capacitor://localhost', 'https://localhost'])

function allowAppOrigin(req, res) {
  const origin = req.headers.origin
  if (!origin || !APP_ORIGINS.has(origin)) return
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Vary', 'Origin')
}

http
  .createServer(async (req, res) => {
    try {
      allowAppOrigin(req, res)
      if (req.method === 'OPTIONS' && req.url === '/api/orar') {
        res.writeHead(204)
        res.end()
      } else if (req.method === 'POST' && req.url === '/api/orar') await handleOrar(req, res)
      else if (req.method === 'GET') await serveStatic(req, res)
      else throw new HttpError(405, 'Método não permitido.')
    } catch (err) {
      if (err instanceof HttpError) return sendJson(res, err.status, { erro: err.message })
      if (err instanceof Anthropic.AuthenticationError) {
        return sendJson(res, 503, { erro: NAO_CONFIGURADA })
      }
      if (err instanceof Anthropic.RateLimitError) {
        return sendJson(res, 429, { erro: 'Muitos pedidos agora. Tente de novo em instantes.' })
      }
      console.error(err)
      sendJson(res, 500, { erro: 'Erro ao gerar a oração. Tente de novo.' })
    }
  })
  .listen(PORT, () => console.log(`Ore a Palavra em http://localhost:${PORT}`))
