type LoadingScreenProps = {
  message?: string
}

export default function LoadingScreen({ message = 'Loading…' }: LoadingScreenProps) {
  return (
    <div className="loading-screen" role="status" aria-live="polite" aria-busy="true">
      <div className="loading-screen__content">
        <div className="loading-spinner" aria-hidden="true" />
        <p className="loading-screen__message">{message}</p>
      </div>
    </div>
  )
}
