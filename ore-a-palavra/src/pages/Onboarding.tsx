import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store'
import CareNotice from '../components/CareNotice'
import { IconChevronLeft, IconClose, IconPlus } from '../components/icons'
import { THEMES, THEME_BY_ID } from '../data/themes'
import { findThemes, looksLikeCrisis } from '../lib/search'
import { genderize } from '../lib/gender'
import type { Gender, Person, Profile, Relationship, Walk } from '../types'

type Draft = Omit<Profile, 'completedAt'> & { hasKids: boolean | null }

const EMPTY_DRAFT: Draft = {
  name: '',
  gender: 'n',
  walk: null,
  themeIds: [],
  why: '',
  obstacle: '',
  past: '',
  bigAsk: '',
  relationship: null,
  partner: '',
  partnerNote: '',
  children: [],
  people: [],
  work: '',
  prayerTime: '',
  hasKids: null,
}

interface Option {
  value: string
  label: string
}

type Step = { id: string; when?: (d: Draft) => boolean } & (
  | { kind: 'info'; lines: (d: Draft) => string[]; care?: (d: Draft) => boolean }
  | {
      kind: 'text'
      question: (d: Draft) => string
      preface?: (d: Draft) => string
      placeholder: string
      optional?: boolean
      get: (d: Draft) => string
      set: (d: Draft, v: string) => Draft
    }
  | { kind: 'choice'; question: (d: Draft) => string; options: Option[]; set: (d: Draft, v: string) => Draft }
  | { kind: 'themes'; question: (d: Draft) => string }
  | { kind: 'people'; question: (d: Draft) => string }
  | { kind: 'finish' }
)

const WALK_VERSE: Record<Walk, string[]> = {
  firme: [
    'Que bom saber disso.',
    '“E não nos cansemos de fazer o bem, porque a seu tempo ceifaremos, se não houvermos desfalecido.” Gálatas 6:9',
  ],
  buscando: [
    'Deus se deixa encontrar por quem O busca.',
    '“E buscar-me-eis e me achareis quando me buscardes de todo o vosso coração.” Jeremias 29:13',
  ],
  distante: [
    'Não importa a distância: o caminho de volta é curto.',
    '“Chegai-vos a Deus, e ele se chegará a vós.” Tiago 4:8',
  ],
  recomecando: [
    'Recomeços são o terreno favorito de Deus.',
    '“As misericórdias do Senhor são a causa de não sermos consumidos; porque as suas misericórdias não têm fim; novas são cada manhã.” Lamentações 3:22-23',
  ],
}

function firstName(d: Draft): string {
  return d.name.trim().split(/\s+/)[0] ?? ''
}

