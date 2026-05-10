-- Homepage global settings
CREATE TABLE IF NOT EXISTS homepage_settings (
  id SERIAL PRIMARY KEY,
  website_name VARCHAR(255) DEFAULT 'VidMate',
  logo VARCHAR(255),
  article_main_image VARCHAR(255),
  banner_type VARCHAR(50) DEFAULT 'image',
  page_settings TEXT,
  languages TEXT DEFAULT 'en'
);

-- CSS / design settings
CREATE TABLE IF NOT EXISTS css_setting (
  id SERIAL PRIMARY KEY,
  faq_enable INT DEFAULT 1,
  h2_custom_design INT DEFAULT 1,
  text_align VARCHAR(20) DEFAULT 'left',
  font_size INT DEFAULT 16,
  text_color VARCHAR(20) DEFAULT '#000000',
  h2_size INT DEFAULT 24,
  h2_color VARCHAR(20) DEFAULT '#000000',
  btn_bg_color VARCHAR(20) DEFAULT '#007bff',
  btn_text_color VARCHAR(20) DEFAULT '#ffffff',
  btn_padding_top INT DEFAULT 10,
  btn_padding_right INT DEFAULT 20,
  btn_padding_bottom INT DEFAULT 10,
  btn_padding_left INT DEFAULT 20,
  btn_font_size INT DEFAULT 16,
  security_size INT DEFAULT 14,
  security_color VARCHAR(20) DEFAULT '#000000',
  icon_size INT DEFAULT 14,
  icon_color VARCHAR(20) DEFAULT '#000000',
  detail_size INT DEFAULT 14,
  detail_color VARCHAR(20) DEFAULT '#000000',
  banner1_color1 VARCHAR(20) DEFAULT '#ff6b6b',
  banner1_color2 VARCHAR(20) DEFAULT '#feca57',
  banner1_color3 VARCHAR(20) DEFAULT '#48dbfb',
  banner2_color1 VARCHAR(20) DEFAULT '#ffffff',
  banner2_color2 VARCHAR(20) DEFAULT '#f0f0f0',
  banner2_color3 VARCHAR(20) DEFAULT '#e0e0e0',
  banner2_image VARCHAR(255),
  home_heading_size INT DEFAULT 28,
  home_heading_color VARCHAR(20) DEFAULT '#000000',
  home_desc_size INT DEFAULT 16,
  home_desc_color VARCHAR(20) DEFAULT '#555555',
  featured_bg_color VARCHAR(20) DEFAULT '#f9f9f9',
  featured_heading_size INT DEFAULT 24,
  featured_heading_color VARCHAR(20) DEFAULT '#000000',
  featured_icon_bg_color VARCHAR(20) DEFAULT '#ffffff',
  featured_icon_text_size INT DEFAULT 14,
  featured_icon_text_color VARCHAR(20) DEFAULT '#000000',
  bg_padding INT DEFAULT 20,
  bg_heading_size INT DEFAULT 20,
  bg_heading_color VARCHAR(20) DEFAULT '#000000',
  bg_text_size INT DEFAULT 14,
  bg_text_color VARCHAR(20) DEFAULT '#555555',
  faq_bg_color VARCHAR(20) DEFAULT '#f9f9f9',
  faq_heading_size INT DEFAULT 24,
  faq_heading_color VARCHAR(20) DEFAULT '#000000',
  faq_box_bg_color VARCHAR(20) DEFAULT '#ffffff',
  faq_title_size INT DEFAULT 16,
  faq_title_color VARCHAR(20) DEFAULT '#000000',
  faq_desc_size INT DEFAULT 14,
  faq_desc_color VARCHAR(20) DEFAULT '#555555',
  blog_padding_top INT DEFAULT 8,
  blog_padding_right INT DEFAULT 16,
  blog_padding_bottom INT DEFAULT 8,
  blog_padding_left INT DEFAULT 16,
  blog_btn_hover_bg VARCHAR(20) DEFAULT '#0056b3',
  blog_btn_hover_text VARCHAR(20) DEFAULT '#ffffff',
  h2_general_size INT DEFAULT 22,
  h2_general_color VARCHAR(20) DEFAULT '#000000',
  h1_size INT DEFAULT 32,
  h1_color VARCHAR(20) DEFAULT '#000000',
  h3_size INT DEFAULT 18,
  h3_color VARCHAR(20) DEFAULT '#000000',
  ul_list_style VARCHAR(50) DEFAULT 'disc',
  delay_seconds INT DEFAULT 0
);

