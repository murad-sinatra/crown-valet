import { createHash, randomBytes } from 'node:crypto'

export function createTicketToken() {
  const token = randomBytes(32).toString('base64url')

  return {
    token,
    tokenHash: hashTicketToken(token),
    lastFourHint: token.slice(-4),
  }
}

export function hashTicketToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export function createTicketNumber() {
  const datePart = new Date().toISOString().slice(2, 10).replaceAll('-', '')
  const randomPart = randomBytes(2).toString('hex').toUpperCase()

  return `CV-${datePart}-${randomPart}`
}
