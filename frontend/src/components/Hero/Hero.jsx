import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-text">

        <p className="tagline">
          🚀 Smart Learning Platform
        </p>

        <h1>
          Study Smarter.
          <br />
          Learn Faster.
        </h1>

        <p className="description">
          Organize notes, access previous year papers,
          collaborate with classmates and boost your
          productivity—all from one beautiful platform.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">
            Get Started
          </button>

          <button className="secondary-btn">
            Explore Notes
          </button>
        </div>

      </div>

      <div className="hero-image">

        <div className="image-card">

          📚

        </div>

      </div>

    </section>
  );
}

export default Hero;