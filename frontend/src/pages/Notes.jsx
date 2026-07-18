import React, { useState } from 'react';
import { FaPlus, FaSearch, FaUpload, FaBook } from 'react-icons/fa';
import './Notes.css';

const Notes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState([]); // later fetch from API
  const [subjects, setSubjects] = useState([]);

  return (
    <div className="notes-page">
      <div className="container">
        <div className="notes-header">
          <h1 className="page-title">📚 My Notes</h1>
          <div className="notes-actions">
            <button className="btn-primary"><FaPlus /> Add Subject</button>
            <button className="btn-secondary"><FaUpload /> Upload Note</button>
          </div>
        </div>

        <div className="notes-search">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by subject or file name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">Search</button>
          </div>
        </div>

        {notes.length === 0 && subjects.length === 0 ? (
          <div className="empty-state">
            <FaBook className="empty-icon" />
            <h2>No Notes Yet</h2>
            <p>Start by adding a subject and uploading your notes!</p>
            <div className="empty-actions">
              <button className="btn-primary"><FaPlus /> Add Subject</button>
              <button className="btn-secondary"><FaUpload /> Upload Notes</button>
            </div>
          </div>
        ) : (
          <div className="notes-grid">
            {/* Map notes here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;