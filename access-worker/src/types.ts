export type Realm = 'learn' | 'sdv'

export const REALMS: Realm[] = ['learn', 'sdv']

export function isRealm(value: unknown): value is Realm {
  return value === 'learn' || value === 'sdv'
}

export type Env = {
  DB: D1Database
  RESEND_API_KEY: string
  FROM_EMAIL: string
  ADMIN_TOKEN: string
  CI_TOKEN: string
}
