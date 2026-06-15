export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json({ statusMessage: error.message }, { status: error.statusCode })
  }

  console.error(error)
  return Response.json({ statusMessage: 'Internal server error' }, { status: 500 })
}
