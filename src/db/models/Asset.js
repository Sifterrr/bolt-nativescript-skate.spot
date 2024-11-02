import db from '../schema.js';
import { z } from 'zod';

const assetSchema = z.object({
  user_id: z.string(),
  type: z.enum(['image', 'video', 'other']),
  url: z.string().url(),
  thumbnail_url: z.string().url().optional(),
  mime_type: z.string(),
  size: z.number(),
  metadata: z.record(z.unknown()).optional()
});

export class Asset {
  static create(assetData) {
    const validated = assetSchema.parse(assetData);
    const id = crypto.randomUUID();
    
    const stmt = db.prepare(`
      INSERT INTO assets (
        id, user_id, type, url, thumbnail_url,
        mime_type, size, metadata
      )
      VALUES (
        @id, @user_id, @type, @url, @thumbnail_url,
        @mime_type, @size, @metadata
      )
    `);
    
    stmt.run({
      ...validated,
      id,
      metadata: JSON.stringify(validated.metadata || {})
    });
    
    return this.findById(id);
  }
  
  static findById(id) {
    const asset = db.prepare('SELECT * FROM assets WHERE id = ?').get(id);
    if (asset) {
      asset.metadata = JSON.parse(asset.metadata || '{}');
    }
    return asset;
  }
  
  static findByUser(userId, { type, limit = 20, offset = 0 } = {}) {
    let query = 'SELECT * FROM assets WHERE user_id = ?';
    const params = [userId];
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const assets = db.prepare(query).all(...params);
    return assets.map(asset => ({
      ...asset,
      metadata: JSON.parse(asset.metadata || '{}')
    }));
  }
  
  static update(id, userId, updates) {
    const validKeys = ['thumbnail_url', 'metadata'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => validKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});
    
    if (Object.keys(filteredUpdates).length === 0) return null;
    
    if (filteredUpdates.metadata) {
      filteredUpdates.metadata = JSON.stringify(filteredUpdates.metadata);
    }
    
    const setClauses = Object.keys(filteredUpdates)
      .map(key => `${key} = @${key}`)
      .join(', ');
    
    const stmt = db.prepare(`
      UPDATE assets
      SET ${setClauses}
      WHERE id = @id AND user_id = @userId
    `);
    
    stmt.run({ ...filteredUpdates, id, userId });
    return this.findById(id);
  }
  
  static delete(id, userId) {
    return db.prepare('DELETE FROM assets WHERE id = ? AND user_id = ?').run(id, userId);
  }
}