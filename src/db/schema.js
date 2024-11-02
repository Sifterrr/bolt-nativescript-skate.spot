import { Database } from 'better-sqlite3';

const db = new Database('skate.db');

// Enable foreign keys and spatial features
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Users table with location tracking
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    stance TEXT CHECK(stance IN ('regular', 'goofy')),
    experience_level TEXT CHECK(experience_level IN ('beginner', 'intermediate', 'advanced', 'pro')),
    latitude REAL,
    longitude REAL,
    last_location_update DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Create index for location-based queries
  CREATE INDEX IF NOT EXISTS idx_user_location ON users(latitude, longitude);

  -- Skateparks table
  CREATE TABLE IF NOT EXISTS skateparks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'USA',
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    features TEXT,
    difficulty_level TEXT CHECK(difficulty_level IN ('beginner', 'intermediate', 'advanced', 'all-levels')),
    hours_of_operation TEXT,
    is_free BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Skatepark images table with categories
  CREATE TABLE IF NOT EXISTS skatepark_images (
    id TEXT PRIMARY KEY,
    skatepark_id TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    category TEXT CHECK(category IN ('overview', 'feature', 'aerial', 'indoor', 'street-view')),
    is_primary BOOLEAN DEFAULT false,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (skatepark_id) REFERENCES skateparks(id) ON DELETE CASCADE
  );

  -- Trick media table for photos and videos
  CREATE TABLE IF NOT EXISTS trick_media (
    id TEXT PRIMARY KEY,
    trick_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    type TEXT CHECK(type IN ('image', 'video')) NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration INTEGER, -- in seconds, for videos
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trick_id) REFERENCES tricks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Rest of the existing tables remain the same
  -- Reviews table
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    skatepark_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skatepark_id) REFERENCES skateparks(id) ON DELETE CASCADE
  );

  -- Assets table
  CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('image', 'video', 'other')),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- User tricks table with media support
  CREATE TABLE IF NOT EXISTS tricks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    skatepark_id TEXT,
    name TEXT NOT NULL,
    description TEXT,
    difficulty TEXT CHECK(difficulty IN ('beginner', 'intermediate', 'advanced', 'pro')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skatepark_id) REFERENCES skateparks(id) ON DELETE SET NULL
  );

  -- Sessions table
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    creator_id TEXT NOT NULL,
    skatepark_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    max_participants INTEGER,
    skill_level TEXT CHECK(skill_level IN ('beginner', 'intermediate', 'advanced', 'all-levels')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skatepark_id) REFERENCES skateparks(id) ON DELETE CASCADE
  );

  -- Session participants table
  CREATE TABLE IF NOT EXISTS session_participants (
    session_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    status TEXT CHECK(status IN ('going', 'maybe', 'not_going')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (session_id, user_id),
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

export default db;