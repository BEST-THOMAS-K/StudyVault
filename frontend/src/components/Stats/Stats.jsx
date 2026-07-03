import "./Stats.css";

function Stats() {
  const stats = [
    { number: "10K+", label: "Study Notes" },
    { number: "5K+", label: "Students" },
    { number: "98%", label: "Success Rate" },
    { number: "24/7", label: "AI Assistance" },
  ];

  return (
    <section className="stats">
      {stats.map((item, index) => (
        <div className="stat-card" key={index}>
          <h2>{item.number}</h2>
          <p>{item.label}</p>
        </div>
      ))}
    </section>
  );
}

export default Stats;