const STEPS: Step[] = [
  {
    id: 'ola',
    kind: 'info',
    lines: () => ['Olá! Que bom ter você aqui.', 'Este é o seu espaço para orar a Palavra sobre a sua vida.'],
  },
  {
    id: 'antes',
    kind: 'info',
    lines: () => [
      'Antes de começar, quero te conhecer um pouco.',
      'Quanto mais você compartilhar, mais pessoais serão as suas orações.',
      'Tudo o que você responder fica guardado só no seu celular.',
    ],
  },
  {
    id: 'nome',
    kind: 'text',
    question: () => 'Primeiro, como posso te chamar?',
    placeholder: 'Seu nome',
    get: (d) => d.name,
    set: (d, v) => ({ ...d, name: v }),
  },
  {
    id: 'tratamento',
    kind: 'choice',
    question: (d) => `${firstName(d)}, como você prefere que eu fale com você?`,
    options: [
      { value: 'f', label: 'No feminino (amada)' },
      { value: 'm', label: 'No masculino (amado)' },
      { value: 'n', label: 'Sem marcar gênero' },
    ],
    set: (d, v) => ({ ...d, gender: v as Gender }),
  },
  {
    id: 'nome-resposta',
    kind: 'info',
    lines: (d) => [
      `Que alegria te conhecer, ${firstName(d)}.`,
      '“Não temas, porque eu te remi; chamei-te pelo teu nome; tu és meu.” Isaías 43:1',
    ],
  },
  {
    id: 'caminhada',
    kind: 'choice',
    question: () => 'Como está a sua caminhada com Deus nesta fase?',
    options: [
      { value: 'firme', label: 'Firme' },
      { value: 'buscando', label: 'Buscando mais' },
      { value: 'distante', label: 'Um pouco distante' },
      { value: 'recomecando', label: 'Recomeçando' },
    ],
    set: (d, v) => ({ ...d, walk: v as Walk }),
  },
  {
    id: 'caminhada-resposta',
    kind: 'info',
    when: (d) => !!d.walk,
    lines: (d) => WALK_VERSE[d.walk ?? 'buscando'],
  },
  {
    id: 'temas',
    kind: 'themes',
    question: () => 'Pelo que você mais tem orado?',
  },
  {
    id: 'porque',
    kind: 'text',
    question: () => 'Por que isso é tão importante para você agora?',
    placeholder: 'Escreva com as suas palavras…',
    optional: true,
    get: (d) => d.why,
    set: (d, v) => ({ ...d, why: v }),
  },
  {
    id: 'obstaculo',
    kind: 'text',
    question: () => 'O que parece estar no seu caminho hoje?',
    placeholder: 'Ex.: dívidas, medo, cansaço…',
    optional: true,
    get: (d) => d.obstacle,
    set: (d, v) => ({ ...d, obstacle: v }),
  },
  {
    id: 'obstaculo-resposta',
    kind: 'info',
    when: (d) => !!d.obstacle,
    lines: (d) => {
      const theme = findThemes(d.obstacle)[0] ?? THEME_BY_ID[d.themeIds[0]] ?? THEME_BY_ID.forca
      const v = theme.verses[0]
      return [`Entendo, ${firstName(d)}. Você não carrega isso sozinho(a).`, `“${v.text}” ${v.ref}`]
    },
  },
  {
    id: 'passado',
    kind: 'text',
    question: () => 'Existe algo do seu passado que você ainda precisa entregar a Deus?',
    placeholder: 'Só se você quiser…',
    optional: true,
    get: (d) => d.past,
    set: (d, v) => ({ ...d, past: v }),
  },
  {
    id: 'passado-resposta',
    kind: 'info',
    when: (d) => !!d.past,
    care: (d) => looksLikeCrisis([d.why, d.obstacle, d.past].join(' ')),
    lines: () => [
      'Obrigado(a) pela confiança.',
      '“Não vos lembreis das coisas passadas, nem considereis as antigas. Eis que farei uma coisa nova.” Isaías 43:18-19',
    ],
  },
  {
    id: 'cuidado',
    kind: 'info',
    when: (d) => !d.past && looksLikeCrisis([d.why, d.obstacle].join(' ')),
    care: () => true,
    lines: () => ['Antes de continuar, quero te dizer uma coisa importante.'],
  },
  {
    id: 'relacionamento',
    kind: 'choice',
    question: () => 'Sobre relacionamento, você está…',
    options: [
      { value: 'solteiro', label: 'Solteiro(a)' },
      { value: 'namorando', label: 'Namorando' },
      { value: 'casado', label: 'Casado(a)' },
      { value: 'complicado', label: 'É complicado' },
    ],
    set: (d, v) => ({ ...d, relationship: v as Relationship }),
  },
  {
    id: 'parceiro',
    kind: 'text',
    when: (d) => d.relationship === 'namorando' || d.relationship === 'casado',
    question: () => 'Qual o nome da pessoa com quem você está?',
    placeholder: 'Nome',
    optional: true,
    get: (d) => d.partner,
    set: (d, v) => ({ ...d, partner: v }),
  },
  {
    id: 'parceiro-admira',
    kind: 'text',
    when: (d) => !!d.partner,
    question: (d) => `O que você admira em ${d.partner}?`,
    placeholder: 'Escreva com as suas palavras…',
    optional: true,
    get: (d) => d.partnerNote,
    set: (d, v) => ({ ...d, partnerNote: v }),
  },
  {
    id: 'filhos',
    kind: 'choice',
    question: () => 'Você tem filhos?',
    options: [
      { value: 'sim', label: 'Sim' },
      { value: 'nao', label: 'Não' },
    ],
    set: (d, v) => ({ ...d, hasKids: v === 'sim', children: v === 'sim' ? d.children : [] }),
  },
  {
    id: 'filhos-nomes',
    kind: 'text',
    when: (d) => !!d.hasKids,
    question: () => 'Como eles se chamam?',
    placeholder: 'Separe os nomes por vírgula',
    optional: true,
    get: (d) => d.children.join(', '),
    set: (d, v) => ({
      ...d,
      children: v.split(/,| e /).map((x) => x.trim()).filter(Boolean),
    }),
  },
  {
    id: 'pessoas',
    kind: 'people',
    question: () => 'Por quem mais você carrega no coração em oração?',
  },
  {
    id: 'trabalho',
    kind: 'choice',
    question: () => 'Como você se sente sobre o seu trabalho ou estudo?',
    options: [
      { value: 'amo', label: 'Amo o que faço' },
      { value: 'bom', label: 'Está bom por agora' },
      { value: 'novo', label: 'Pronto(a) para algo novo' },
      { value: 'paralelo', label: 'Construindo algo paralelo' },
    ],
    set: (d, v) => ({ ...d, work: v }),
  },
  {
    id: 'pedido-maior',
    kind: 'text',
    preface: (d) =>
      `Agora ore com fé, ${firstName(d)}. Deus “é poderoso para fazer tudo muito mais abundantemente além daquilo que pedimos ou pensamos.” Efésios 3:20`,
    question: () => 'O que você ainda não teve coragem de pedir a Ele?',
    placeholder: 'Pode sonhar grande…',
    optional: true,
    get: (d) => d.bigAsk,
    set: (d, v) => ({ ...d, bigAsk: v }),
  },
  {
    id: 'horario',
    kind: 'choice',
    question: () => 'Qual o melhor momento do dia para orar com você?',
    options: [
      { value: 'manha', label: 'De manhã' },
      { value: 'tarde', label: 'À tarde' },
      { value: 'noite', label: 'À noite' },
    ],
    set: (d, v) => ({ ...d, prayerTime: v }),
  },
  { id: 'fim', kind: 'finish' },
]

