import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppData, Note, Prayer, Verse } from './types'

const STORAGE_KEY = 'notas-de-sermao/v1'

const EMPTY: AppData = { notes: [], verses: [], prayers: [] }

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function load(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return withSeed()
    const parsed = JSON.parse(raw) as Partial<AppData>
    return {
      notes: parsed.notes ?? [],
      verses: parsed.verses ?? [],
      prayers: parsed.prayers ?? [],
    }
  } catch {
    return EMPTY
  }
}

/** Conteúdo de exemplo mostrado no primeiro uso. */
function withSeed(): AppData {
  const now = Date.now()
  const today = new Date().toISOString().slice(0, 10)
  const note: Note = {
    id: uid(),
    title: 'Bem-vindo às suas Notas de Sermão',
    date: today,
    preacher: 'Equipe do App',
    church: 'Minha Igreja',
    series: 'Primeiros passos',
    scriptures: ['Salmos 119:105', 'Josué 1:8'],
    body:
      'Toque no lápis para editar esta nota, ou no botão + para criar a sua.\n\n' +
      '• Guarde o pregador, a igreja e a série\n' +
      '• Anexe versículos como referência\n' +
      '• Use #tags para organizar\n' +
      '• Marque como favorita com a estrela\n\n' +
      '"Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho."',
    tags: ['fé', 'palavra'],
    favorite: true,
    createdAt: now,
    updatedAt: now,
  }
  const verse: Verse = {
    id: uid(),
    reference: 'Filipenses 4:13',
    text: 'Posso todas as coisas naquele que me fortalece.',
    note: 'Para os dias difíceis.',
    createdAt: now,
  }
  const prayer: Prayer = {
    id: uid(),
    text: 'Sabedoria para as decisões desta semana.',
    status: 'aberto',
    createdAt: now,
    answeredAt: null,
  }
  return { notes: [note], verses: [verse], prayers: [prayer] }
}

interface Store {
  data: AppData
  // notes
  saveNote: (input: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Note
  deleteNote: (id: string) => void
  toggleFavorite: (id: string) => void
  // verses
  addVerse: (input: Omit<Verse, 'id' | 'createdAt'>) => Verse
  deleteVerse: (id: string) => void
  // prayers
  addPrayer: (text: string) => void
  togglePrayer: (id: string) => void
  deletePrayer: (id: string) => void
  // data
  replaceAll: (data: AppData) => void
  clearAll: () => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      /* quota / private mode — ignore */
    }
  }, [data])

  const store = useMemo<Store>(() => {
    return {
      data,
      saveNote(input) {
        const now = Date.now()
        if (input.id) {
          const existing = data.notes.find((n) => n.id === input.id)
          const saved: Note = {
            ...(existing as Note),
            ...input,
            id: input.id,
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
          }
          setData((d) => ({
            ...d,
            notes: d.notes.map((n) => (n.id === input.id ? saved : n)),
          }))
          return saved
        }
        const saved: Note = { ...input, id: uid(), createdAt: now, updatedAt: now } as Note
        setData((d) => ({ ...d, notes: [saved, ...d.notes] }))
        return saved
      },
      deleteNote(id) {
        setData((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== id) }))
      },
      toggleFavorite(id) {
        setData((d) => ({
          ...d,
          notes: d.notes.map((n) =>
            n.id === id ? { ...n, favorite: !n.favorite, updatedAt: Date.now() } : n,
          ),
        }))
      },
      addVerse(input) {
        const verse: Verse = { ...input, id: uid(), createdAt: Date.now() }
        setData((d) => ({ ...d, verses: [verse, ...d.verses] }))
        return verse
      },
      deleteVerse(id) {
        setData((d) => ({ ...d, verses: d.verses.filter((v) => v.id !== id) }))
      },
      addPrayer(text) {
        const prayer: Prayer = {
          id: uid(),
          text,
          status: 'aberto',
          createdAt: Date.now(),
          answeredAt: null,
        }
        setData((d) => ({ ...d, prayers: [prayer, ...d.prayers] }))
      },
      togglePrayer(id) {
        setData((d) => ({
          ...d,
          prayers: d.prayers.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: p.status === 'aberto' ? 'respondido' : 'aberto',
                  answeredAt: p.status === 'aberto' ? Date.now() : null,
                }
              : p,
          ),
        }))
      },
      deletePrayer(id) {
        setData((d) => ({ ...d, prayers: d.prayers.filter((p) => p.id !== id) }))
      },
      replaceAll(next) {
        setData({
          notes: next.notes ?? [],
          verses: next.verses ?? [],
          prayers: next.prayers ?? [],
        })
      },
      clearAll() {
        setData(EMPTY)
      },
    }
  }, [data])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore deve ser usado dentro de StoreProvider')
  return ctx
}
