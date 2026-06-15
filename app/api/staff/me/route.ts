import { errorResponse } from '@/lib/api-error'
import { getCurrentStaffUser } from '@/lib/staff'

export async function GET() {
  try {
    const user = await getCurrentStaffUser()
    return Response.json({ id: user.id, name: user.name, email: user.email, role: user.role })
  } catch (error) {
    return errorResponse(error)
  }
}
