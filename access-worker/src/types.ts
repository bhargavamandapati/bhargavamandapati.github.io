export type Realm = 'learn' | 'sdv' | 'aiml'

export const REALMS: Realm[] = ['learn', 'sdv', 'aiml']

export function isRealm(value: unknown): value is Realm {
  return value === 'learn' || value === 'sdv' || value === 'aiml'
}

export type Env = {
  DB: D1Database
  RESEND_API_KEY: string
  FROM_EMAIL: string
  ADMIN_TOKEN: string
  CI_TOKEN: string
}