export default function Onboarding() {
  const { saveProfile } = useStore()
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT)
  const [history, setHistory] = useState<number[]>([0])
  const index = history[history.length - 1]
  const step = STEPS[index]
  const t = (s: string) => genderize(s, draft.gender)

  function nextIndex(from: number, d: Draft): number {
    let i = from + 1
    while (i < STEPS.length - 1 && STEPS[i].when && !STEPS[i].when!(d)) i++
    return i
  }

  function advance(d: Draft = draft) {
    setDraft(d)
    setHistory((h) => [...h, nextIndex(index, d)])
  }

  function back() {
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h))
  }

  useEffect(() => {
    if (step.kind !== 'finish') return
    const { hasKids: _, ...answers } = draft
    const timer = setTimeout(() => saveProfile({ ...answers, completedAt: Date.now() }), 2800)
    return () => clearTimeout(timer)
  }, [step, draft, saveProfile])

  const progress = Math.round((index / (STEPS.length - 1)) * 100)

  return (
    <div className="onb">
      <div className="onb-top">
        {history.length > 1 && step.kind !== 'finish' ? (
          <button className="iconbtn ghost" onClick={back} aria-label="Voltar">
            <IconChevronLeft />
          </button>
        ) : (
          <span style={{ width: 42 }} />
        )}
        <div className="onb-progress">
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="onb-body" key={step.id}>
        {step.kind === 'info' && (
          <>
            <div className="onb-lines">
              {step.lines(draft).map((line) => (
                <p key={line} className={line.startsWith('“') ? 'verse-line' : ''}>
                  {t(line)}
                </p>
              ))}
            </div>
            {step.care?.(draft) && <CareNotice gender={draft.gender} />}
            <button className="onb-continue" onClick={() => advance()}>
              Continuar
            </button>
          </>
        )}

        {step.kind === 'text' && (
          <TextStep
            key={step.id}
            preface={step.preface ? t(step.preface(draft)) : undefined}
            question={t(step.question(draft))}
            placeholder={step.placeholder}
            optional={step.optional}
            initial={step.get(draft)}
            onSubmit={(v) => advance(step.set(draft, v))}
          />
        )}

        {step.kind === 'choice' && (
          <>
            <h1 className="onb-q">{t(step.question(draft))}</h1>
            <div className="onb-options">
              {step.options.map((o) => (
                <button
                  key={o.value}
                  className="pill"
                  onClick={() => advance(step.set(draft, o.value))}
                >
                  {genderize(o.label, draft.gender)}
                </button>
              ))}
            </div>
          </>
        )}

        {step.kind === 'themes' && (
          <ThemesStep
            question={t(step.question(draft))}
            initial={draft.themeIds}
            onSubmit={(themeIds) => advance({ ...draft, themeIds })}
          />
        )}

        {step.kind === 'people' && (
          <PeopleStep
            question={t(step.question(draft))}
            initial={draft.people}
            onSubmit={(people) => advance({ ...draft, people })}
          />
        )}

        {step.kind === 'finish' && (
          <div className="onb-finish">
            <div className="onb-lines">
              <p>{t(`Obrigado(a) por compartilhar, ${firstName(draft)}.`)}</p>
              <p>Estou preparando as suas orações…</p>
            </div>
            <div className="orb" aria-hidden />
          </div>
        )}
      </div>
    </div>
  )
}

