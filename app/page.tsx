import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <nav className="nav" aria-label="Primary navigation">
          <a className="brand brand--logo" href="#" aria-label="Crown Valet home">
            <img className="brand-logo brand-logo--home" src="/logo.png" alt="Crown Valet" />
          </a>

          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#download">Download</a>
          </div>

          <Link className="nav-login" href="/staff/login">
            Sign in
          </Link>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Valet parking, now on demand</p>
            <h1>Arrive in style. Let Crown Valet handle the parking.</h1>
            <p className="hero-text">
              Request a verified valet, track your car in real time, and get it returned right when
              you are ready to leave.
            </p>

            <div id="download" className="hero-actions">
              <a className="button primary" href="#">
                Get the app
              </a>
              <a className="button secondary" href="#how-it-works">
                See how it works
              </a>
            </div>

            <p className="staff-portal-hint">
              Valet team member? <Link href="/staff/login">Sign in to the staff portal</Link> or{' '}
              <Link href="/staff/signup">create an account</Link>
            </p>

            <div className="trust-row" aria-label="Customer highlights">
              <span>4.9 app rating</span>
              <span>Insured drivers</span>
              <span>Live vehicle tracking</span>
            </div>
          </div>

          <div className="phone-card" aria-label="Crown Valet app preview">
            <div className="phone-header">
              <span></span>
              <span></span>
            </div>

            <div className="status-card">
              <p>Your valet is arriving</p>
              <strong>2 min</strong>
            </div>

            <div className="map-card">
              <div className="map-route"></div>
              <div className="car-pin">P</div>
              <div className="home-pin">You</div>
            </div>

            <div className="driver-card">
              <div>
                <p>Driver</p>
                <strong>Maya R.</strong>
              </div>
              <span>Verified</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="section-heading">
          <p className="eyebrow">Built for smooth arrivals</p>
          <h2>Everything guests need before, during, and after drop-off.</h2>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <span className="icon">01</span>
            <h3>Instant valet requests</h3>
            <p>Choose a destination, confirm your arrival window, and meet a valet curbside.</p>
          </article>

          <article className="feature-card">
            <span className="icon">02</span>
            <h3>Secure vehicle updates</h3>
            <p>See when your car is checked in, where it is parked, and who is assigned.</p>
          </article>

          <article className="feature-card">
            <span className="icon">03</span>
            <h3>Return on your schedule</h3>
            <p>Tap once when you are ready and your vehicle is staged before you step outside.</p>
          </article>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <div>
          <p className="eyebrow">How it works</p>
          <h2>Premium parking in three simple steps.</h2>
        </div>

        <div className="steps">
          <div className="step">
            <span>1</span>
            <p>Book a valet near your hotel, restaurant, venue, or office.</p>
          </div>
          <div className="step">
            <span>2</span>
            <p>Hand off your keys to a verified Crown Valet driver.</p>
          </div>
          <div className="step">
            <span>3</span>
            <p>Request return and leave without circling the block.</p>
          </div>
        </div>
      </section>

      <section className="stats">
        <div>
          <strong>30K+</strong>
          <span>Cars parked</span>
        </div>
        <div>
          <strong>12 min</strong>
          <span>Average return time</span>
        </div>
        <div>
          <strong>24/7</strong>
          <span>Guest support</span>
        </div>
      </section>

      <section className="cta">
        <p className="eyebrow">Ready when you are</p>
        <h2>Make every arrival feel effortless.</h2>
        <a className="button primary" href="#">
          Start parking smarter
        </a>
      </section>
    </main>
  )
}
