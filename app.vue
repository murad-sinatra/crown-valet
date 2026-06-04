<template>
  <main class="page-shell">
    <section class="hero">
      <nav class="nav" aria-label="Primary navigation">
        <a class="brand" href="#">
          <span class="brand-mark">CV</span>
          Crown Valet
        </a>

        <div class="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#download">Download</a>
        </div>
      </nav>

      <div class="hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Valet parking, now on demand</p>
          <h1>Arrive in style. Let Crown Valet handle the parking.</h1>
          <p class="hero-text">
            Request a verified valet, track your car in real time, and get it returned
            right when you are ready to leave.
          </p>

          <div class="hero-actions" id="download">
            <a class="button primary" href="#">Get the app</a>
            <a class="button secondary" href="#how-it-works">See how it works</a>
          </div>

          <div class="trust-row" aria-label="Customer highlights">
            <span>4.9 app rating</span>
            <span>Insured drivers</span>
            <span>Live vehicle tracking</span>
          </div>
        </div>

        <div class="phone-card" aria-label="Crown Valet app preview">
          <div class="phone-header">
            <span></span>
            <span></span>
          </div>

          <div class="status-card">
            <p>Your valet is arriving</p>
            <strong>2 min</strong>
          </div>

          <div class="map-card">
            <div class="map-route"></div>
            <div class="car-pin">P</div>
            <div class="home-pin">You</div>
          </div>

          <div class="driver-card">
            <div>
              <p>Driver</p>
              <strong>Maya R.</strong>
            </div>
            <span>Verified</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="features">
      <div class="section-heading">
        <p class="eyebrow">Built for smooth arrivals</p>
        <h2>Everything guests need before, during, and after drop-off.</h2>
      </div>

      <div class="feature-grid">
        <article class="feature-card">
          <span class="icon">01</span>
          <h3>Instant valet requests</h3>
          <p>Choose a destination, confirm your arrival window, and meet a valet curbside.</p>
        </article>

        <article class="feature-card">
          <span class="icon">02</span>
          <h3>Secure vehicle updates</h3>
          <p>See when your car is checked in, where it is parked, and who is assigned.</p>
        </article>

        <article class="feature-card">
          <span class="icon">03</span>
          <h3>Return on your schedule</h3>
          <p>Tap once when you are ready and your vehicle is staged before you step outside.</p>
        </article>
      </div>
    </section>

    <section class="how-it-works" id="how-it-works">
      <div>
        <p class="eyebrow">How it works</p>
        <h2>Premium parking in three simple steps.</h2>
      </div>

      <div class="steps">
        <div class="step">
          <span>1</span>
          <p>Book a valet near your hotel, restaurant, venue, or office.</p>
        </div>
        <div class="step">
          <span>2</span>
          <p>Hand off your keys to a verified Crown Valet driver.</p>
        </div>
        <div class="step">
          <span>3</span>
          <p>Request return and leave without circling the block.</p>
        </div>
      </div>
    </section>

    <section class="stats">
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

    <section class="cta">
      <p class="eyebrow">Ready when you are</p>
      <h2>Make every arrival feel effortless.</h2>
      <a class="button primary" href="#">Start parking smarter</a>
    </section>
  </main>
</template>