function TextStep({
  preface,
  question,
  placeholder,
  optional,
  initial,
  onSubmit,
}: {
  preface?: string
  question: string
  placeholder: string
  optional?: boolean
  initial: string
  onSubmit: (v: string) => void
}) {
  const [value, setValue] = useState(initial)
  const v = value.trim()
  return (
    <>
      {preface && <p className="onb-preface">{preface}</p>}
      <h1 className="onb-q">{question}</h1>
      <form
        className="onb-input"
        onSubmit={(e) => {
          e.preventDefault()
          if (v || optional) onSubmit(v)
        }}
      >
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label={question}
        />
        <button type="submit" disabled={!v} aria-label="Enviar">
          →
        </button>
      </form>
      {optional && !v && (
        <button className="onb-skip" onClick={() => onSubmit('')}>
          Pular
        </button>
      )}
    </>
  )
}

function ThemesStep({
  question,
  initial,
  onSubmit,
}: {
  question: string
  initial: string[]
  onSubmit: (ids: string[]) => void
}) {
  const [selected, setSelected] = useState<string[]>(initial)
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  return (
    <>
      <h1 className="onb-q">{question}</h1>
      <p className="onb-hint">Escolha quantos quiser.</p>
      <div className="onb-chips">
        {THEMES.map((th) => (
          <button
            key={th.id}
            className={'pill small' + (selected.includes(th.id) ? ' on' : '')}
            onClick={() => toggle(th.id)}
          >
            {th.emoji} {th.name}
          </button>
        ))}
      </div>
      <button className="onb-continue" disabled={!selected.length} onClick={() => onSubmit(selected)}>
        Continuar
      </button>
    </>
  )
}

function PeopleStep({
  question,
  initial,
  onSubmit,
}: {
  question: string
  initial: Person[]
  onSubmit: (people: Person[]) => void
}) {
  const [people, setPeople] = useState<Person[]>(initial)
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const canAdd = useMemo(() => name.trim().length > 0, [name])

  function add() {
    if (!canAdd) return
    setPeople((p) => [...p, { name: name.trim(), note: note.trim() }])
    setName('')
    setNote('')
  }

  return (
    <>
      <h1 className="onb-q">{question}</h1>
      <p className="onb-hint">Amigos, pais, alguém que precisa de cura… Você pode mudar isso depois.</p>
      {people.map((p, i) => (
        <div className="person-card" key={i}>
          <div>
            <b>{p.name}</b>
            {p.note && <div className="muted">{p.note}</div>}
          </div>
          <button
            className="iconbtn ghost"
            onClick={() => setPeople((list) => list.filter((_, j) => j !== i))}
            aria-label={`Remover ${p.name}`}
          >
            <IconClose width={18} />
          </button>
        </div>
      ))}
      <div className="person-add">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Pelo que você ora por essa pessoa? (opcional)"
        />
        <button className="btn subtle" onClick={add} disabled={!canAdd}>
          <IconPlus width={18} /> Adicionar pessoa
        </button>
      </div>
      <button className="onb-continue" onClick={() => onSubmit(people)}>
        {people.length ? 'Continuar' : 'Pular'}
      </button>
    </>
  )
}
