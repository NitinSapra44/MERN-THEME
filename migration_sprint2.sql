-- Sprint 2 Migration: Media Library, Draft Posts, Categories, Page Builder

-- Draft / scheduled publishing for blogs
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS is_published INT DEFAULT 1;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP;
UPDATE blogs SET is_published = 1, published_at = COALESCE(created_at, CURRENT_TIMESTAMP) WHERE is_published IS NULL;

-- Blog categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Category + tags on blogs
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS category_id INT REFERENCES blog_categories(id) ON DELETE SET NULL;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS tags TEXT;

-- Media library (tracks all uploaded files)
CREATE TABLE IF NOT EXISTS media_files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  file_type VARCHAR(50),
  file_size INT,
  url VARCHAR(500) NOT NULL,
  upload_type VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Page builder sections
CREATE TABLE IF NOT EXISTS page_sections (
  id SERIAL PRIMARY KEY,
  page_key VARCHAR(100) NOT NULL,
  section_type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  sort_order INT DEFAULT 0,
  is_enabled INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default categories
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Guides',      'guides',      'Step-by-step how-to guides'),
  ('News',        'news',        'Latest app news and updates'),
  ('Tips & Tricks', 'tips',      'Pro tips for getting the most out of the app')
ON CONFLICT (slug) DO NOTHING;