-- English homepage content (all languages share same columns, different rows/tables)
CREATE TABLE IF NOT EXISTS homepage_english (
  id SERIAL PRIMARY KEY,
  banner_title VARCHAR(255),
  banner_subtitle VARCHAR(255),
  banner_button_text VARCHAR(100),
  banner_button_url VARCHAR(255),
  banner_image VARCHAR(255),
  security_info TEXT,
  security_icon1 VARCHAR(255),
  security_icon1_name VARCHAR(100),
  security_icon2 VARCHAR(255),
  security_icon2_name VARCHAR(100),
  security_icon3 VARCHAR(255),
  security_icon3_name VARCHAR(100),
  intro_title VARCHAR(255),
  intro_description TEXT,
  feature_title VARCHAR(255),
  faqs_title VARCHAR(255),
  post_limit INT DEFAULT 6,
  post_button_text VARCHAR(100),
  post_button_bg_color VARCHAR(20) DEFAULT '#007bff',
  post_button_text_color VARCHAR(20) DEFAULT '#ffffff',
  home_info_title VARCHAR(255),
  home_info_description TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keyword TEXT,
  download_slug VARCHAR(100) DEFAULT 'download',
  home_slug VARCHAR(100) DEFAULT '',
  download_page_title VARCHAR(255),
  download_page_description TEXT,
  download_button_name VARCHAR(100),
  download_button_url VARCHAR(255),
  download_page_content TEXT,
  old_version_title VARCHAR(255),
  old_version_buttons TEXT,
  download_meta_title VARCHAR(255),
  download_meta_description TEXT,
  download_meta_keyword TEXT,
  about_title VARCHAR(255),
  about_description TEXT,
  about_meta_title VARCHAR(255),
  about_meta_description TEXT,
  contact_title VARCHAR(255),
  contact_description TEXT,
  contact_meta_title VARCHAR(255),
  contact_meta_description TEXT,
  privacy_title VARCHAR(255),
  privacy_content TEXT,
  dmca_title VARCHAR(255),
  dmca_content TEXT
);

