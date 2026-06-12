import { deleteCookie } from 'h3'

export default defineEventHandler((event) => {
  deleteCookie(event, 'cv_staff_session', { path: '/' })
  return { ok: true }
})
