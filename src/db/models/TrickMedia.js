import db from '../schema.js';
import { z } from 'zod';

const mediaSchema = z.object({
  trick_id: z.string(),
  user_id: z.string(),
  type: z.enum(['image', 'video']),
  url: z.string().url(),
  thumbnail_url: z.string().url().optional(),
  duration: z.number().optional() // for videos, in seconds
});

export class TrickMedia {
  static create(mediaData) {
    const validated = mediaSchema.parse(mediaData);
    const id = crypto.randomUUID();
    
    const stmt = db.prepare(`
      INSERT INTO trick_media (
        id, trick_id, user_id, type,
        url, thumbnail_url, duration
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      validated.trick_id,
      validated.user_id,
      validated.type,
      validated.url,
      validated.thumbnail_url,
      validated.duration
    );
    
    return this.findById(id);
  }
  
  static findById(id) {
    return db.prepare('SELECT * FROM trick_media WHERE id = ?').get(id);
  }
  
  static findByTrick(trickId) {
    return db.prepare(`
      SELECT * FROM trick_media
      WHERE trick_id = ?
      ORDER BY created_at DESC
    `).all(trickId);
  }
  
  static findByUser(userId, { type, limit = 20, offset = 0 } = {}) {
    let query = 'SELECT * FROM trick_media WHERE user_id = ?';
    const params = [userId];
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    return db.prepare(query).all(...params);
  }
  
  static delete(id, userId) {
    return db.prepare(
      'DELETE FROM trick_media WHERE id = ? AND user_id = ?'
    ).run(id, userId);
  }
}