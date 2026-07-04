import { useState, useEffect, useRef } from "react";
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
  // Load data from localStorage on initial render
  const loadFromStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return defaultValue;
  };

  const [notes, setNotes] = useState([]);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [subjects, setSubjects] = useState(() => loadFromStorage('subjects', []));
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [showReviewAll, setShowReviewAll] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(() => {
    const stored = loadFromStorage('uploadedFiles', []);
    // We need to handle File objects specially since they can't be stored in localStorage
    // For files, we'll store metadata and recreate file objects
    return stored.map(file => ({
      ...file,
      // File objects are not stored, we need to handle this
      // For actual file data, we'd need to use IndexedDB or a different approach
      // For now, we'll keep the metadata
    }));
  });
  const [previewFile, setPreviewFile] = useState(null);
  const [selectedSubjectForView, setSelectedSubjectForView] = useState(null);
  const [showSubjectFiles, setShowSubjectFiles] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(() => loadFromStorage('activeNavItem', 'home'));
  const fileInputRef = useRef(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      // Store subjects
      localStorage.setItem('subjects', JSON.stringify(subjects));
      
      // Store uploaded files metadata (without actual File objects)
      const filesToStore = uploadedFiles.map(file => {
        // Remove the actual File object from storage
        const { file: fileObj, ...fileData } = file;
        return fileData;
      });
      localStorage.setItem('uploadedFiles', JSON.stringify(filesToStore));
      
      // Store active nav item
      localStorage.setItem('activeNavItem', JSON.stringify(activeNavItem));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [subjects, uploadedFiles, activeNavItem]);

  // Restore file objects from stored data (for uploaded files)
  const restoreFiles = () => {
    const stored = loadFromStorage('uploadedFiles', []);
    // Since we can't store actual File objects, we'll keep them as metadata
    // The actual file data would need a different storage solution
    setUploadedFiles(stored);
  };

  // Call restore on mount
  useEffect(() => {
    restoreFiles();
  }, []);

  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  const handleDownload = (title) => {
    alert(`Downloading "${title}"`);
  };

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      const updatedSubjects = [...subjects, newSubject.trim()];
      setSubjects(updatedSubjects);
      setNewSubject("");
      setShowAddSubject(false);
    }
  };

  const handleFileUpload = (event, subject) => {
    const files = Array.from(event.target.files);
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : "pdf",
      subject: subject || "Uncategorized",
      uploadedBy: "Current User",
      size: (file.size / 1024).toFixed(2),
      file: file, // Keep the actual file object for preview
      uploadDate: dateString,
      uploadTime: timeString,
      fileSize: file.size,
    }));
    
    const updatedFiles = [...newFiles, ...uploadedFiles];
    setUploadedFiles(updatedFiles);
    
    // Store only metadata without File objects
    const filesToStore = updatedFiles.map(f => {
      const { file: fileObj, ...fileData } = f;
      return fileData;
    });
    localStorage.setItem('uploadedFiles', JSON.stringify(filesToStore));
    
    alert(`${files.length} file(s) uploaded successfully to "${subject}"!`);
  };

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

  const getFilesByType = (type) => {
    return uploadedFiles.filter((file) => file.type === type);
  };

  const getFilesBySubject = (subject) => {
    return uploadedFiles.filter((file) => file.subject === subject);
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

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setShowSearchResults(false);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    
    // Search by subject
    const subjectResults = uploadedFiles.filter(file => 
      file.subject.toLowerCase().includes(term)
    );

    // Search by file name
    const fileResults = uploadedFiles.filter(file => 
      file.name.toLowerCase().includes(term)
    );

    // Combine results (remove duplicates)
    const combined = [...subjectResults, ...fileResults];
    const uniqueResults = combined.filter((file, index, self) => 
      index === self.findIndex(f => f.id === file.id)
    );

    if (uniqueResults.length > 0) {
      setSearchResults(uniqueResults);
      setShowSearchResults(true);
      setShowReviewAll(false);
      setShowSubjectFiles(false);
      setActiveNavItem("search");
    } else {
      alert(`No files found for "${searchTerm}"`);
      setShowSearchResults(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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

  const getFileIcon = (type) => {
    return type === "image" ? "🖼️" : "📄";
  };

  const formatFileSize = (size) => {
    if (size < 1024) {
      return size + " B";
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + " KB";
    } else {
      return (size / (1024 * 1024)).toFixed(2) + " MB";
    }
  };

  return (
    <div className="notes-page">
      <div className="notes-header">
        <h1>Study Notes</h1>
        <p>Browse, preview and download quality notes.</p>
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
            📖 Review All Notes
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
            {subjects.map((subject, index) => {
              const fileCount = getFilesBySubject(subject).length;
              return (
                <div 
                  key={index} 
                  className="subject-tag clickable"
                  onClick={() => handleSubjectClick(subject)}
                >
                  <span className="subject-name">{subject}</span>
                  <span className="file-count">({fileCount} files)</span>
                  <button
                    className="subject-upload-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSubject(subject);
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = ".pdf,image/*";
                      input.multiple = true;
                      input.onchange = (e) => handleFileUpload(e, subject);
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
            {searchResults.map((file) => (
              <div key={file.id} className="recent-file-item">
                <div className="file-icon-large">
                  {file.type === "image" ? "🖼️" : "📄"}
                </div>
                <div className="file-details">
                  <div className="file-title">
                    <span className="file-name">{file.name}</span>
                    <span className="file-subject-badge">{file.subject}</span>
                  </div>
                  <div className="file-meta-info">
                    <span className="file-size">📊 {formatFileSize(file.fileSize)}</span>
                    <span className="file-time">🕐 {file.uploadTime}</span>
                    <span className="file-date">📅 {file.uploadDate}</span>
                    <span className="file-uploader">👤 {file.uploadedBy}</span>
                  </div>
                </div>
                <div className="file-actions">
                  <button
                    className="preview-btn-small"
                    onClick={() => handlePreview(file)}
                  >
                    👁️ Preview
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
            <h2>📚 {selectedSubjectForView} - Uploaded Files</h2>
            <button
              className="close-review-btn"
              onClick={handleCloseSubjectView}
            >
              ✕
            </button>
          </div>

          {getFilesBySubject(selectedSubjectForView).length === 0 ? (
            <div className="no-notes-message">
              <p>No files uploaded for {selectedSubjectForView} yet.</p>
              <p>Click the 📤 button on the subject to upload files.</p>
            </div>
          ) : (
            <>
              {/* PDF Files for this subject */}
              {getFilesBySubject(selectedSubjectForView).filter(f => f.type === "pdf").length > 0 && (
                <div className="review-category">
                  <h3>📄 PDF Files</h3>
                  <div className="review-grid">
                    {getFilesBySubject(selectedSubjectForView)
                      .filter(f => f.type === "pdf")
                      .map((file) => (
                        <div key={file.id} className="review-item">
                          <div className="file-icon">📄</div>
                          <div className="file-info">
                            <p className="file-name">{file.name}</p>
                            <p className="file-meta">
                              Size: {file.size} KB
                            </p>
                            <p className="file-meta">
                              Uploaded by: {file.uploadedBy} | {file.uploadDate}
                            </p>
                          </div>
                          <button
                            className="preview-btn"
                            onClick={() => handlePreview(file)}
                          >
                            Preview
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Images for this subject */}
              {getFilesBySubject(selectedSubjectForView).filter(f => f.type === "image").length > 0 && (
                <div className="review-category">
                  <h3>🖼️ Images</h3>
                  <div className="review-grid images-grid">
                    {getFilesBySubject(selectedSubjectForView)
                      .filter(f => f.type === "image")
                      .map((file) => (
                        <div key={file.id} className="review-item image-item">
                          <div className="image-preview">
                            {file.file ? (
                              <img
                                src={URL.createObjectURL(file.file)}
                                alt={file.name}
                              />
                            ) : (
                              <div className="placeholder-image">No preview available</div>
                            )}
                          </div>
                          <div className="file-info">
                            <p className="file-name">{file.name}</p>
                            <p className="file-meta">
                              Size: {file.size} KB
                            </p>
                            <p className="file-meta">
                              Uploaded by: {file.uploadedBy} | {file.uploadDate}
                            </p>
                          </div>
                          <button
                            className="preview-btn"
                            onClick={() => handlePreview(file)}
                          >
                            Preview
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Review All Notes Section */}
      {showReviewAll && !showSubjectFiles && !showSearchResults && (
        <div className="review-all-section">
          <div className="review-header">
            <h2>📚 All Notes</h2>
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

          {/* PDF Notes */}
          {getFilesByType("pdf").length > 0 && (
            <div className="review-category">
              <h3>📄 PDF Notes</h3>
              <div className="review-grid">
                {getFilesByType("pdf").map((file) => (
                  <div key={file.id} className="review-item">
                    <div className="file-icon">📄</div>
                    <div className="file-info">
                      <p className="file-name">{file.name}</p>
                      <p className="file-meta">
                        Subject: {file.subject} | Size: {file.size} KB
                      </p>
                      <p className="file-meta">
                        Uploaded by: {file.uploadedBy} | {file.uploadDate}
                      </p>
                    </div>
                    <button
                      className="preview-btn"
                      onClick={() => handlePreview(file)}
                    >
                      Preview
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Notes */}
          {getFilesByType("image").length > 0 && (
            <div className="review-category">
              <h3>🖼️ Images</h3>
              <div className="review-grid images-grid">
                {getFilesByType("image").map((file) => (
                  <div key={file.id} className="review-item image-item">
                    <div className="image-preview">
                      {file.file ? (
                        <img
                          src={URL.createObjectURL(file.file)}
                          alt={file.name}
                        />
                      ) : (
                        <div className="placeholder-image">No preview available</div>
                      )}
                    </div>
                    <div className="file-info">
                      <p className="file-name">{file.name}</p>
                      <p className="file-meta">
                        Subject: {file.subject} | Size: {file.size} KB
                      </p>
                      <p className="file-meta">
                        Uploaded by: {file.uploadedBy} | {file.uploadDate}
                      </p>
                    </div>
                    <button
                      className="preview-btn"
                      onClick={() => handlePreview(file)}
                    >
                      Preview
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadedFiles.length === 0 && (
            <div className="no-notes-message">
              <p>No uploaded notes found. Start uploading your notes!</p>
            </div>
          )}
        </div>
      )}

      {/* Recent Uploads - Home View */}
      {!showReviewAll && !showSubjectFiles && !showSearchResults && uploadedFiles.length > 0 && (
        <div className="recent-uploads">
          <div className="recent-uploads-header">
            <h3>📂 Recent Uploads</h3>
            <span className="upload-count">{uploadedFiles.length} files</span>
          </div>
          <div className="recent-uploads-list">
            {uploadedFiles.slice(0, 10).map((file) => (
              <div key={file.id} className="recent-file-item">
                <div className="file-icon-large">
                  {file.type === "image" ? "🖼️" : "📄"}
                </div>
                <div className="file-details">
                  <div className="file-title">
                    <span className="file-name">{file.name}</span>
                    <span className="file-subject-badge">{file.subject}</span>
                  </div>
                  <div className="file-meta-info">
                    <span className="file-size">📊 {formatFileSize(file.fileSize)}</span>
                    <span className="file-time">🕐 {file.uploadTime}</span>
                    <span className="file-date">📅 {file.uploadDate}</span>
                    <span className="file-uploader">👤 {file.uploadedBy}</span>
                  </div>
                </div>
                <div className="file-actions">
                  <button
                    className="preview-btn-small"
                    onClick={() => handlePreview(file)}
                  >
                    👁️ Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
          {uploadedFiles.length > 10 && (
            <div className="view-more">
              <button onClick={() => handleNavClick("review")}>
                View all {uploadedFiles.length} files →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!showReviewAll && !showSubjectFiles && !showSearchResults && uploadedFiles.length === 0 && (
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