-- Sprint 3 Migration

-- Page view analytics
CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  path VARCHAR(500) UNIQUE NOT NULL,
  views INT DEFAULT 1,
  last_viewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login rate limiting / failed attempts
CREATE TABLE IF NOT EXISTS login_attempts (
  id SERIAL PRIMARY KEY,
  ip_address VARCHAR(100) NOT NULL,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  success INT DEFAULT 0
);

-- Admin activity log
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id SERIAL PRIMARY KEY,
  admin_id INT,
  admin_username VARCHAR(100),
  action VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin user roles
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'superadmin';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
UPDATE admin_users SET role = 'superadmin' WHERE role IS NULL;

-- A/B tests for download button
CREATE TABLE IF NOT EXISTS ab_tests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  variant_a_text VARCHAR(255),
  variant_a_color VARCHAR(50),
  variant_b_text VARCHAR(255),
  variant_b_color VARCHAR(50),
  clicks_a INT DEFAULT 0,
  clicks_b INT DEFAULT 0,
  impressions_a INT DEFAULT 0,
  impressions_b INT DEFAULT 0,
  is_active INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site widgets (announcement bar, head scripts, footer blurb)
CREATE TABLE IF NOT EXISTS site_widgets (
  id SERIAL PRIMARY KEY,
  widget_key VARCHAR(100) UNIQUE NOT NULL,
  content TEXT,
  is_enabled INT DEFAULT 0
);

-- Nav menu items
CREATE TABLE IF NOT EXISTS nav_menu (
  id SERIAL PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  url VARCHAR(500) NOT NULL,
  target VARCHAR(20) DEFAULT '_self',
  sort_order INT DEFAULT 0,
  is_active INT DEFAULT 1
);

-- Seed default site widgets
INSERT INTO site_widgets (widget_key, content, is_enabled) VALUES
  ('announcement_bar', '🎉 Download now and get started for free!', 0),
  ('custom_head_scripts', '', 0),
  ('footer_custom_blurb', '', 0)
ON CONFLICT (widget_key) DO NOTHING;
