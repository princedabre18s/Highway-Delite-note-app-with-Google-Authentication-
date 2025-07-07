import express, { Response } from 'express';
import Joi from 'joi';
import pool from '../config/database';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { sendNoteSavedEmail, sendNoteDeletedEmail } from '../utils/email';

const router = express.Router();

// Validation schemas
const noteSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  content: Joi.string().allow(''),
  category: Joi.string().max(100).allow(''),
});

const updateNoteSchema = Joi.object({
  title: Joi.string().min(1).max(255),
  content: Joi.string().allow(''),
  category: Joi.string().max(100).allow(''),
  is_archived: Joi.boolean(),
});

// Get all notes for authenticated user
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { archived = 'false', search = '', category = '' } = req.query;
    const isArchived = archived === 'true';
    
    let query = `
      SELECT id, title, content, category, is_archived, created_at, updated_at 
      FROM notes 
      WHERE user_id = $1 AND is_archived = $2
    `;
    const params: any[] = [req.user!.id, isArchived];

    // Add search filter
    if (search) {
      query += ` AND (title ILIKE $${params.length + 1} OR content ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    // Add category filter
    if (category) {
      query += ` AND category = $${params.length + 1}`;
      params.push(category);
    }

    query += ' ORDER BY updated_at DESC';

    const client = await pool.connect();
    const result = await client.query(query, params);
    client.release();

    res.json({
      success: true,
      notes: result.rows,
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single note
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const noteId = parseInt(req.params.id);
    
    const client = await pool.connect();
    const result = await client.query(
      'SELECT id, title, content, category, is_archived, created_at, updated_at FROM notes WHERE id = $1 AND user_id = $2',
      [noteId, req.user!.id]
    );
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({
      success: true,
      note: result.rows[0],
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create note
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { error } = noteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, content = '', category = '' } = req.body;

    const client = await pool.connect();
    
    // Get user details for email
    const userResult = await client.query(
      'SELECT name, email FROM users WHERE id = $1',
      [req.user!.id]
    );
    const user = userResult.rows[0];

    const result = await client.query(
      'INSERT INTO notes (user_id, title, content, category) VALUES ($1, $2, $3, $4) RETURNING id, title, content, category, is_archived, created_at, updated_at',
      [req.user!.id, title, content, category]
    );
    client.release();

    // Send email notification for new note (async, don't block response)
    try {
      await sendNoteSavedEmail(user.email, user.name, title, true);
    } catch (emailError) {
      console.error('Failed to send note creation email:', emailError);
    }

    res.status(201).json({
      success: true,
      note: result.rows[0],
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update note
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { error } = updateNoteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const noteId = parseInt(req.params.id);
    const updates = req.body;

    // Build dynamic query
    const setClause = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (setClause.length === 0) {
      return res.status(400).json({ message: 'No valid updates provided' });
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(noteId, req.user!.id);

    const query = `
      UPDATE notes 
      SET ${setClause.join(', ')} 
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING id, title, content, category, is_archived, created_at, updated_at
    `;

    const client = await pool.connect();
    
    // Get user details for email
    const userResult = await client.query(
      'SELECT name, email FROM users WHERE id = $1',
      [req.user!.id]
    );
    const user = userResult.rows[0];

    const result = await client.query(query, values);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Send email notification for note update (async, don't block response)
    try {
      await sendNoteSavedEmail(user.email, user.name, result.rows[0].title, false);
    } catch (emailError) {
      console.error('Failed to send note update email:', emailError);
    }

    res.json({
      success: true,
      note: result.rows[0],
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete note
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const noteId = parseInt(req.params.id);

    const client = await pool.connect();
    
    // Get note title and user details before deletion
    const noteResult = await client.query(
      'SELECT title FROM notes WHERE id = $1 AND user_id = $2',
      [noteId, req.user!.id]
    );

    if (noteResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: 'Note not found' });
    }

    const noteTitle = noteResult.rows[0].title;

    // Get user details for email
    const userResult = await client.query(
      'SELECT name, email FROM users WHERE id = $1',
      [req.user!.id]
    );
    const user = userResult.rows[0];

    // Delete the note
    await client.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2',
      [noteId, req.user!.id]
    );
    client.release();

    // Send email notification for note deletion (async, don't block response)
    try {
      await sendNoteDeletedEmail(user.email, user.name, noteTitle);
    } catch (emailError) {
      console.error('Failed to send note deletion email:', emailError);
    }

    res.json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
