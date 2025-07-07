import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { noteService, Note, CreateNoteData, UpdateNoteData } from '../../services/api';

interface NoteModalProps {
  note?: Note | null;
  onClose: () => void;
  onSave?: () => void;
}

interface NoteFormData {
  title: string;
  content: string;
  category: string;
}

const NoteModal: React.FC<NoteModalProps> = ({ note, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NoteFormData>();

  useEffect(() => {
    if (note) {
      reset({
        title: note.title,
        content: note.content,
        category: note.category,
      });
    } else {
      reset({
        title: '',
        content: '',
        category: '',
      });
    }
  }, [note, reset]);

  const onSubmit = async (data: NoteFormData) => {
    setLoading(true);
    try {
      if (note) {
        // Update existing note
        const updateData: UpdateNoteData = {
          title: data.title,
          content: data.content,
          category: data.category || '',
        };
        await noteService.updateNote(note.id, updateData);
        toast.success('📝 Note updated successfully');
      } else {
        // Create new note
        const createData: CreateNoteData = {
          title: data.title,
          content: data.content,
          category: data.category || '',
        };
        await noteService.createNote(createData);
        toast.success('✨ Note created successfully');
      }
      
      // Call onSave if provided to refresh the parent component
      if (onSave) {
        onSave();
      }
      
      onClose();
    } catch (error: any) {
      toast.error(note ? 'Failed to update note' : 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{note ? 'Edit Note' : 'Create New Note'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                {...register('title', {
                  required: 'Title is required',
                  maxLength: {
                    value: 255,
                    message: 'Title cannot exceed 255 characters'
                  }
                })}
                placeholder="Enter note title"
                autoFocus
              />
              {errors.title && <div className="error">{errors.title.message}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Category (Optional)</label>
              <input
                type="text"
                className="form-input"
                {...register('category', {
                  maxLength: {
                    value: 100,
                    message: 'Category cannot exceed 100 characters'
                  }
                })}
                placeholder="Enter category (e.g., Work, Personal, Ideas)"
              />
              {errors.category && <div className="error">{errors.category.message}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="form-textarea"
                {...register('content')}
                placeholder="Write your note content here..."
                rows={10}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              {loading ? 'Saving...' : note ? 'Update Note' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
