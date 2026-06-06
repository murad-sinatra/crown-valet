<template>
  <main class="page-shell">
    <section class="hero">
      <nav class="nav" aria-label="Primary navigation">
        <a class="brand brand--logo" href="#" aria-label="Crown Valet home">
          <img class="brand-logo brand-logo--home" src="/logo.png" alt="Crown Valet">
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

          <div id="download" class="hero-actions">
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

    <section id="features" class="section">
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

    <section id="how-it-works" class="how-it-works">
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
