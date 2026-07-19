import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaUpload, FaBook, FaTimes, FaFolderOpen, FaFileAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import './Notes.css';

const Notes = () => {
  const { authFetch } = useAuth();
  const { addNotification } = useNotifications();
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newNote, setNewNote] = useState({
    title: '',
    subject: '',
    file: null,
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch subjects and notes on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch subjects
      const subjectsRes = await authFetch('http://localhost:8000/api/notes/subjects/');
      const subjectsData = await subjectsRes.json();
      if (subjectsRes.ok) {
        setSubjects(subjectsData);
      } else {
        console.error('Failed to fetch subjects:', subjectsData);
        // If endpoint doesn't exist, use mock data for demo
        setSubjects([]);
      }

      // Fetch notes
      const notesRes = await authFetch('http://localhost:8000/api/notes/notes/');
      const notesData = await notesRes.json();
      if (notesRes.ok) {
        setNotes(notesData);
      } else {
        console.error('Failed to fetch notes:', notesData);
        setNotes([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
      // For demo, use empty arrays
      setSubjects([]);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Add Subject
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    setSubmitting(true);
    try {
      const res = await authFetch('http://localhost:8000/api/notes/subjects/', {
        method: 'POST',
        body: JSON.stringify({ name: newSubjectName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubjects([data, ...subjects]);
        setNewSubjectName('');
        setShowSubjectModal(false);
        // Add notification
        addNotification('Subject Added', `New subject "${data.name}" created`, null, new Date().toISOString());
      } else {
        alert(data.message || 'Failed to add subject');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Upload Note
  const handleUploadNote = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.subject || !newNote.file) {
      alert('Please fill all required fields and select a file.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('title', newNote.title);
    formData.append('subject', newNote.subject);
    formData.append('file', newNote.file);
    if (newNote.description) formData.append('description', newNote.description);

    try {
      const res = await authFetch('http://localhost:8000/api/notes/upload/', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type, browser will set it with boundary
      });
      const data = await res.json();
      if (res.ok) {
        setNotes([data, ...notes]);
        setNewNote({ title: '', subject: '', file: null, description: '' });
        setShowNoteModal(false);
        // Add notification
        addNotification(
          data.subject || 'New Note',
          `"${data.title}" uploaded`,
          data.file,
          new Date().toISOString()
        );
      } else {
        alert(data.message || 'Failed to upload note');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to get subject name by ID
  const getSubjectName = (id) => {
    const subj = subjects.find(s => s.id === id);
    return subj ? subj.name : 'Unknown';
  };

  // Loading state
  if (loading) {
    return (
      <div className="notes-page">
        <div className="container">
          <div className="loading-state">Loading your notes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-page">
      <div className="container">
        <div className="notes-header">
          <h1 className="page-title">📚 My Notes</h1>
          <div className="notes-actions">
            <button className="btn-primary" onClick={() => setShowSubjectModal(true)}>
              <FaPlus /> Add Subject
            </button>
            <button className="btn-secondary" onClick={() => setShowNoteModal(true)}>
              <FaUpload /> Upload Note
            </button>
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

        {error && (
          <div className="notes-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Subjects List */}
        {subjects.length > 0 && (
          <div className="subjects-section">
            <h3 className="section-subtitle">Your Subjects</h3>
            <div className="subjects-list">
              {subjects.map(subject => (
                <div key={subject.id} className="subject-chip">
                  <FaFolderOpen /> {subject.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <FaBook className="empty-icon" />
            <h2>{searchTerm ? 'No matching notes' : 'No Notes Yet'}</h2>
            <p>
              {searchTerm
                ? 'Try a different search term'
                : 'Start by adding a subject and uploading your notes!'
              }
            </p>
            <div className="empty-actions">
              <button className="btn-primary" onClick={() => setShowSubjectModal(true)}>
                <FaPlus /> Add Subject
              </button>
              <button className="btn-secondary" onClick={() => setShowNoteModal(true)}>
                <FaUpload /> Upload Notes
              </button>
            </div>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map(note => (
              <div key={note.id} className="note-card">
                <div className="note-icon"><FaFileAlt /></div>
                <div className="note-info">
                  <h4 className="note-title">{note.title}</h4>
                  <p className="note-subject">{getSubjectName(note.subject)}</p>
                  {note.description && <p className="note-desc">{note.description}</p>}
                  <div className="note-meta">
                    <span>{note.uploaded_at ? new Date(note.uploaded_at).toLocaleDateString() : 'Just now'}</span>
                    {note.file && (
                      <a href={note.file} target="_blank" rel="noopener noreferrer" className="note-link">
                        View File
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Add Subject Modal ===== */}
      {showSubjectModal && (
        <div className="modal-overlay" onClick={() => setShowSubjectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaPlus /> Add Subject</h2>
              <button className="modal-close" onClick={() => setShowSubjectModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddSubject}>
              <div className="form-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g., Mathematics"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  required
                  className="modal-input"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowSubjectModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Upload Note Modal ===== */}
      {showNoteModal && (
        <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaUpload /> Upload Note</h2>
              <button className="modal-close" onClick={() => setShowNoteModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUploadNote}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  placeholder="Note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  required
                  className="modal-input"
                />
              </div>
              <div className="form-group">
                <label>Subject *</label>
                <select
                  value={newNote.subject}
                  onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })}
                  required
                  className="modal-select"
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                {subjects.length === 0 && (
                  <p className="helper-text">No subjects yet. Please add a subject first.</p>
                )}
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  placeholder="Brief description"
                  value={newNote.description}
                  onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                  className="modal-textarea"
                />
              </div>
              <div className="form-group">
                <label>File *</label>
                <input
                  type="file"
                  onChange={(e) => setNewNote({ ...newNote, file: e.target.files[0] })}
                  required
                  className="modal-file"
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                />
                <p className="helper-text">Accepted: PDF, Word, PowerPoint, Text</p>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowNoteModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting || subjects.length === 0}>
                  {submitting ? 'Uploading...' : 'Upload Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;