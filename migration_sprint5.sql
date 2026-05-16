-- Sprint 5 Migration: Fix dark theme colors + ensure admin tables exist

-- Fix features/FAQ/footer background to dark theme colors
UPDATE css_setting SET
  featured_bg_color       = '#0b0b20',
  featured_heading_color  = '#f1f5f9',
  featured_icon_bg_color  = 'rgba(99,102,241,0.15)',
  bg_heading_color        = '#f1f5f9',
  bg_text_color           = '#94a3b8',
  faq_bg_color            = '#0d0d24',
  faq_heading_color       = '#6366f1',
  faq_box_bg_color        = 'rgba(255,255,255,0.04)',
  faq_title_color         = '#f1f5f9',
  faq_desc_color          = '#94a3b8',
  btn_bg_color            = '#6366f1',
  btn_text_color          = '#ffffff',
  h1_color                = '#ffffff',
  h1_size                 = 62,
  featured_heading_size   = 32,
  faq_heading_size        = 30
WHERE id = 1;

-- Fix footer background to dark
UPDATE site_settings SET footer_bg_color = '#060615' WHERE id = 1;

-- Ensure login_attempts table exists (created in sprint3 but may be missing in Neon)
CREATE TABLE IF NOT EXISTS login_attempts (
  id           SERIAL PRIMARY KEY,
  ip_address   VARCHAR(100) NOT NULL,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  success      INT DEFAULT 0
);

-- Ensure admin_activity_log exists
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id             SERIAL PRIMARY KEY,
  admin_id       INT,
  admin_username VARCHAR(100),
  action         VARCHAR(500) NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure admin user exists: admin / admin123
INSERT INTO admin_users (username, password, role)
VALUES ('admin', '0192023a7bbd73250516f069df18b500', 'superadmin')
ON CONFLICT (username) DO NOTHING;

-- Ensure homepage_settings row exists (needed for enabled_locales)
INSERT INTO homepage_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Ensure sprint-4 columns exist (in case migration_sprint4 was not applied)
ALTER TABLE homepage_settings ADD COLUMN IF NOT EXISTS enabled_locales TEXT;
ALTER TABLE homepage_settings ADD COLUMN IF NOT EXISTS tagline VARCHAR(500);

-- Ensure banner/download button columns exist on all language tables (sprint 4)
DO $$
DECLARE
  tname TEXT;
  langs TEXT[] := ARRAY[
    'english','urdu','arabic','french','spanish','german','italian','russian',
    'vietnamese','bangladeshi','hindi','indonesian','japanese','malay',
    'portuguese','telugu','tamil','thai','turkish','filipino','punjabi'
  ];
BEGIN
  FOREACH tname IN ARRAY langs LOOP
    EXECUTE format('ALTER TABLE homepage_%s ADD COLUMN IF NOT EXISTS banner_buttons TEXT', tname);
    EXECUTE format('ALTER TABLE homepage_%s ADD COLUMN IF NOT EXISTS banner_button_timer INT DEFAULT 0', tname);
    EXECUTE format('ALTER TABLE homepage_%s ADD COLUMN IF NOT EXISTS download_buttons TEXT', tname);
    EXECUTE format('ALTER TABLE homepage_%s ADD COLUMN IF NOT EXISTS download_button_timer INT DEFAULT 0', tname);
    EXECUTE format('ALTER TABLE homepage_%s ADD COLUMN IF NOT EXISTS faqs_title VARCHAR(255)', tname);
  END LOOP;
END $$;

-- Ensure admin_users role/timestamp columns exist
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'superadmin';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Ensure css_setting row exists
INSERT INTO css_setting (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Ensure site_settings row exists
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
