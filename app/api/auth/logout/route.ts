import { cookies } from 'next/headers'
import { staffSessionCookie } from '@/lib/staff'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete(staffSessionCookie.name)

  return Response.json({ ok: true })
}
