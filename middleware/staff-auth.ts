export default defineNuxtRouteMiddleware(() => {
  const staffSession = useCookie('cv_staff_session')

  if (!staffSession.value) {
    return navigateTo('/staff/login')
  }
})