-- Language-specific tables (same structure as homepage_english)
CREATE TABLE IF NOT EXISTS homepage_urdu (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_arabic (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_france (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_espanol (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_germany (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_italy (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_russia (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_vietnam (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_bangladesh (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_india (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_indonesia (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_japan (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_malaysia (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_portugues (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_telugu (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_tamil (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_thailand (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_turkey (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_philippine (LIKE homepage_english INCLUDING ALL);
CREATE TABLE IF NOT EXISTS homepage_punjabi (LIKE homepage_english INCLUDING ALL);

-- Screenshots per language homepage
CREATE TABLE IF NOT EXISTS homepage_screenshots (
  id SERIAL PRIMARY KEY,
  homepage_id INT,
  image VARCHAR(255),
  heading VARCHAR(255),
  description TEXT,
  bg_color VARCHAR(20) DEFAULT '#ffffff'
);

-- FAQs per homepage
CREATE TABLE IF NOT EXISTS homepage_faqs (
  id SERIAL PRIMARY KEY,
  homepage_id INT,
  question TEXT,
  answer TEXT
);

-- Features per homepage
CREATE TABLE IF NOT EXISTS homepage_features (
  id SERIAL PRIMARY KEY,
  homepage_id INT,
  icon VARCHAR(255),
  title VARCHAR(255),
  description TEXT
);

-- Blogs
CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT,
  content TEXT,
  image VARCHAR(255),
  meta_title VARCHAR(255),
  meta_description TEXT,
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Download slug history
CREATE TABLE IF NOT EXISTS download_slugs (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  is_current INT DEFAULT 0
);

-- Home slug history
CREATE TABLE IF NOT EXISTS home_slugs (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  is_current INT DEFAULT 0
);

-- Admin users
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Site-wide settings (analytics, colors, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  header_bg_color VARCHAR(20) DEFAULT '#ffffff',
  footer_bg_color VARCHAR(20) DEFAULT '#ffffff',
  text_color VARCHAR(20) DEFAULT '#000000',
  show_blogs INT DEFAULT 1,
  show_intro INT DEFAULT 1,
  show_more INT DEFAULT 1,
  show_feature INT DEFAULT 1,
  google_analytics TEXT,
  google_adsense TEXT,
  google_search_console TEXT
);

-- Contact us content
CREATE TABLE IF NOT EXISTS contactus (
  id SERIAL PRIMARY KEY,
  content TEXT,
  email VARCHAR(255)
);

-- Social media links
CREATE TABLE IF NOT EXISTS social_media_links (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(100),
  url VARCHAR(255),
  icon VARCHAR(255)
);

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

-- Blog categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media library
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

-- URL Redirects manager
CREATE TABLE IF NOT EXISTS redirects (
  id SERIAL PRIMARY KEY,
  from_path VARCHAR(500) UNIQUE NOT NULL,
  to_path VARCHAR(500) NOT NULL,
  redirect_type INT DEFAULT 301,
  is_active INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sprint 3: Analytics — page view counters
CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  path VARCHAR(500) UNIQUE NOT NULL,
  views INT DEFAULT 1,
  last_viewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sprint 3: Login brute-force protection
CREATE TABLE IF NOT EXISTS login_attempts (
  id SERIAL PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  success INT DEFAULT 0
);

-- Sprint 3: Admin activity log
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id SERIAL PRIMARY KEY,
  admin_id INT,
  admin_username VARCHAR(100),
  action TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sprint 3: Admin roles column
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'superadmin';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Sprint 3: A/B Tests
CREATE TABLE IF NOT EXISTS ab_tests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  variant_a_text VARCHAR(255),
  variant_a_color VARCHAR(20) DEFAULT '#6366f1',
  variant_b_text VARCHAR(255),
  variant_b_color VARCHAR(20) DEFAULT '#10b981',
  clicks_a INT DEFAULT 0,
  impressions_a INT DEFAULT 0,
  clicks_b INT DEFAULT 0,
  impressions_b INT DEFAULT 0,
  is_active INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sprint 3: Widget zones (announcement bar, head scripts, footer blurb)
CREATE TABLE IF NOT EXISTS site_widgets (
  id SERIAL PRIMARY KEY,
  widget_key VARCHAR(100) UNIQUE NOT NULL,
  content TEXT,
  is_enabled INT DEFAULT 0
);

-- Sprint 3: Navigation menu
CREATE TABLE IF NOT EXISTS nav_menu (
  id SERIAL PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  url VARCHAR(500) NOT NULL,
  target VARCHAR(20) DEFAULT '_self',
  sort_order INT DEFAULT 0,
  is_active INT DEFAULT 1
);

-- Seed sprint 3 widgets
INSERT INTO site_widgets (widget_key, content, is_enabled) VALUES
  ('announcement_bar', '', 0),
  ('custom_head_scripts', '', 0),
  ('footer_custom_blurb', '', 0)
ON CONFLICT (widget_key) DO NOTHING;

-- Seed default nav menu
INSERT INTO nav_menu (label, url, target, sort_order, is_active) VALUES
  ('Home',     '/',         '_self', 1, 1),
  ('Download', '/download', '_self', 2, 1),
  ('Blogs',    '/blogs',    '_self', 3, 1)
ON CONFLICT DO NOTHING;

-- Seed default blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Guides',       'guides',        'Step-by-step guides and tutorials'),
  ('News',         'news',          'Latest news and updates'),
  ('Tips & Tricks','tips-and-tricks','Quick tips to get the most out of the app')
ON CONFLICT (slug) DO NOTHING;

-- Seed default rows
INSERT INTO homepage_settings (website_name, banner_type, languages)
  VALUES ('VidMate', 'image', 'en')
  ON CONFLICT DO NOTHING;

INSERT INTO css_setting (id) VALUES (1) ON CONFLICT DO NOTHING;
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;
INSERT INTO contactus (id, email) VALUES (1, 'contact@example.com') ON CONFLICT DO NOTHING;

INSERT INTO homepage_english (
  id, banner_title, banner_subtitle, banner_button_text, banner_button_url,
  intro_title, intro_description, feature_title, faqs_title,
  post_limit, home_info_title, meta_title, meta_description,
  download_slug, download_page_title, download_button_name, download_button_url,
  about_title, contact_title, privacy_title, dmca_title
) VALUES (
  1, 'Download Any Video Easily', 'Fast, free and simple video downloader',
  'Download Now', '/download',
  'What is VidMate?', '<p>VidMate is a powerful video downloader app.</p>',
  'Key Features', 'Frequently Asked Questions',
  6, 'About VidMate', 'VidMate - Video Downloader', 'Download videos from any platform',
  'download', 'Download VidMate', 'Download APK', 'https://example.com/vidmate.apk',
  'About Us', 'Contact Us', 'Privacy Policy', 'DMCA Policy'
) ON CONFLICT (id) DO NOTHING;

-- Default admin user: admin / admin123 (MD5)
INSERT INTO admin_users (username, password)
  VALUES ('admin', '0192023a7bbd73250516f069df18b500')
  ON CONFLICT DO NOTHING;

INSERT INTO download_slugs (slug, is_current) VALUES ('download', 1) ON CONFLICT DO NOTHING;

INSERT INTO page_seo (page_key, meta_title, meta_description, robots) VALUES
  ('download', 'Download App - Free APK', 'Download the latest APK version for free.', 'index, follow'),
  ('about',    'About Us',               'Learn more about our platform.',             'index, follow'),
  ('contact',  'Contact Us',             'Get in touch with our team.',                'index, follow'),
  ('privacy',  'Privacy Policy',         'Read our privacy policy.',                   'index, follow'),
  ('dmca',     'DMCA Policy',            'DMCA copyright policy.',                     'index, follow'),
  ('blogs',    'Blog - Latest Articles', 'Read our latest guides and articles.',       'index, follow')
ON CONFLICT (page_key) DO NOTHING;

INSERT INTO apk_versions (version_name, file_size, min_android, changelog, download_url, is_latest, sort_order) VALUES (
  '5.0.3', '18.5 MB', 'Android 5.0+',
  '<ul><li>Improved download speed by 30%</li><li>Fixed crash on Android 14</li><li>Added support for 4K video quality</li></ul>',
  'https://example.com/app-v5.0.3.apk', 1, 1
) ON CONFLICT DO NOTHING;
