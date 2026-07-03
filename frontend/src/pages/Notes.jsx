import "./Notes.css";

function Notes() {
  const notes = [
    {
      id: 1,
      title: "Data Structures",
      subject: "Computer Science",
      author: "Best Thomas",
    },
    {
      id: 2,
      title: "Database Management System",
      subject: "Computer Science",
      author: "Laxman",
    },
    {
      id: 3,
      title: "Operating Systems",
      subject: "Computer Science",
      author: "StudyVault",
    },
    {
      id: 4,
      title: "Computer Networks",
      subject: "Computer Science",
      author: "Community",
    },
  ];

  const handlePreview = (title) => {
    alert(`Opening preview for "${title}"`);
  };

  const handleDownload = (title) => {
    alert(`Downloading "${title}"`);
  };

  return (
    <div className="notes-page">

      <div className="notes-header">
        <h1>Study Notes</h1>
        <p>Browse, preview and download quality notes.</p>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search notes..."
        />

        <button>
          Search
        </button>
      </div>

      <div className="notes-grid">

        {notes.map((note) => (

          <div className="note-card" key={note.id}>

            <h2>{note.title}</h2>

            <p>{note.subject}</p>

            <small>Uploaded by {note.author}</small>

            <div className="note-buttons">

              <button
                onClick={() => handlePreview(note.title)}
              >
                Preview
              </button>

              <button
                onClick={() => handleDownload(note.title)}
              >
                Download
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Notes;