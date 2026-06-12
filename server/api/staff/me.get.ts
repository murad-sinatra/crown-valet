import { getCurrentStaffUser } from '~/server/utils/staff'

export default defineEventHandler(async (event) => {
  const user = await getCurrentStaffUser(event)
  return { id: user.id, name: user.name, email: user.email, role: user.role }
})
