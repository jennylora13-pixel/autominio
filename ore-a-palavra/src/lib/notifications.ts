import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { capitalize, declarationOfDay } from './prayer'
import { genderize } from './gender'
import { isoDate } from './format'
import type { Profile } from '../types'

/** Daily reminders only exist in the store apps (the web version can't schedule them reliably). */
export const remindersSupported = Capacitor.isNativePlatform()

const TIMES: Record<string, [number, number]> = {
  manha: [7, 30],
  tarde: [12, 30],
  noite: [21, 0],
}

export function reminderTime(prayerTime: string): string {
  const [h, m] = TIMES[prayerTime] ?? TIMES.manha
  return `${h}:${String(m).padStart(2, '0')}`
}

// local notifications can't change text per day, so the next days are scheduled one by one
const DAYS_AHEAD = 30
const FIRST_ID = 1000

export type ReminderResult = 'ok' | 'denied' | 'unsupported'

/**
 * Replaces the scheduled reminders with one per day for the next weeks, each carrying
 * that day's declaration. With `ask`, requests permission if it wasn't decided yet.
 */
export async function scheduleReminders(
  profile: Profile,
  enabled: boolean,
  ask: boolean,
): Promise<ReminderResult> {
  if (!remindersSupported) return 'unsupported'
  const pending = await LocalNotifications.getPending()
  if (pending.notifications.length) {
    await LocalNotifications.cancel({ notifications: pending.notifications.map((n) => ({ id: n.id })) })
  }
  if (!enabled) return 'ok'

  let perm = await LocalNotifications.checkPermissions()
  if (perm.display !== 'granted' && ask) perm = await LocalNotifications.requestPermissions()
  if (perm.display !== 'granted') return 'denied'

  const [hour, minute] = TIMES[profile.prayerTime] ?? TIMES.manha
  const first = profile.name.split(' ')[0]
  const now = Date.now()
  const notifications = []
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const at = new Date()
    at.setDate(at.getDate() + i)
    at.setHours(hour, minute, 0, 0)
    if (at.getTime() <= now) continue
    const decl = declarationOfDay(isoDate(at))
    notifications.push({
      id: FIRST_ID + i,
      title: `${first}, sua declaração de hoje 🌿`,
      body: genderize(capitalize(decl.declaration), profile.gender),
      schedule: { at, allowWhileIdle: true },
      extra: { route: '/declarar' },
    })
  }
  await LocalNotifications.schedule({ notifications })
  return 'ok'
}

/** Opens the Declarar tab when a reminder is tapped. */
export function listenReminderTaps() {
  if (!remindersSupported) return
  void LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
    const route = action.notification.extra?.route
    if (typeof route === 'string') window.location.hash = '#' + route
  })
}
