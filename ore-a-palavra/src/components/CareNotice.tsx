import { genderize } from '../lib/gender'
import type { Gender } from '../types'

/** Support contacts shown when a text suggests risk of self-harm. */
export default function CareNotice({ gender = 'n' }: { gender?: Gender }) {
  return (
    <div className="notice care">
      <b>{genderize('Você não está sozinho(a).', gender)}</b> Se você está pensando em tirar a
      própria vida ou se machucar, fale com alguém agora: <b>CVV 188</b> (Brasil, 24h, gratuito)
      ou <b>SNS 24 808 24 24</b> (Portugal). Em perigo imediato, ligue <b>192</b> / <b>112</b>.
      Deus se importa com você, e há pessoas prontas para ajudar.
    </div>
  )
}
