-- Sprint 1 Migration: Download Builder, SEO, Contact Form, Slug Manager

-- APK versions for Download Page Builder
CREATE TABLE IF NOT EXISTS apk_versions (
  id SERIAL PRIMARY KEY,
  version_name VARCHAR(100) NOT NULL,
  file_size VARCHAR(50),
  min_android VARCHAR(50) DEFAULT 'Android 5.0+',
  changelog TEXT,
  download_url VARCHAR(500) NOT NULL,
  is_latest INT DEFAULT 0,
  download_count INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact form submissions inbox
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read INT DEFAULT 0,
  ip_address VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Per-page SEO settings
CREATE TABLE IF NOT EXISTS page_seo (
  id SERIAL PRIMARY KEY,
  page_key VARCHAR(100) UNIQUE NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  og_image VARCHAR(255),
  canonical_url VARCHAR(500),
  robots VARCHAR(100) DEFAULT 'index, follow'
);

-- URL Redirects manager
CREATE TABLE IF NOT EXISTS redirects (
  id SERIAL PRIMARY KEY,
  from_path VARCHAR(500) UNIQUE NOT NULL,
  to_path VARCHAR(500) NOT NULL,
  redirect_type INT DEFAULT 301,
  is_active INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default SEO rows for each static page
INSERT INTO page_seo (page_key, meta_title, meta_description, robots)
VALUES
  ('download', 'Download App - Free APK', 'Download the latest APK version for free.', 'index, follow'),
  ('about', 'About Us', 'Learn more about our platform.', 'index, follow'),
  ('contact', 'Contact Us', 'Get in touch with our team.', 'index, follow'),
  ('privacy', 'Privacy Policy', 'Read our privacy policy.', 'index, follow'),
  ('dmca', 'DMCA Policy', 'DMCA copyright policy.', 'index, follow'),
  ('blogs', 'Blog - Latest Articles', 'Read our latest guides and articles.', 'index, follow')
ON CONFLICT (page_key) DO NOTHING;

-- Seed a sample APK version
INSERT INTO apk_versions (version_name, file_size, min_android, changelog, download_url, is_latest, sort_order)
VALUES (
  '5.0.3',
  '18.5 MB',
  'Android 5.0+',
  '<ul><li>Improved download speed by 30%</li><li>Fixed crash on Android 14</li><li>Added support for 4K video quality</li><li>UI improvements and dark mode fixes</li></ul>',
  'https://example.com/app-v5.0.3.apk',
  1,
  1
) ON CONFLICT DO NOTHING;
