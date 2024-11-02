import db from '../schema.js';
import { z } from 'zod';

const imageSchema = z.object({
  skatepark_id: z.string(),
  url: z.string().url(),
  thumbnail_url: z.string().url().optional(),
  caption: z.string().optional(),
  category: z.enum(['overview', 'feature', 'aerial', 'indoor', 'street-view']),
  is_primary: z.boolean().default(false)
});

export class SkateparkImage {
  static create(imageData) {
    const validated = imageSchema.parse(imageData);
    const id = crypto.randomUUID();
    
    // If this is a primary image, unset any existing primary images
    if (validated.is_primary) {
      db.prepare(`
        UPDATE skatepark_images
        SET is_primary = 0
        WHERE skatepark_id = ?
      `).run(validated.skatepark_id);
    }
    
    const stmt = db.prepare(`
      INSERT INTO skatepark_images (
        id, skatepark_id, url, thumbnail_url,
        caption, category, is_primary
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      validated.skatepark_id,
      validated.url,
      validated.thumbnail_url,
      validated.caption,
      validated.category,
      validated.is_primary
    );
    
    return this.findById(id);
  }
  
  static findById(id) {
    return db.prepare('SELECT * FROM skatepark_images WHERE id = ?').get(id);
  }
  
  static findBySkatepark(skateparkId, { category } = {}) {
    let query = 'SELECT * FROM skatepark_images WHERE skatepark_id = ?';
    const params = [skateparkId];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY is_primary DESC, created_at DESC';
    
    return db.prepare(query).all(...params);
  }
  
  static update(id, updates) {
    const validKeys = ['caption', 'category', 'is_primary'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => validKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});
    
    if (Object.keys(filteredUpdates).length === 0) return null;
    
    // Handle primary image status
    if (filteredUpdates.is_primary) {
      const image = this.findById(id);
      if (image) {
        db.prepare(`
          UPDATE skatepark_images
          SET is_primary = 0
          WHERE skatepark_id = ?
        `).run(image.skatepark_id);
      }
    }
    
    const setClauses = Object.keys(filteredUpdates)
      .map(key => `${key} = @${key}`)
      .join(', ');
    
    const stmt = db.prepare(`
      UPDATE skatepark_images
      SET ${setClauses}
      WHERE id = @id
    `);
    
    stmt.run({ ...filteredUpdates, id });
    return this.findById(id);
  }
  
  static delete(id) {
    return db.prepare('DELETE FROM skatepark_images WHERE id = ?').run(id);
  }
}