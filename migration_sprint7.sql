-- Sprint 7: Fix dark-on-dark text colours for hero security badges and body text
UPDATE css_setting
SET
  security_color = '#a5b4fc'  WHERE security_color = '#000000' OR security_color IS NULL;

UPDATE css_setting
SET
  icon_color = '#ffffff'      WHERE icon_color = '#000000' OR icon_color IS NULL;

-- Also fix schema defaults for future installs
ALTER TABLE css_setting
  ALTER COLUMN security_color SET DEFAULT '#a5b4fc',
  ALTER COLUMN icon_color     SET DEFAULT '#ffffff';
