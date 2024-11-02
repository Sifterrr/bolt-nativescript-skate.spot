import db from '../schema.js';
import { z } from 'zod';

const reviewSchema = z.object({
  user_id: z.string(),
  skatepark_id: z.string(),
  rating: z.number().min(1).max(5),
  content: z.string().optional()
});

export class Review {
  static create(reviewData) {
    const validated = reviewSchema.parse(reviewData);
    const id = crypto.randomUUID();
    
    const stmt = db.prepare(`
      INSERT INTO reviews (id, user_id, skatepark_id, rating, content)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      validated.user_id,
      validated.skatepark_id,
      validated.rating,
      validated.content
    );
    
    return this.findById(id);
  }
  
  static findById(id) {
    return db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  }
  
  static findBySkatepark(skateparkId, { limit = 20, offset = 0 } = {}) {
    return db.prepare(`
      SELECT r.*, u.username, u.avatar_url
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.skatepark_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `).all(skateparkId, limit, offset);
  }
  
  static getAverageRating(skateparkId) {
    return db.prepare(`
      SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews
      FROM reviews
      WHERE skatepark_id = ?
    `).get(skateparkId);
  }
  
  static update(id, userId, updates) {
    const validKeys = ['rating', 'content'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => validKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});
    
    if (Object.keys(filteredUpdates).length === 0) return null;
    
    const setClauses = Object.keys(filteredUpdates)
      .map(key => `${key} = @${key}`)
      .join(', ');
    
    const stmt = db.prepare(`
      UPDATE reviews
      SET ${setClauses}, updated_at = CURRENT_TIMESTAMP
      WHERE id = @id AND user_id = @userId
    `);
    
    stmt.run({ ...filteredUpdates, id, userId });
    return this.findById(id);
  }
  
  static delete(id, userId) {
    return db.prepare('DELETE FROM reviews WHERE id = ? AND user_id = ?').run(id, userId);
  }
}