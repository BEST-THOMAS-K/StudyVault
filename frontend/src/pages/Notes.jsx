import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import "./Notes.css";

// File Preview Modal Component
const FilePreviewModal = ({ file, onClose }) => {
  if (!file) return null;

  const fileURL = file.file ? URL.createObjectURL(file.file) : null;

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="preview-modal-header">
          <h3>{file.name || file.title}</h3>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>
        <div className="preview-modal-content">
          {file.type === "image" && fileURL && (
            <img src={fileURL} alt={file.name} className="preview-image" />
          )}
          {file.type === "pdf" && fileURL && (
            <iframe
              src={`${fileURL}#toolbar=1`}
              className="preview-pdf"
              title="PDF Preview"
            />
          )}
          {!fileURL && (
            <div className="preview-placeholder">
              <p>Preview not available for this file type</p>
              <p>File: {file.name || file.title}</p>
            </div>
          )}
        </div>
        <div className="preview-modal-footer">
          <button className="download-btn" onClick={() => {
            if (file.file) {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(file.file);
              link.download = file.name;
              link.click();
            }
          }}>
            Download
          </button>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

function Notes() {
  const { authFetch, accessToken, user } = useAuth();
  const { addNotification } = useNotifications();
  
  // --- STATE ---
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [showReviewAll, setShowReviewAll] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [selectedSubjectForView, setSelectedSubjectForView] = useState(null);
  const [showSubjectFiles, setShowSubjectFiles] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const API_BASE = "http://127.0.0.1:8000/api/notes";

  // --- FETCH SUBJECTS FROM DJANGO WITH AUTH ---
  const fetchSubjects = async () => {
    try {
      const response = await authFetch(`${API_BASE}/subjects/`);
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  // --- FETCH NOTES FROM DJANGO WITH AUTH ---
  const fetchNotes = async () => {
    try {
      const response = await authFetch(`${API_BASE}/notes/`);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // --- LOAD DATA ON MOUNT ---
  useEffect(() => {
    fetchSubjects();
    fetchNotes();
  }, []);

  // --- ADD SUBJECT WITH AUTH ---
  const handleAddSubject = async () => {
    if (!newSubject.trim()) return;

    try {
      const response = await authFetch(`${API_BASE}/subjects/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSubject.trim() }),
      });

      if (response.ok) {
        setNewSubject("");
        setShowAddSubject(false);
        fetchSubjects();
        
        // Add notification for new subject
        addNotification(
          "StudyVault",
          `New subject created: ${newSubject.trim()}`,
          "subject",
          new Date().toISOString()
        );
      } else {
        alert("Failed to add subject");
      }
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  // --- UPLOAD NOTE TO DJANGO WITH AUTH ---
  const handleFileUpload = async (event, subjectName) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);

    const subjectObj = subjects.find(s => s.name === subjectName);
    if (!subjectObj) {
      alert(`Subject "${subjectName}" not found. Please add it first.`);
      setUploading(false);
      return;
    }

    const subjectId = subjectObj.id;

    let successCount = 0;
    for (const file of files) {
      const formData = new FormData();
      const title = file.name.replace(/\.[^/.]+$/, "");
      formData.append("title", title);
      formData.append("subject", subjectId);
      formData.append("file", file);

      try {
        // Use fetch with token for FormData
        const response = await fetch(`${API_BASE}/notes/`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        });

        if (response.ok) {
          successCount++;
          
          // --- ADD NOTIFICATION FOR EACH SUCCESSFUL UPLOAD ---
          console.log('📢 Creating notification for:', {
            subject: subjectName,
            title: title,
            file: file.name,
          });
          
          addNotification(
            subjectName, 
            title, 
            file.name, 
            new Date().toISOString()
          );
          
          console.log('✅ Notification added successfully!');
          // --- END OF NOTIFICATION ---

          const now = new Date();
          setUploadedFiles(prev => [{
            id: Date.now() + Math.random(),
            name: file.name,
            type: file.type.startsWith("image/") ? "image" : "pdf",
            subject: subjectName,
            uploadedBy: user?.username || "Current User",
            size: (file.size / 1024).toFixed(2),
            file: file,
            uploadDate: now.toLocaleDateString(),
            uploadTime: now.toLocaleTimeString(),
            fileSize: file.size,
          }, ...prev]);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    setUploading(false);
    fetchNotes();
    
    if (successCount > 0) {
      alert(`${successCount} of ${files.length} file(s) uploaded successfully!`);
    } else {
      alert("Upload failed. Please try again.");
    }
  };

  // --- DELETE NOTE WITH AUTH ---
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await authFetch(`${API_BASE}/notes/${noteId}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchNotes();
        alert("Note deleted successfully");
      } else {
        alert("Failed to delete note");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // --- UPLOAD HANDLERS ---
  const handleGalleryUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e) => {
      handleFileUpload(e, selectedSubject);
      setShowUploadOptions(false);
    };
    input.click();
  };

  const handleDriveUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.txt,.ppt,.pptx,image/*";
    input.multiple = true;
    input.onchange = (e) => {
      handleFileUpload(e, selectedSubject);
      setShowUploadOptions(false);
    };
    input.click();
  };

  // --- FILTER FUNCTIONS ---
  const getNotesBySubject = (subjectName) => {
    return notes.filter(note => note.subject_name === subjectName);
  };

  const getNotesByType = (type) => {
    return notes.filter(note => {
      const fileExt = note.file?.split('.').pop()?.toLowerCase();
      if (type === "image") {
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileExt);
      }
      if (type === "pdf") {
        return fileExt === 'pdf';
      }
      return false;
    });
  };

  // --- NAVIGATION ---
  const handleNavClick = (item) => {
    setActiveNavItem(item);
    if (item === "review") {
      setShowReviewAll(true);
      setShowSubjectFiles(false);
      setShowSearchResults(false);
      setShowAddSubject(false);
      setShowUploadOptions(false);
    } else if (item === "upload") {
      setShowUploadOptions(!showUploadOptions);
      setShowReviewAll(false);
      setShowSubjectFiles(false);
      setShowSearchResults(false);
      setShowAddSubject(false);
    } else if (item === "addsubject") {
      setShowAddSubject(!showAddSubject);
      setShowReviewAll(false);
      setShowSubjectFiles(false);
      setShowSearchResults(false);
      setShowUploadOptions(false);
    } else if (item === "home") {
      setShowReviewAll(false);
      setShowSubjectFiles(false);
      setShowSearchResults(false);
      setShowAddSubject(false);
      setShowUploadOptions(false);
      setSearchTerm("");
    }
  };

  // --- SEARCH ---
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setShowSearchResults(false);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const results = notes.filter(note =>
      note.title?.toLowerCase().includes(term) ||
      note.subject_name?.toLowerCase().includes(term)
    );

    setSearchResults(results);
    setShowSearchResults(results.length > 0);
    if (results.length === 0) {
      alert(`No files found for "${searchTerm}"`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubjectForView(subject);
    setShowSubjectFiles(true);
    setShowReviewAll(false);
    setShowSearchResults(false);
    setActiveNavItem("subjects");
  };

  const handleCloseSubjectView = () => {
    setShowSubjectFiles(false);
    setSelectedSubjectForView(null);
  };

  const getFileIcon = (type) => type === "image" ? "🖼️" : "📄";

  const formatFileSize = (size) => {
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  };

  // --- RENDER ---
  return (
    <div className="notes-page">
      <div className="notes-header">
        <h1>Study Notes</h1>
        <p>Browse, preview and download quality notes.</p>
        {user && <p className="welcome-user">👋 Welcome, {user.username}!</p>}
      </div>

      {/* Navigation Bar */}
      <nav className="notes-navbar">
        <div className="nav-container">
          <button 
            className={`nav-item ${activeNavItem === "home" ? "active" : ""}`}
            onClick={() => handleNavClick("home")}
          >
            🏠 Home
          </button>
          <button 
            className={`nav-item ${activeNavItem === "review" ? "active" : ""}`}
            onClick={() => handleNavClick("review")}
          >
            📖 Review All Notes ({notes.length})
          </button>
          <button 
            className={`nav-item ${activeNavItem === "upload" ? "active" : ""}`}
            onClick={() => handleNavClick("upload")}
          >
            📤 Upload Note
          </button>
          <button 
            className={`nav-item ${activeNavItem === "addsubject" ? "active" : ""}`}
            onClick={() => handleNavClick("addsubject")}
          >
            ➕ Add Subject
          </button>
        </div>
      </nav>

      {/* Add Subject Section */}
      {showAddSubject && (
        <div className="add-subject-section">
          <input
            type="text"
            placeholder="Enter subject name..."
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddSubject()}
          />
          <button onClick={handleAddSubject}>Create</button>
          <button onClick={() => setShowAddSubject(false)}>Cancel</button>
        </div>
      )}

      {/* Display Subjects */}
      {subjects.length > 0 && (
        <div className="subjects-list">
          <h3>📚 Subjects</h3>
          <div className="subjects-container">
            {subjects.map((subject) => {
              const fileCount = getNotesBySubject(subject.name).length;
              return (
                <div 
                  key={subject.id} 
                  className="subject-tag clickable"
                  onClick={() => handleSubjectClick(subject.name)}
                >
                  <span className="subject-name">{subject.name}</span>
                  <span className="file-count">({fileCount} notes)</span>
                  <button
                    className="subject-upload-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSubject(subject.name);
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = ".pdf,image/*";
                      input.multiple = true;
                      input.onchange = (e) => handleFileUpload(e, subject.name);
                      input.click();
                    }}
                  >
                    📤
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Options */}
      {showUploadOptions && (
        <div className="upload-options">
          <h3>Choose Upload Source</h3>
          <div className="upload-buttons">
            <button className="upload-option-btn" onClick={handleGalleryUpload}>
              🖼️ Choose from Gallery
            </button>
            <button className="upload-option-btn" onClick={handleDriveUpload}>
              ☁️ Choose from Drive
            </button>
            <button
              className="upload-option-btn cancel-btn"
              onClick={() => setShowUploadOptions(false)}
            >
              Cancel
            </button>
          </div>
          {uploading && <p>⏳ Uploading... Please wait.</p>}
        </div>
      )}

      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by subject or file name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearch}>🔍 Search</button>
        {searchTerm && (
          <button 
            className="clear-search-btn"
            onClick={() => {
              setSearchTerm("");
              setShowSearchResults(false);
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Results */}
      {showSearchResults && searchResults.length > 0 && (
        <div className="search-results-section">
          <div className="search-results-header">
            <h3>🔍 Search Results for "{searchTerm}"</h3>
            <span className="result-count">{searchResults.length} file(s) found</span>
          </div>
          <div className="recent-uploads-list">
            {searchResults.map((note) => (
              <div key={note.id} className="recent-file-item">
                <div className="file-icon-large">
                  {getFileIcon(note.file?.split('.').pop())}
                </div>
                <div className="file-details">
                  <div className="file-title">
                    <span className="file-name">{note.title}</span>
                    <span className="file-subject-badge">{note.subject_name}</span>
                  </div>
                  <div className="file-meta-info">
                    <span className="file-date">📅 {new Date(note.uploaded_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="file-actions">
                  <a
                    href={`http://127.0.0.1:8000${note.file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="preview-btn-small"
                  >
                    👁️ View
                  </a>
                  <button
                    className="delete-btn-small"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject Files View */}
      {showSubjectFiles && selectedSubjectForView && (
        <div className="review-all-section">
          <div className="review-header">
            <h2>📚 {selectedSubjectForView} - Uploaded Notes</h2>
            <button className="close-review-btn" onClick={handleCloseSubjectView}>
              ✕
            </button>
          </div>

          {getNotesBySubject(selectedSubjectForView).length === 0 ? (
            <div className="no-notes-message">
              <p>No notes uploaded for {selectedSubjectForView} yet.</p>
              <p>Click the 📤 button on the subject to upload notes.</p>
            </div>
          ) : (
            <div className="review-grid">
              {getNotesBySubject(selectedSubjectForView).map((note) => (
                <div key={note.id} className="review-item">
                  <div className="file-icon">📄</div>
                  <div className="file-info">
                    <p className="file-name">{note.title}</p>
                    <p className="file-meta">Subject: {note.subject_name}</p>
                    <p className="file-meta">
                      Uploaded: {new Date(note.uploaded_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="file-actions">
                    <a
                      href={`http://127.0.0.1:8000${note.file}`}
                      target="_blank"
                      rel="noreferrer"
                      className="preview-btn"
                    >
                      👁️ View
                    </a>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review All Notes Section */}
      {showReviewAll && !showSubjectFiles && !showSearchResults && (
        <div className="review-all-section">
          <div className="review-header">
            <h2>📚 All Notes ({notes.length})</h2>
            <button
              className="close-review-btn"
              onClick={() => {
                setShowReviewAll(false);
                setActiveNavItem("home");
              }}
            >
              ✕
            </button>
          </div>

          {notes.length === 0 ? (
            <div className="no-notes-message">
              <p>No notes uploaded yet. Start uploading your notes!</p>
            </div>
          ) : (
            <div className="review-grid">
              {notes.map((note) => (
                <div key={note.id} className="review-item">
                  <div className="file-icon">📄</div>
                  <div className="file-info">
                    <p className="file-name">{note.title}</p>
                    <p className="file-meta">Subject: {note.subject_name}</p>
                    <p className="file-meta">
                      Uploaded: {new Date(note.uploaded_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="file-actions">
                    <a
                      href={`http://127.0.0.1:8000${note.file}`}
                      target="_blank"
                      rel="noreferrer"
                      className="preview-btn"
                    >
                      👁️ View
                    </a>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Uploads - Home View */}
      {!showReviewAll && !showSubjectFiles && !showSearchResults && notes.length > 0 && (
        <div className="recent-uploads">
          <div className="recent-uploads-header">
            <h3>📂 Recent Uploads</h3>
            <span className="upload-count">{notes.length} notes</span>
          </div>
          <div className="recent-uploads-list">
            {notes.slice(0, 10).map((note) => (
              <div key={note.id} className="recent-file-item">
                <div className="file-icon-large">📄</div>
                <div className="file-details">
                  <div className="file-title">
                    <span className="file-name">{note.title}</span>
                    <span className="file-subject-badge">{note.subject_name}</span>
                  </div>
                  <div className="file-meta-info">
                    <span className="file-date">📅 {new Date(note.uploaded_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="file-actions">
                  <a
                    href={`http://127.0.0.1:8000${note.file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="preview-btn-small"
                  >
                    👁️ View
                  </a>
                  <button
                    className="delete-btn-small"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
          {notes.length > 10 && (
            <div className="view-more">
              <button onClick={() => handleNavClick("review")}>
                View all {notes.length} notes →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!showReviewAll && !showSubjectFiles && !showSearchResults && notes.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-content">
            <span className="empty-icon">📚</span>
            <h3>No Notes Yet</h3>
            <p>Start by adding a subject and uploading your notes!</p>
            <div className="empty-actions">
              <button onClick={() => handleNavClick("addsubject")}>
                ➕ Add Subject
              </button>
              <button onClick={() => handleNavClick("upload")}>
                📤 Upload Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}

export default Notes;