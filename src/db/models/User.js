import db from '../schema.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().optional(),
  bio: z.string().optional(),
  stance: z.enum(['regular', 'goofy']).optional(),
  experience_level: z.enum(['beginner', 'intermediate', 'advanced', 'pro']).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

export class User {
  static async create(userData) {
    const validated = userSchema.parse(userData);
    
    const password_hash = await bcrypt.hash(validated.password, 10);
    const id = crypto.randomUUID();
    
    const stmt = db.prepare(`
      INSERT INTO users (
        id, username, email, password_hash, full_name, bio,
        stance, experience_level, latitude, longitude
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      validated.username,
      validated.email,
      password_hash,
      validated.full_name,
      validated.bio,
      validated.stance,
      validated.experience_level,
      validated.latitude,
      validated.longitude
    );
    
    return this.findById(id);
  }

  static findNearby(latitude, longitude, radiusMiles, { limit = 20, offset = 0 } = {}) {
    // Convert miles to degrees (approximate, varies by latitude)
    // 1 degree of latitude = ~69 miles
    // 1 degree of longitude = ~69 miles * cos(latitude)
    const latDegrees = radiusMiles / 69;
    const lonDegrees = radiusMiles / (69 * Math.cos(latitude * Math.PI / 180));

    return db.prepare(`
      SELECT 
        id, username, avatar_url, experience_level,
        latitude, longitude,
        (
          69 * SQRT(
            POW(latitude - ?, 2) + 
            POW((longitude - ?) * COS(? * 0.0174533), 2)
          )
        ) as distance_miles
      FROM users
      WHERE 
        latitude BETWEEN ? AND ?
        AND longitude BETWEEN ? AND ?
        AND last_location_update >= datetime('now', '-24 hours')
      ORDER BY distance_miles
      LIMIT ? OFFSET ?
    `).all(
      latitude,
      longitude,
      latitude,
      latitude - latDegrees,
      latitude + latDegrees,
      longitude - lonDegrees,
      longitude + lonDegrees,
      limit,
      offset
    );
  }

  static updateLocation(id, latitude, longitude) {
    return db.prepare(`
      UPDATE users
      SET 
        latitude = ?,
        longitude = ?,
        last_location_update = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(latitude, longitude, id);
  }
  
  static findById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }
  
  static findByUsername(username) {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  }
  
  static async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password_hash);
  }
  
  static update(id, updates) {
    const validKeys = [
      'full_name', 'bio', 'stance', 'experience_level',
      'avatar_url', 'latitude', 'longitude'
    ];
    
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
      UPDATE users
      SET ${setClauses}, updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `);
    
    stmt.run({ ...filteredUpdates, id });
    return this.findById(id);
  }
  
  static delete(id) {
    return db.prepare('DELETE FROM users WHERE id = ?').run(id);
  }
}