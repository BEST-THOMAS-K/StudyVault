import "./Features.css";

function Features() {
  const features = [
    {
      title: "Study Notes",
      text: "Access high-quality notes from seniors."
    },
    {
      title: "AI Assistant",
      text: "Instant answers to your study questions."
    },
    {
      title: "Previous Papers",
      text: "Practice with PYQs before exams."
    },
    {
      title: "Community",
      text: "Collaborate with students."
    }
  ];

  return (
    <section className="features">

      <h2>Everything You Need</h2>

      <div className="feature-grid">

        {features.map((feature, index) => (

          <div className="feature-card" key={index}>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </div>

        ))}

      </div>

    </section>
  );
}

export default Features;