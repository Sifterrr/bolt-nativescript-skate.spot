import db from '../schema.js';
import { z } from 'zod';

const skateparkSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string().default('USA'),
  latitude: z.number(),
  longitude: z.number(),
  features: z.array(z.string()).optional(),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced', 'all-levels']),
  hours_of_operation: z.string().optional(),
  is_free: z.boolean().default(true)
});

export class Skatepark {
  static create(parkData) {
    const validated = skateparkSchema.parse(parkData);
    const id = crypto.randomUUID();
    
    const stmt = db.prepare(`
      INSERT INTO skateparks (
        id, name, description, address, city, state, country,
        latitude, longitude, features, difficulty_level,
        hours_of_operation, is_free
      )
      VALUES (
        @id, @name, @description, @address, @city, @state, @country,
        @latitude, @longitude, @features, @difficulty_level,
        @hours_of_operation, @is_free
      )
    `);
    
    stmt.run({
      ...validated,
      id,
      features: JSON.stringify(validated.features || [])
    });
    
    return this.findById(id);
  }
  
  static findById(id) {
    const park = db.prepare('SELECT * FROM skateparks WHERE id = ?').get(id);
    if (park) {
      park.features = JSON.parse(park.features || '[]');
    }
    return park;
  }
  
  static findAll({ limit = 20, offset = 0, city, state, difficulty_level } = {}) {
    let query = 'SELECT * FROM skateparks WHERE 1=1';
    const params = [];
    
    if (city) {
      query += ' AND city = ?';
      params.push(city);
    }
    
    if (state) {
      query += ' AND state = ?';
      params.push(state);
    }
    
    if (difficulty_level) {
      query += ' AND difficulty_level = ?';
      params.push(difficulty_level);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const parks = db.prepare(query).all(...params);
    return parks.map(park => ({
      ...park,
      features: JSON.parse(park.features || '[]')
    }));
  }
  
  static update(id, updates) {
    const validKeys = [
      'name', 'description', 'address', 'city', 'state',
      'features', 'difficulty_level', 'hours_of_operation', 'is_free'
    ];
    
    const filteredUpdates = Object.keys(updates)
      .filter(key => validKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});
    
    if (Object.keys(filteredUpdates).length === 0) return null;
    
    if (filteredUpdates.features) {
      filteredUpdates.features = JSON.stringify(filteredUpdates.features);
    }
    
    const setClauses = Object.keys(filteredUpdates)
      .map(key => `${key} = @${key}`)
      .join(', ');
    
    const stmt = db.prepare(`
      UPDATE skateparks
      SET ${setClauses}, updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `);
    
    stmt.run({ ...filteredUpdates, id });
    return this.findById(id);
  }
  
  static delete(id) {
    return db.prepare('DELETE FROM skateparks WHERE id = ?').run(id);
  }
  
  static addImage(skateparkId, { url, caption, isPrimary = false }) {
    const id = crypto.randomUUID();
    
    // If this is a primary image, unset any existing primary images
    if (isPrimary) {
      db.prepare(`
        UPDATE skatepark_images
        SET is_primary = 0
        WHERE skatepark_id = ?
      `).run(skateparkId);
    }
    
    const stmt = db.prepare(`
      INSERT INTO skatepark_images (id, skatepark_id, url, caption, is_primary)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    return stmt.run(id, skateparkId, url, caption, isPrimary);
  }
  
  static getImages(skateparkId) {
    return db.prepare(`
      SELECT * FROM skatepark_images
      WHERE skatepark_id = ?
      ORDER BY is_primary DESC, created_at DESC
    `).all(skateparkId);
  }
  
  static addStreetView(skateparkId, { panoId, heading, pitch, zoom }) {
    const id = crypto.randomUUID();
    
    const stmt = db.prepare(`
      INSERT INTO street_views (id, skatepark_id, pano_id, heading, pitch, zoom)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    return stmt.run(id, skateparkId, panoId, heading, pitch, zoom);
  }
  
  static getStreetView(skateparkId) {
    return db.prepare(`
      SELECT * FROM street_views
      WHERE skatepark_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `).get(skateparkId);
  }
}