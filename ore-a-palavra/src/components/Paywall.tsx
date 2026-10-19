import { useState } from 'react'
import { useStore } from '../store'
import { IconCheck, IconClose } from './icons'
import { BENEFITS, PLANS, TRIAL_DAYS, type PlanId } from '../lib/premium'

const REASON_TITLE: Record<string, string> = {
  paraVoce: 'Continue recebendo orações feitas para você',
  audio: 'Ouça suas orações todos os dias',
  ia: 'Orações escritas para a sua situação',
  ajustes: 'Ore todos os dias com a Palavra',
}

/** Full-screen subscription offer. Always lets the person continue on the free plan. */
export default function Paywall() {
  const { data, paywall, closePaywall } = useStore()
  const [plan, setPlan] = useState<PlanId>('anual')
  const [msg, setMsg] = useState('')
  if (!paywall) return null

  const name = data.profile?.name.split(' ')[0]
  const selected = PLANS.find((p) => p.id === plan)!

  function subscribe() {
    if (selected.checkoutUrl) {
      window.location.href = selected.checkoutUrl
      return
    }
    setMsg('O pagamento ainda não está ativo nesta versão do app. Em breve você poderá assinar por aqui.')
  }

  return (
    <div className="paywall" role="dialog" aria-modal="true" aria-labelledby="paywall-title">
      <button className="iconbtn ghost paywall-close" onClick={closePaywall} aria-label="Fechar">
        <IconClose />
      </button>
      <div className="paywall-body">
        <div className="paywall-kicker">Ore a Palavra Premium</div>
        <h1 id="paywall-title">
          {name ? `${name}, ` : ''}
          {REASON_TITLE[paywall].charAt(0).toLowerCase() + REASON_TITLE[paywall].slice(1)}
        </h1>
        <ul className="paywall-benefits">
          {BENEFITS.map((b) => (
            <li key={b}>
              <span className="tick">
                <IconCheck />
              </span>
              {b}
            </li>
          ))}
        </ul>

        <div className="plans" role="radiogroup" aria-label="Plano">
          {PLANS.map((p) => (
            <button
              key={p.id}
              role="radio"
              aria-checked={plan === p.id}
              className={'plan' + (plan === p.id ? ' on' : '')}
              onClick={() => setPlan(p.id)}
            >
              {p.badge && <span className="plan-badge">{p.badge}</span>}
              <span className="plan-name">{p.name}</span>
              <span className="plan-price">{p.price}</span>
              <span className="plan-detail">{p.detail}</span>
            </button>
          ))}
        </div>

        {msg && <div className="notice info">{msg}</div>}
        <button className="btn primary paywall-cta" onClick={subscribe}>
          Começar {TRIAL_DAYS} dias grátis
        </button>
        <p className="paywall-terms">
          Grátis por {TRIAL_DAYS} dias, depois {selected.price}. Cancele quando quiser, sem multa.
        </p>
        <button className="paywall-free" onClick={closePaywall}>
          Continuar com o plano gratuito
        </button>
        <p className="paywall-free-note">
          No plano gratuito você continua orando por qualquer situação, com a declaração do dia e o seu
          diário.
        </p>
      </div>
    </div>
  )
}