<style>
:root {
  color: #182033;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  background: #f7f2ea;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background:
    radial-gradient(circle at top left, rgba(205, 161, 87, 0.28), transparent 34rem),
    linear-gradient(135deg, #fff9ef 0%, #f6efe5 50%, #edf1f6 100%);
}

a {
  color: inherit;
  text-decoration: none;
}

.page-shell {
  min-height: 100vh;
  overflow: hidden;
}

.hero {
  min-height: 100vh;
  padding: 28px clamp(20px, 5vw, 72px) 72px;
}

.nav {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 auto 72px;
  max-width: 1180px;
}

.brand,
.nav-links,
.trust-row,
.hero-actions {
  align-items: center;
  display: flex;
}

.brand {
  font-size: 1.05rem;
  font-weight: 800;
  gap: 12px;
  letter-spacing: -0.02em;
}

.brand-mark {
  align-items: center;
  background: #141b2f;
  border-radius: 14px;
  color: #f5c76b;
  display: inline-flex;
  height: 44px;
  justify-content: center;
  width: 44px;
}

.nav-links {
  color: #5e6676;
  font-size: 0.95rem;
  gap: 28px;
}

.hero-grid {
  align-items: center;
  display: grid;
  gap: clamp(40px, 8vw, 96px);
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
  margin: 0 auto;
  max-width: 1180px;
}

.hero-copy h1,
.section-heading h2,
.how-it-works h2,
.cta h2 {
  color: #111827;
  letter-spacing: -0.06em;
  line-height: 0.95;
  margin: 0;
}

.hero-copy h1 {
  font-size: clamp(3.8rem, 8vw, 6.8rem);
  max-width: 760px;
}

.eyebrow {
  color: #a66f18;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  margin: 0 0 18px;
  text-transform: uppercase;
}

.hero-text {
  color: #505b6d;
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  line-height: 1.7;
  margin: 28px 0 0;
  max-width: 640px;
}

.hero-actions {
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 36px;
}

.button {
  border-radius: 999px;
  display: inline-flex;
  font-weight: 800;
  justify-content: center;
  padding: 16px 24px;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.button:hover {
  transform: translateY(-2px);
}

.primary {
  background: #111827;
  box-shadow: 0 18px 40px rgba(17, 24, 39, 0.22);
  color: #fff;
}

.secondary {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(17, 24, 39, 0.1);
  color: #111827;
}

.trust-row {
  color: #5f6878;
  flex-wrap: wrap;
  font-size: 0.95rem;
  gap: 12px;
  margin-top: 34px;
}

.trust-row span {
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 999px;
  padding: 10px 14px;
}

.phone-card {
  background: linear-gradient(160deg, #151d31, #29334f);
  border: 12px solid #111827;
  border-radius: 44px;
  box-shadow:
    0 38px 100px rgba(17, 24, 39, 0.34),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  color: #fff;
  justify-self: center;
  max-width: 390px;
  min-height: 650px;
  padding: 26px;
  position: relative;
  width: 100%;
}

.phone-card::before {
  background: #0c1220;
  border-radius: 0 0 18px 18px;
  content: "";
  height: 28px;
  left: 50%;
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  width: 142px;
}

.phone-header {
  display: flex;
  justify-content: space-between;
  margin: 24px 0 26px;
}

.phone-header span {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  height: 10px;
  width: 68px;
}

.status-card,
.driver-card,
.feature-card,
.step,
.stats,
.cta {
  backdrop-filter: blur(22px);
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: 0 24px 80px rgba(38, 45, 64, 0.12);
}

.status-card {
  border-radius: 26px;
  color: #111827;
  margin-bottom: 18px;
  padding: 22px;
}

.status-card p,
.driver-card p {
  color: #687284;
  margin: 0 0 8px;
}

.status-card strong {
  display: block;
  font-size: 3.8rem;
  letter-spacing: -0.08em;
}

.map-card {
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px),
    linear-gradient(145deg, #344267, #1e263e);
  background-size: 54px 54px, 54px 54px, auto;
  border-radius: 30px;
  height: 260px;
  overflow: hidden;
  position: relative;
}

.map-route {
  border: 4px dashed #f5c76b;
  border-bottom: 0;
  border-left: 0;
  border-radius: 0 80px 0 0;
  height: 140px;
  left: 54px;
  opacity: 0.9;
  position: absolute;
  top: 72px;
  width: 210px;
}

.car-pin,
.home-pin {
  align-items: center;
  border-radius: 999px;
  display: flex;
  font-weight: 900;
  justify-content: center;
  position: absolute;
}

.car-pin {
  background: #f5c76b;
  color: #111827;
  height: 58px;
  left: 42px;
  top: 52px;
  width: 58px;
}

.home-pin {
  background: #fff;
  color: #111827;
  height: 48px;
  right: 38px;
  top: 178px;
  width: 70px;
}

.driver-card {
  align-items: center;
  border-radius: 24px;
  color: #111827;
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
  padding: 18px;
}

.driver-card span {
  background: #e9f7ef;
  border-radius: 999px;
  color: #1c7d43;
  font-size: 0.78rem;
  font-weight: 800;
  padding: 8px 10px;
}

.section,
.how-it-works,
.stats,
.cta {
  margin: 0 auto;
  max-width: 1180px;
}

.section,
.how-it-works,
.cta {
  padding: 96px clamp(20px, 5vw, 72px);
}

.section-heading {
  align-items: end;
  display: flex;
  gap: 32px;
  justify-content: space-between;
  margin-bottom: 34px;
}

.section-heading h2,
.how-it-works h2,
.cta h2 {
  font-size: clamp(2.4rem, 5vw, 4.5rem);
  max-width: 800px;
}

.feature-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(3, 1fr);
}

.feature-card {
  border-radius: 30px;
  padding: 28px;
}

.icon {
  color: #a66f18;
  font-weight: 900;
}

.feature-card h3 {
  font-size: 1.45rem;
  letter-spacing: -0.04em;
  margin: 44px 0 12px;
}

.feature-card p,
.step p {
  color: #596477;
  line-height: 1.7;
  margin: 0;
}

.how-it-works {
  display: grid;
  gap: 36px;
  grid-template-columns: 0.85fr 1.15fr;
}

.steps {
  display: grid;
  gap: 16px;
}

.step {
  align-items: center;
  border-radius: 24px;
  display: flex;
  gap: 18px;
  padding: 22px;
}

.step span {
  align-items: center;
  background: #111827;
  border-radius: 18px;
  color: #f5c76b;
  display: flex;
  flex: 0 0 52px;
  font-weight: 900;
  height: 52px;
  justify-content: center;
}

.stats {
  border-radius: 34px;
  display: grid;
  gap: 1px;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
  padding: 0;
}

.stats div {
  background: rgba(255, 255, 255, 0.54);
  padding: 34px;
}

.stats strong {
  display: block;
  font-size: clamp(2rem, 4vw, 3.5rem);
  letter-spacing: -0.06em;
}

.stats span {
  color: #626c7d;
}

.cta {
  border-radius: 42px;
  margin-bottom: 72px;
  margin-top: 96px;
  text-align: center;
}

.cta .button {
  margin-top: 30px;
}

@media (max-width: 900px) {
  .nav-links {
    display: none;
  }

  .hero {
    padding-bottom: 40px;
  }

  .hero-grid,
  .how-it-works {
    grid-template-columns: 1fr;
  }

  .hero-copy h1 {
    font-size: clamp(3.2rem, 16vw, 5.3rem);
  }

  .phone-card {
    min-height: 580px;
  }

  .section-heading {
    align-items: start;
    flex-direction: column;
  }

  .feature-grid,
  .stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .hero {
    padding-inline: 18px;
  }

  .hero-actions,
  .button {
    width: 100%;
  }

  .phone-card {
    border-width: 8px;
    border-radius: 36px;
    min-height: auto;
    padding: 18px;
  }

  .map-card {
    height: 220px;
  }

  .section,
  .how-it-works,
  .cta {
    padding-inline: 18px;
  }
}
</style>
