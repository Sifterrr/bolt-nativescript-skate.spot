import { Database } from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('skate.db');

// Sample data
const users = [
  {
    id: 'user1',
    username: 'tony_hawk',
    email: 'tony@hawk.com',
    password: 'sk8ordie',
    full_name: 'Tony Hawk',
    bio: 'Professional skateboarder and video game character',
    stance: 'regular',
    experience_level: 'pro'
  },
  {
    id: 'user2',
    username: 'rodney_mullen',
    email: 'rodney@mullen.com',
    password: 'kickflip360',
    full_name: 'Rodney Mullen',
    bio: 'Godfather of street skating',
    stance: 'regular',
    experience_level: 'pro'
  }
];

const skateparks = [
  {
    id: 'park1',
    name: 'Venice Beach Skatepark',
    description: 'Iconic beachfront skatepark with smooth concrete and various features',
    address: '1800 Ocean Front Walk',
    city: 'Venice',
    state: 'California',
    latitude: 33.9850,
    longitude: -118.4695,
    features: JSON.stringify([
      'Bowl',
      'Snake Run',
      'Street Section',
      'Handrails',
      'Quarter Pipes'
    ]),
    difficulty_level: 'all-levels',
    hours_of_operation: '9:00 AM - Sunset',
    is_free: true
  },
  {
    id: 'park2',
    name: 'Stoner Skate Plaza',
    description: 'Modern street plaza with perfect ledges and manual pads',
    address: '1835 Stoner Ave',
    city: 'Los Angeles',
    state: 'California',
    latitude: 34.0369,
    longitude: -118.4529,
    features: JSON.stringify([
      'Ledges',
      'Manual Pads',
      'Stairs',
      'Handrails',
      'Flat Bars'
    ]),
    difficulty_level: 'intermediate',
    hours_of_operation: '8:00 AM - 10:00 PM',
    is_free: true
  }
];

const skateparkImages = [
  {
    id: 'img1',
    skatepark_id: 'park1',
    url: '/assets/parks/venice-1.jpg',
    caption: 'Aerial view of Venice Beach Skatepark',
    is_primary: true
  },
  {
    id: 'img2',
    skatepark_id: 'park1',
    url: '/assets/parks/venice-2.jpg',
    caption: 'Main bowl section'
  },
  {
    id: 'img3',
    skatepark_id: 'park2',
    url: '/assets/parks/stoner-1.jpg',
    caption: 'Overview of Stoner Skate Plaza',
    is_primary: true
  }
];

const streetViews = [
  {
    id: 'sv1',
    skatepark_id: 'park1',
    pano_id: 'CAoSLEFGMVFpcE1GM3Y2UmJkS2F2Y1Z5NXFfalBrX0xGbDFJLXBqY0QtUDRGVzNN',
    heading: 180,
    pitch: 0,
    zoom: 1
  },
  {
    id: 'sv2',
    skatepark_id: 'park2',
    pano_id: 'CAoSLEFGMVFpcE43VGZYWHZHYnA5LVY2RGpfZGF1RHJyN0otNzRLLU9ES2JlOHpz',
    heading: 270,
    pitch: 0,
    zoom: 1
  }
];

// Insert sample data
const insertUser = db.prepare(`
  INSERT INTO users (id, username, email, password_hash, full_name, bio, stance, experience_level)
  VALUES (@id, @username, @email, @password_hash, @full_name, @bio, @stance, @experience_level)
`);

const insertSkatepark = db.prepare(`
  INSERT INTO skateparks (id, name, description, address, city, state, latitude, longitude, features, difficulty_level, hours_of_operation, is_free)
  VALUES (@id, @name, @description, @address, @city, @state, @latitude, @longitude, @features, @difficulty_level, @hours_of_operation, @is_free)
`);

const insertSkateparkImage = db.prepare(`
  INSERT INTO skatepark_images (id, skatepark_id, url, caption, is_primary)
  VALUES (@id, @skatepark_id, @url, @caption, @is_primary)
`);

const insertStreetView = db.prepare(`
  INSERT INTO street_views (id, skatepark_id, pano_id, heading, pitch, zoom)
  VALUES (@id, @skatepark_id, @pano_id, @heading, @pitch, @zoom)
`);

// Insert users
users.forEach(user => {
  const password_hash = bcrypt.hashSync(user.password, 10);
  insertUser.run({ ...user, password_hash });
});

// Insert skateparks
skateparks.forEach(park => {
  insertSkatepark.run(park);
});

// Insert skatepark images
skateparkImages.forEach(image => {
  insertSkateparkImage.run(image);
});

// Insert street views
streetViews.forEach(view => {
  insertStreetView.run(view);
});

console.log('Database seeded successfully!');