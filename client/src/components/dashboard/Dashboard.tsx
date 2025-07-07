import React, { useState, useEffect } from 'react';
import { Search, Plus, LogOut, Archive, Edit, Trash2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { noteService, Note } from '../../services/api';
import NoteModal from './NoteModal';

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, [showArchived, searchTerm, categoryFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await noteService.getNotes(showArchived, searchTerm, categoryFilter);
      setNotes(fetchedNotes);
    } catch (error: any) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowModal(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowModal(true);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('👋 Logged out successfully!');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) return;
    
    try {
      await noteService.deleteNote(noteId);
      toast.success('🗑️ Note deleted successfully');
      fetchNotes();
    } catch (error: any) {
      toast.error('Failed to delete note');
    }
  };

  const handleArchiveNote = async (note: Note) => {
    try {
      await noteService.updateNote(note.id, { is_archived: !note.is_archived });
      toast.success(note.is_archived ? '📂 Note unarchived' : '📁 Note archived');
      fetchNotes();
    } catch (error: any) {
      toast.error('Failed to update note');
    }
  };

  const handleModalSave = () => {
    setShowModal(false);
    setEditingNote(null);
    fetchNotes();
  };

  const filteredNotes = notes.filter((note: Note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || note.category === categoryFilter;
    const matchesArchived = note.is_archived === showArchived;
    
    return matchesSearch && matchesCategory && matchesArchived;
  });

  const categories = [...new Set(notes.map((note: Note) => note.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="container">
          <nav className="dashboard-nav">
            <h1 className="dashboard-title">My Notes</h1>
            <div className="user-menu">
              <div className="user-info">
                <span>Welcome, {user?.name}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-ghost">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-controls">
            <div className="search-container">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-controls">
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <button 
                onClick={() => setShowArchived(!showArchived)}
                className={`btn ${showArchived ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Archive size={16} />
                {showArchived ? 'Active Notes' : 'Archived Notes'}
              </button>
              
              <button onClick={handleCreateNote} className="btn btn-primary">
                <Plus size={16} />
                New Note
              </button>
            </div>
          </div>

          <div className="notes-grid">
            {filteredNotes.length === 0 ? (
              <div className="empty-state">
                <FileText size={64} />
                <h3>No notes found</h3>
                <p>
                  {searchTerm || categoryFilter 
                    ? 'Try adjusting your search or filters.' 
                    : showArchived 
                      ? 'No archived notes yet.' 
                      : 'Create your first note to get started!'
                  }
                </p>
                {!searchTerm && !categoryFilter && !showArchived && (
                  <button onClick={handleCreateNote} className="btn btn-primary">
                    <Plus size={16} />
                    Create Note
                  </button>
                )}
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div key={note.id} className="note-card">
                  <div className="note-header">
                    <h3 className="note-title">{note.title}</h3>
                    <div className="note-actions">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="btn btn-icon"
                        title="Edit note"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleArchiveNote(note)}
                        className="btn btn-icon"
                        title={note.is_archived ? "Unarchive note" : "Archive note"}
                      >
                        <Archive size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="btn btn-icon btn-danger"
                        title="Delete note"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="note-content">
                    <p>{note.content}</p>
                  </div>
                  
                  <div className="note-footer">
                    {note.category && (
                      <span className="note-category">{note.category}</span>
                    )}
                    <span className="note-date">
                      {new Date(note.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {showModal && (
        <NoteModal
          note={editingNote}
          onClose={() => setShowModal(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default Dashboard;
