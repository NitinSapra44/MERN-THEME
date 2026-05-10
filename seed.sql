-- ============================================================
-- FULL SEED DATA — VidNova (video downloader APK platform)
-- Run: psql -U nitinsapra -d vidmate -f seed.sql
-- ============================================================

-- ── Global Settings ─────────────────────────────────────────
INSERT INTO homepage_settings (id, website_name, banner_type, languages)
VALUES (1, 'VidNova', 'image', 'en,ur,ar,fr,es,de,it,ru,vn,bd,in,id,jp,my,br,te,ta,th,tr,ph,pa')
ON CONFLICT (id) DO UPDATE SET
  website_name = 'VidNova',
  banner_type  = 'image',
  languages    = 'en,ur,ar,fr,es,de,it,ru,vn,bd,in,id,jp,my,br,te,ta,th,tr,ph,pa';

-- ── Site Design Settings ────────────────────────────────────
INSERT INTO site_settings (id, header_bg_color, footer_bg_color, text_color, show_blogs, show_intro, show_more, show_feature)
VALUES (1, '#0f0f1a', '#080812', '#333333', 1, 1, 1, 1)
ON CONFLICT (id) DO UPDATE SET
  header_bg_color = '#0f0f1a',
  footer_bg_color = '#080812',
  text_color      = '#333333';

-- ── CSS / Design Controls ───────────────────────────────────
INSERT INTO css_setting (
  id, faq_enable, h2_custom_design, text_align, font_size, text_color,
  h2_size, h2_color, btn_bg_color, btn_text_color,
  btn_padding_top, btn_padding_right, btn_padding_bottom, btn_padding_left, btn_font_size,
  security_size, security_color, icon_size, icon_color,
  home_heading_size, home_heading_color, home_desc_size, home_desc_color,
  featured_bg_color, featured_heading_size, featured_heading_color,
  featured_icon_bg_color, featured_icon_text_size, featured_icon_text_color,
  bg_padding, bg_heading_size, bg_heading_color, bg_text_size,  bg_text_color,
  faq_bg_color, faq_heading_size, faq_heading_color, faq_box_bg_color,
  faq_title_size, faq_title_color, faq_desc_size, faq_desc_color,
  h2_general_size, h2_general_color, h1_size, h1_color, h3_size, h3_color,
  detail_size, detail_color, delay_seconds
) VALUES (
  1, 1, 1, 'justify', 15, '#333333',
  24, '#111111', '#ffffff', '#111111',
  13, 30, 13, 30, 17,
  13, '#ffffffcc', 36, '#ffffff',
  30, '#111111', 15, '#555555',
  '#111827', 26, '#ffffff',
  '#1e1e30', 13, '#e2e8f0',
  22, 18, '#ffffff', 14, '#aaaaaa',
  '#f3f4f6', 28, '#111111', '#ffffff',
  16, '#1f2937', 14, '#374151',
  22, '#111111', 46, '#ffffff', 19, '#1f2937',
  15, '#444444', 0
)
ON CONFLICT (id) DO UPDATE SET
  btn_bg_color      = '#ffffff',
  btn_text_color    = '#111111',
  h1_size           = 46,
  h1_color          = '#ffffff',
  featured_bg_color = '#111827',
  faq_bg_color      = '#f3f4f6',
  detail_size       = 15,
  detail_color      = '#444444';

-- ── English Homepage Content ─────────────────────────────────
INSERT INTO homepage_english (
  id,
  banner_title, banner_subtitle, banner_button_text, banner_button_url, banner_image,
  security_info, security_icon1_name, security_icon2_name, security_icon3_name,
  intro_title, intro_description,
  feature_title, faqs_title,
  post_limit, post_button_text, post_button_bg_color, post_button_text_color,
  home_info_title, home_info_description,
  meta_title, meta_description, meta_keyword,
  download_slug,
  download_page_title, download_page_description,
  download_button_name, download_button_url,
  download_page_content,
  old_version_title, old_version_buttons,
  download_meta_title, download_meta_description, download_meta_keyword,
  about_title, about_description, about_meta_title, about_meta_description,
  contact_title, contact_description, contact_meta_title, contact_meta_description,
  privacy_title, privacy_content,
  dmca_title, dmca_content
) VALUES (
  1,
  -- Banner
  'VidNova',
  'Download Any Video from Any Platform — Free & Fast',
  'Download Free',
  '/download',
  '',
  -- Security icons
  'Trusted & Scanned by',
  'CM Security', 'Lookout', 'McAfee',
  -- Intro
  'What is VidNova?',
  '<p><strong>VidNova</strong> is the world''s most powerful and easy-to-use free video downloader for Android. With over <strong>50 million downloads</strong> across 80 countries, VidNova lets you save videos from YouTube, Facebook, Instagram, TikTok, Twitter/X, WhatsApp, DailyMotion, Vimeo, and hundreds of other platforms — all in HD quality.</p>
<p>Unlike other downloaders, VidNova requires no account, no subscription, and no hidden fees. It supports resolutions up to <strong>4K Ultra HD</strong> and lets you convert videos to MP3 with a single tap. Whether you want to save a funny reel, a music video, or a full movie trailer, VidNova handles it all — instantly.</p>
<p>The app is lightweight (under 12 MB), works on Android 5.0 and above, and is completely ad-free inside the player. Our security team scans every component with CM Security, Lookout, and McAfee to ensure your device stays safe at all times.</p>',
  -- Sections
  'Why Choose VidNova?',
  'Frequently Asked Questions',
  6, 'Read Full Article', '#6366f1', '#ffffff',
  -- Home Info (long rich content)
  'VidNova APK — Complete Guide 2025',
  '<h2>About VidNova</h2>
<p>VidNova was first launched in 2019 as a simple download manager. Over the years it has grown into a full-featured video downloading platform trusted by millions. The latest version — <strong>VidNova v4.2</strong> — brings significant speed improvements, a redesigned UI, and support for 15 new video platforms including Pinterest, Reddit, and Twitch clips.</p>
<p>Our development team works continuously to keep up with changes on supported platforms. When YouTube, Instagram, or TikTok update their systems, VidNova gets updated within 48 hours to ensure uninterrupted downloads.</p>

<h2>How to Download VidNova on Android</h2>
<p>Installing VidNova is simple and takes less than 2 minutes:</p>
<ul>
  <li>Tap the <strong>Download Free</strong> button at the top of this page.</li>
  <li>Open your device <strong>Settings → Security → Unknown Sources</strong> and enable it (one-time step).</li>
  <li>Open the downloaded <code>VidNova-v4.2.apk</code> file from your notification bar or Downloads folder.</li>
  <li>Tap <strong>Install</strong> and wait for the process to complete (usually under 30 seconds).</li>
  <li>Open VidNova, paste any video link, and tap <strong>Download</strong>.</li>
</ul>

<h2>Supported Platforms</h2>
<p>VidNova currently supports downloading from over 200 websites and apps, including:</p>
<ul>
  <li><strong>YouTube</strong> — videos, Shorts, playlists, and live streams</li>
  <li><strong>Instagram</strong> — Reels, Stories, posts, and IGTV</li>
  <li><strong>TikTok</strong> — with and without watermark</li>
  <li><strong>Facebook</strong> — public videos, Watch, and Reels</li>
  <li><strong>Twitter / X</strong> — videos and GIFs</li>
  <li><strong>WhatsApp Status</strong> — photos and videos</li>
  <li><strong>Dailymotion, Vimeo, Twitch, Reddit</strong> and many more</li>
</ul>

<h2>Key Features</h2>
<ul>
  <li>Download in resolutions up to <strong>4K / 2160p</strong></li>
  <li>Built-in <strong>MP3 converter</strong> — extract audio from any video</li>
  <li>Download multiple videos <strong>simultaneously</strong></li>
  <li>Built-in private browser for finding videos</li>
  <li><strong>Background download</strong> — continue using your phone</li>
  <li>Auto-pause on low battery or data</li>
  <li>Built-in HD media player</li>
  <li>Available in <strong>21 languages</strong></li>
</ul>

<h2>VidNova Pros &amp; Cons</h2>
<p><strong>Pros:</strong></p>
<ul>
  <li>Completely free — no subscriptions, no hidden fees</li>
  <li>Supports 200+ platforms in a single app</li>
  <li>4K / HD downloads supported</li>
  <li>No registration required</li>
  <li>Background downloads with progress notifications</li>
  <li>Regular updates pushed weekly</li>
  <li>Lightweight — only 11.8 MB</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
  <li>Android only — iOS version not yet available</li>
  <li>Requires enabling Unknown Sources during installation</li>
  <li>Cannot download DRM-protected content (Netflix, Prime, etc.)</li>
  <li>Some platforms may require logging in via the built-in browser</li>
</ul>

<h2>Is VidNova Safe?</h2>
<p>Yes. VidNova is completely safe to download and use. Every APK release is scanned using three independent antivirus engines — <strong>CM Security</strong>, <strong>Lookout</strong>, and <strong>McAfee</strong> — before it is published. We have a zero-tolerance policy for malware, spyware, or adware.</p>
<p>VidNova does not collect personal data, does not require account registration, and does not share any information with third parties. The app requests only the minimum necessary permissions: internet access and storage (to save downloaded files).</p>

<h2>System Requirements</h2>
<ul>
  <li>Android 5.0 (Lollipop) or higher</li>
  <li>At least 1 GB RAM (2 GB recommended)</li>
  <li>50 MB free storage for the app + space for your downloads</li>
  <li>Active internet connection</li>
</ul>

<h2>Version History</h2>
<p><strong>v4.2 (May 2025)</strong> — Added Pinterest, Reddit, and Twitch support. Improved download speeds by 40%. New dark UI theme.</p>
<p><strong>v4.1 (March 2025)</strong> — TikTok watermark-free downloads. Bug fixes for Instagram Stories.</p>
<p><strong>v4.0 (January 2025)</strong> — Complete UI redesign. 4K download support. New MP3 converter engine.</p>
<p><strong>v3.9 (October 2024)</strong> — Added WhatsApp Status downloader. Improved stability on Android 14.</p>',
  -- SEO
  'VidNova APK Download Free 2025 — Video Downloader for Android',
  'Download VidNova APK for free. The best video downloader for Android supporting YouTube, Instagram, TikTok, Facebook and 200+ more sites.',
  'vidnova, video downloader, apk download, youtube downloader, instagram downloader, tiktok downloader, android',
  -- Download page
  'download',
  'Download VidNova APK — Latest Version v4.2',
  'Download the latest VidNova APK for Android. Free, safe, and works with YouTube, Instagram, TikTok, Facebook and 200+ platforms.',
  'Download VidNova APK',
  '#',
  '<p>You are about to download <strong>VidNova v4.2 APK</strong> — the most powerful free video downloader for Android. This is the latest stable version, fully tested and verified safe by our security team.</p>
<h2>What''s New in v4.2</h2>
<ul>
  <li>Added support for <strong>Pinterest</strong>, <strong>Reddit videos</strong>, and <strong>Twitch clips</strong></li>
  <li>Download speeds improved by up to <strong>40%</strong> thanks to a new multi-thread engine</li>
  <li>New <strong>dark mode</strong> UI — easier on the eyes</li>
  <li>Fixed Instagram Stories downloading on Android 14</li>
  <li>Improved MP3 extraction quality (now supports 320 kbps)</li>
  <li>Background download notifications redesigned</li>
</ul>
<h2>Installation Steps</h2>
<ul>
  <li>Tap the download button above.</li>
  <li>Go to <strong>Settings → Security → Install Unknown Apps</strong> and enable your browser or file manager.</li>
  <li>Open the APK from your Downloads folder.</li>
  <li>Tap <strong>Install</strong> and follow the on-screen steps.</li>
  <li>Launch VidNova and start downloading videos instantly.</li>
</ul>
<h2>File Details</h2>
<ul>
  <li><strong>Version:</strong> 4.2</li>
  <li><strong>File Size:</strong> 11.8 MB</li>
  <li><strong>Requires Android:</strong> 5.0+</li>
  <li><strong>Updated:</strong> May 2025</li>
  <li><strong>Scanned by:</strong> CM Security, Lookout, McAfee</li>
</ul>',
  'Older Versions',
  '[{"text":"VidNova v4.1","url":"#"},{"text":"VidNova v4.0","url":"#"},{"text":"VidNova v3.9","url":"#"},{"text":"VidNova v3.8","url":"#"}]',
  'Download VidNova APK v4.2 — Free Video Downloader for Android',
  'Download VidNova APK v4.2 for free. Supports YouTube, Instagram, TikTok and 200+ platforms.',
  'vidnova apk, vidnova download, video downloader apk, youtube downloader android',
  -- About
  'About VidNova',
  '<p>VidNova was founded in 2019 by a team of mobile developers who were frustrated by the lack of a reliable, free, and safe video downloader for Android. What started as a weekend project quickly grew into one of the most downloaded APKs in Asia, the Middle East, and Latin America.</p>
<p>Today, VidNova is trusted by over <strong>50 million users</strong> in 80+ countries. Our team of 24 engineers and security experts work round the clock to maintain compatibility with over 200 platforms and to keep the app safe, fast, and free for everyone.</p>
<h2>Our Mission</h2>
<p>To democratise access to online video content. We believe every user deserves the right to save content they love and watch it offline — whether on a long flight, in an area with poor internet, or simply to preserve a memory.</p>
<h2>Our Values</h2>
<ul>
  <li><strong>Free forever</strong> — we will never charge for the core download feature.</li>
  <li><strong>Privacy first</strong> — we do not collect, sell, or share your data.</li>
  <li><strong>Security</strong> — every release is independently scanned before publication.</li>
  <li><strong>Speed</strong> — we measure and improve download speeds with every update.</li>
</ul>
<h2>Get in Touch</h2>
<p>For support, partnership inquiries, or feedback, reach us at <strong>hello@vidnova.app</strong>. We respond to all emails within 24 hours on weekdays.</p>',
  'About VidNova — The Free Video Downloader App',
  'Learn about VidNova, the team behind it, and our mission to make video downloading free and safe for everyone.',
  -- Contact
  'Contact VidNova Support',
  '<p>We would love to hear from you! Whether you have a question, encountered a bug, or want to suggest a new feature, our team is here to help.</p>
<p><strong>General Enquiries:</strong> hello@vidnova.app<br />
<strong>Technical Support:</strong> support@vidnova.app<br />
<strong>Partnerships:</strong> partners@vidnova.app<br />
<strong>DMCA &amp; Copyright:</strong> dmca@vidnova.app</p>
<h2>Response Times</h2>
<ul>
  <li><strong>Support tickets</strong>: Replied within 12–24 hours on weekdays.</li>
  <li><strong>Bug reports</strong>: Reviewed within 48 hours; hotfixes pushed within a week.</li>
  <li><strong>Partnership inquiries</strong>: Responded within 3 business days.</li>
</ul>
<h2>Report a Bug</h2>
<p>When reporting a bug, please include: your Android version, device model, VidNova version, and a description of what happened. Screenshots or screen recordings are very helpful. Send bug reports to <strong>support@vidnova.app</strong>.</p>',
  'Contact VidNova — Support, Feedback & Partnerships',
  'Get in touch with the VidNova team for support, bug reports, partnerships, or general enquiries.',
  -- Privacy Policy
  'Privacy Policy',
  '<h2>Overview</h2>
<p>VidNova ("we", "our", "the app") is committed to protecting your privacy. This Privacy Policy explains what data we collect, how we use it, and what rights you have regarding your information.</p>
<p><strong>Last updated:</strong> May 2025</p>

<h2>Information We Collect</h2>
<p>VidNova collects minimal data. We collect only what is necessary to operate and improve the service:</p>
<ul>
  <li><strong>Device information</strong>: Android version, device model, screen size (used to optimise the UI).</li>
  <li><strong>Usage analytics</strong>: Anonymised data about which features are used most (to guide development). No personal information is linked to these analytics.</li>
  <li><strong>Crash reports</strong>: Anonymous error logs sent when the app crashes, to help us fix bugs faster.</li>
</ul>
<p>We do <strong>not</strong> collect: your name, email, phone number, location, browsing history, or any personally identifiable information. We do not require account registration.</p>

<h2>How We Use Your Data</h2>
<ul>
  <li>To improve app performance and fix bugs.</li>
  <li>To understand which features are most valuable to users.</li>
  <li>To ensure compatibility with new Android versions and platforms.</li>
</ul>

<h2>Data Sharing</h2>
<p>We do not sell, rent, or share your data with any third parties for commercial purposes. Anonymous analytics may be processed by our infrastructure provider (hosted in the EU under GDPR compliance).</p>

<h2>Cookies & Tracking</h2>
<p>The VidNova APK itself does not use cookies. Our website uses anonymous session cookies for basic functionality (language preference, theme). You may disable cookies in your browser at any time.</p>

<h2>Third-Party Services</h2>
<p>The app uses Google Firebase for anonymous crash reporting. Please refer to <a href="https://policies.google.com/privacy">Google''s Privacy Policy</a> for details on how Firebase handles data.</p>

<h2>Children''s Privacy</h2>
<p>VidNova is not directed at children under 13. We do not knowingly collect data from minors.</p>

<h2>Your Rights</h2>
<p>Since we do not collect personal data, there is nothing to request deletion of. If you have any privacy concerns, contact us at <strong>privacy@vidnova.app</strong>.</p>

<h2>Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. The latest version will always be published on this page with an updated date.</p>

<h2>Contact</h2>
<p>Questions about privacy? Email us at <strong>privacy@vidnova.app</strong>. We respond within 48 hours.</p>',
  -- DMCA
  'DMCA Policy',
  '<h2>Overview</h2>
<p>VidNova respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA) and equivalent international copyright laws. This policy explains how to submit a copyright infringement notice and what happens next.</p>

<h2>What VidNova Does</h2>
<p>VidNova is a download tool that enables users to save publicly accessible video content to their own devices for personal, offline use. We do not host video content ourselves — we facilitate access to content that is already publicly available on third-party platforms. We comply fully with DMCA safe harbour provisions (17 U.S.C. § 512).</p>

<h2>Filing a DMCA Takedown Notice</h2>
<p>If you believe content accessible through VidNova infringes your copyright, please send a written DMCA notice to <strong>dmca@vidnova.app</strong> with all of the following:</p>
<ul>
  <li>Your full legal name, address, telephone number, and email address.</li>
  <li>A description of the copyrighted work you claim has been infringed.</li>
  <li>The URL(s) of the allegedly infringing content.</li>
  <li>A statement that you have a good faith belief the use is not authorised by the copyright owner, its agent, or the law.</li>
  <li>A statement, under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorised to act on behalf of the owner.</li>
  <li>Your electronic or physical signature.</li>
</ul>
<p>Incomplete notices will not be acted upon. Please ensure all required elements are included.</p>

<h2>Counter-Notice Procedure</h2>
<p>If you believe your content was removed in error, you may file a counter-DMCA notice to <strong>dmca@vidnova.app</strong> with: your contact information, identification of the removed content, a statement under penalty of perjury that you believe the removal was a mistake, and consent to jurisdiction of your local Federal District Court.</p>

<h2>Repeat Infringers</h2>
<p>VidNova has a policy of terminating accounts or access of users who are found to be repeat infringers of copyright in appropriate circumstances.</p>

<h2>Response Time</h2>
<p>We process valid DMCA notices within <strong>5 business days</strong> of receipt. You will receive an email acknowledgement when your notice is received and a further email when action is taken.</p>'
)
ON CONFLICT (id) DO UPDATE SET
  banner_title            = EXCLUDED.banner_title,
  banner_subtitle         = EXCLUDED.banner_subtitle,
  banner_button_text      = EXCLUDED.banner_button_text,
  banner_button_url       = EXCLUDED.banner_button_url,
  banner_image            = EXCLUDED.banner_image,
  security_info           = EXCLUDED.security_info,
  security_icon1          = NULL,
  security_icon2          = NULL,
  security_icon3          = NULL,
  security_icon1_name     = EXCLUDED.security_icon1_name,
  security_icon2_name     = EXCLUDED.security_icon2_name,
  security_icon3_name     = EXCLUDED.security_icon3_name,
  intro_title             = EXCLUDED.intro_title,
  intro_description       = EXCLUDED.intro_description,
  feature_title           = EXCLUDED.feature_title,
  faqs_title              = EXCLUDED.faqs_title,
  post_limit              = EXCLUDED.post_limit,
  post_button_text        = EXCLUDED.post_button_text,
  post_button_bg_color    = EXCLUDED.post_button_bg_color,
  post_button_text_color  = EXCLUDED.post_button_text_color,
  home_info_title         = EXCLUDED.home_info_title,
  home_info_description   = EXCLUDED.home_info_description,
  meta_title              = EXCLUDED.meta_title,
  meta_description        = EXCLUDED.meta_description,
  meta_keyword            = EXCLUDED.meta_keyword,
  download_slug           = EXCLUDED.download_slug,
  download_page_title     = EXCLUDED.download_page_title,
  download_page_description = EXCLUDED.download_page_description,
  download_button_name    = EXCLUDED.download_button_name,
  download_button_url     = EXCLUDED.download_button_url,
  download_page_content   = EXCLUDED.download_page_content,
  old_version_title       = EXCLUDED.old_version_title,
  old_version_buttons     = EXCLUDED.old_version_buttons,
  download_meta_title     = EXCLUDED.download_meta_title,
  download_meta_description = EXCLUDED.download_meta_description,
  about_title             = EXCLUDED.about_title,
  about_description       = EXCLUDED.about_description,
  about_meta_title        = EXCLUDED.about_meta_title,
  about_meta_description  = EXCLUDED.about_meta_description,
  contact_title           = EXCLUDED.contact_title,
  contact_description     = EXCLUDED.contact_description,
  contact_meta_title      = EXCLUDED.contact_meta_title,
  contact_meta_description = EXCLUDED.contact_meta_description,
  privacy_title           = EXCLUDED.privacy_title,
  privacy_content         = EXCLUDED.privacy_content,
  dmca_title              = EXCLUDED.dmca_title,
  dmca_content            = EXCLUDED.dmca_content;

-- ── Features (8 cards) ───────────────────────────────────────
DELETE FROM homepage_features WHERE homepage_id = 1;
INSERT INTO homepage_features (homepage_id, icon, title, description) VALUES
(1, '', '200+ Supported Sites', 'Download videos from YouTube, Instagram, TikTok, Facebook, Twitter, Dailymotion, Vimeo, and over 200 more platforms — all in one app.'),
(1, '', '4K Ultra HD Quality', 'Choose your download quality: 144p to full 4K Ultra HD. VidNova preserves the original resolution so your videos always look stunning.'),
(1, '', 'MP3 Audio Extraction', 'Convert any video to MP3 or AAC audio instantly. Save music, podcasts, and speeches for offline listening in crystal-clear 320 kbps quality.'),
(1, '', 'Simultaneous Downloads', 'Download up to 10 videos at the same time. A smart queue manager handles everything in the background so you can keep using your phone.'),
(1, '', 'Built-In Private Browser', 'Browse any video website directly inside VidNova. No need to switch apps — find your video, tap download, and done.'),
(1, '', 'No Registration Needed', 'Unlike most apps, VidNova requires zero sign-up. Download the APK, install it, and start saving videos within 2 minutes.'),
(1, '', 'Background Downloads', 'Downloads continue even when the screen is off or you switch apps. Get notified the moment your file is ready.'),
(1, '', 'Free Forever', 'VidNova is 100% free with no hidden subscription, no in-app purchase required for core features, and no expiry date. Always.');

-- ── FAQs (8 entries) ─────────────────────────────────────────
DELETE FROM homepage_faqs WHERE homepage_id = 1;
INSERT INTO homepage_faqs (homepage_id, question, answer) VALUES
(1, 'Is VidNova free to download and use?',
'<p>Yes — VidNova is completely free. There is no subscription, no premium tier required for core downloading features, and no hidden charges. We sustain the project through optional in-app tips, not by charging for the main feature.</p>'),

(1, 'Which platforms does VidNova support?',
'<p>VidNova currently supports over <strong>200 platforms</strong>, including:</p><ul><li>YouTube, YouTube Shorts &amp; Playlists</li><li>Instagram Reels, Stories, Posts &amp; IGTV</li><li>TikTok (with &amp; without watermark)</li><li>Facebook videos &amp; Watch</li><li>Twitter / X videos &amp; GIFs</li><li>WhatsApp Status</li><li>Dailymotion, Vimeo, Reddit, Pinterest, Twitch clips, and more.</li></ul>'),

(1, 'Is VidNova safe for my device?',
'<p>Yes, absolutely. Every APK release is scanned by three independent antivirus engines — <strong>CM Security</strong>, <strong>Lookout</strong>, and <strong>McAfee</strong> — before being made available. VidNova has never contained malware, spyware, or adware. We also do not collect personal data or require any account sign-up.</p>'),

(1, 'How do I install VidNova APK on Android?',
'<p>Installation takes about 2 minutes:</p><ol><li>Tap the <strong>Download Free</strong> button on this page.</li><li>Go to <strong>Settings → Security → Unknown Sources</strong> and enable it.</li><li>Open the APK file from your Downloads folder.</li><li>Tap <strong>Install</strong> and wait for it to complete.</li><li>Open VidNova, paste a video link, and tap <strong>Download</strong>.</li></ol>'),

(1, 'What video quality options are available?',
'<p>VidNova lets you choose your download quality before saving. Available options depend on the source platform, but typically include:</p><ul><li>144p, 240p, 360p (low data)</li><li>480p, 720p HD</li><li>1080p Full HD</li><li>1440p Quad HD and <strong>2160p / 4K Ultra HD</strong> (where the source supports it)</li></ul><p>You can also extract audio-only in MP3 format at up to 320 kbps.</p>'),

(1, 'Why is VidNova not on Google Play Store?',
'<p>Google Play Store has policies that restrict video downloading apps, particularly those that can download from third-party platforms like YouTube. Because VidNova supports a wide range of platforms, it cannot be listed on the Play Store. The APK is safe to install directly from this page — millions of users do so every day.</p>'),

(1, 'Can I download videos in the background?',
'<p>Yes! VidNova supports background downloading. Once you start a download, you can lock your screen, switch apps, or do anything else — the download continues uninterrupted. You will receive a notification when the download finishes. You can also queue multiple downloads and VidNova will process them one by one or simultaneously.</p>'),

(1, 'Does VidNova work on iOS (iPhone / iPad)?',
'<p>Currently, VidNova is <strong>Android only</strong>. An iOS version is in active development and is expected to launch in late 2025. Follow our social media channels (links in the footer) to be notified the moment the iOS version is available.</p>');

-- ── Screenshots (5 cards) ────────────────────────────────────
DELETE FROM homepage_screenshots WHERE homepage_id = 1;
INSERT INTO homepage_screenshots (homepage_id, image, heading, description, bg_color) VALUES
(1, '', 'Clean & Intuitive Interface', 'VidNova''s home screen is designed for speed. Paste any video link and hit Download — the app does the rest. No confusing menus or unnecessary steps.', '#1e1b4b'),
(1, '', 'Multi-Platform Download Hub', 'One app for everything. A single paste from YouTube, Instagram, TikTok, or Facebook is all it takes. VidNova auto-detects the platform and fetches available quality options instantly.', '#0f172a'),
(1, '', 'HD Quality Selector', 'Before downloading, choose your preferred quality — from data-saving 360p all the way to 4K Ultra HD. VidNova shows file size estimates so you always know what you''re getting.', '#1a1a2e'),
(1, '', 'Built-In Media Player', 'Watch your downloaded videos in VidNova''s built-in player. Supports fast-forward, rewind, speed control (0.5× to 2×), and subtitle loading from .SRT files.', '#0d0d18'),
(1, '', 'Download Manager', 'Manage all your downloads from one screen. Pause, resume, delete, or share files. Sort by date, size, or platform. A progress bar and speed indicator keep you informed.', '#14122a');

-- ── Social Media Links ───────────────────────────────────────
DELETE FROM social_media_links;
INSERT INTO social_media_links (platform, url, icon) VALUES
('Facebook',  'https://facebook.com/vidnovaapp',   ''),
('Twitter',   'https://twitter.com/vidnovaapp',    ''),
('Instagram', 'https://instagram.com/vidnovaapp',  ''),
('YouTube',   'https://youtube.com/@vidnovaapp',   ''),
('Telegram',  'https://t.me/vidnovaapp',           '');

-- ── Blog Posts (9 articles) ──────────────────────────────────
DELETE FROM blogs;

INSERT INTO blogs (title, slug, short_description, content, image, meta_title, meta_description) VALUES

-- Post 1
(
  'VidNova v4.2 Update: Everything New in the Latest Release',
  'vidnova-v4-2-update-whats-new',
  'VidNova v4.2 is here with support for Pinterest, Reddit, and Twitch, a 40% speed boost, and a beautiful dark mode. Here is everything that changed.',
  '<p>We are excited to announce the release of <strong>VidNova v4.2</strong> — our biggest update in six months. This release brings three new platform integrations, a completely revamped download engine, and the much-requested dark mode UI. Here is a full breakdown of every change.</p>

<h2>New Platform Support</h2>
<p>v4.2 adds native download support for:</p>
<ul>
  <li><strong>Pinterest</strong> — Download photos, video pins, and Story pins directly to your gallery.</li>
  <li><strong>Reddit</strong> — Save Reddit video posts (including RPAN streams) with audio intact.</li>
  <li><strong>Twitch Clips</strong> — Save any Twitch clip up to 60 seconds in 720p or 1080p.</li>
</ul>
<p>With these additions, VidNova now supports <strong>over 200 platforms</strong> — more than any other free Android downloader.</p>

<h2>40% Faster Downloads</h2>
<p>We completely rewrote the download engine in v4.2. The new multi-thread segmented downloader splits files into 8 simultaneous streams and reassembles them on your device. In our testing, average download speeds improved by 38–44% compared to v4.1, especially on high-speed Wi-Fi.</p>

<h2>Dark Mode UI</h2>
<p>After two years of user requests, VidNova finally has a dark mode. The new interface uses a deep navy and charcoal palette that is easy on the eyes, especially for night-time use. You can toggle between light and dark mode in Settings → Appearance.</p>

<h2>MP3 Quality Upgrade</h2>
<p>The MP3 extractor now supports <strong>320 kbps</strong> output (previously maxed at 192 kbps). Audio extracted from 1080p or 4K sources will now produce noticeably better quality, especially for music and podcasts.</p>

<h2>Bug Fixes</h2>
<ul>
  <li>Fixed Instagram Stories not downloading on Android 14.</li>
  <li>Fixed a crash when pausing downloads on low-RAM devices.</li>
  <li>Fixed TikTok watermark-removal not working for some region-specific accounts.</li>
  <li>Improved YouTube playlist handling — partial playlist downloads now resume correctly.</li>
</ul>

<p>Update to v4.2 now via the <a href="/download">download page</a>. As always, the update is free.</p>',
  '', 'VidNova v4.2 Update — New Features & Changes 2025', 'VidNova v4.2 adds Pinterest, Reddit, and Twitch support, 40% faster downloads, and a dark mode UI.'
),

-- Post 2
(
  'How to Download YouTube Videos with VidNova — Full Guide',
  'how-to-download-youtube-videos-vidnova',
  'A complete step-by-step guide to downloading YouTube videos, playlists, and Shorts in HD using VidNova for Android.',
  '<p>YouTube is the world''s largest video platform, but it restricts offline saving to Premium subscribers and even then only allows in-app playback. VidNova gives every user the ability to download any public YouTube video to their local storage — for free. Here is the complete guide.</p>

<h2>Before You Begin</h2>
<p>Make sure you have VidNova v4.0 or higher installed. Older versions may not work with YouTube''s latest API. <a href="/download">Download the latest version here</a>.</p>

<h2>Method 1: Paste the URL</h2>
<ol>
  <li>Open YouTube and find the video you want to save.</li>
  <li>Tap the <strong>Share</strong> button below the video and select <strong>Copy Link</strong>.</li>
  <li>Open VidNova — it will automatically detect the copied link and show a prompt.</li>
  <li>Tap <strong>Download</strong>, select your quality (up to 4K), and confirm.</li>
</ol>

<h2>Method 2: Use the Built-In Browser</h2>
<ol>
  <li>Open VidNova and tap the <strong>Browser</strong> tab.</li>
  <li>Navigate to youtube.com and find your video.</li>
  <li>Tap the <strong>Download</strong> button that appears at the bottom of the screen.</li>
  <li>Select quality and save.</li>
</ol>

<h2>Downloading YouTube Playlists</h2>
<p>VidNova can download entire playlists at once:</p>
<ol>
  <li>Copy the playlist URL (it looks like <code>youtube.com/playlist?list=...</code>).</li>
  <li>Paste into VidNova — it will detect the playlist automatically.</li>
  <li>Choose whether to download all videos or select individual ones.</li>
  <li>Set a quality preference that applies to all selected videos.</li>
</ol>
<p>Playlist downloads are queued automatically. You can monitor progress in the Download Manager tab.</p>

<h2>Downloading YouTube Shorts</h2>
<p>YouTube Shorts work exactly the same as regular videos. Copy the Short URL, paste into VidNova, choose quality (Shorts max out at 1080p), and download.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>"Video unavailable"</strong>: The video may be region-restricted or age-gated. Try logging into your YouTube account via VidNova''s browser.</li>
  <li><strong>"No download options found"</strong>: Update VidNova to the latest version. YouTube API changes sometimes break older builds.</li>
  <li><strong>Audio missing in downloaded video</strong>: This is rare but can happen with some 4K videos. Try downloading in 1080p instead.</li>
</ul>',
  '', 'How to Download YouTube Videos with VidNova', 'Step-by-step guide to downloading YouTube videos, Shorts, and playlists in HD using VidNova APK.'
),

-- Post 3
(
  'Download Instagram Reels, Stories & Posts with VidNova',
  'download-instagram-reels-stories-vidnova',
  'Learn how to save Instagram Reels, Stories, IGTV videos, and photo posts to your phone using VidNova — without any watermark.',
  '<p>Instagram does not offer a built-in download button for Reels, Stories, or regular posts. VidNova solves this problem by letting you save any public Instagram content directly to your Android device. Here is how.</p>

<h2>Downloading Instagram Reels</h2>
<ol>
  <li>Open Instagram and find the Reel you want to save.</li>
  <li>Tap the three-dot menu (⋯) on the Reel and select <strong>Copy Link</strong>.</li>
  <li>Open VidNova — the link is detected automatically.</li>
  <li>Tap <strong>Download</strong> and choose your quality (up to 1080p for Reels).</li>
</ol>
<p>VidNova downloads Reels <strong>without the Instagram watermark</strong> in the top-left corner — giving you a clean video file.</p>

<h2>Downloading Instagram Stories</h2>
<p>Stories are only available for 24 hours, so save them quickly:</p>
<ol>
  <li>Open the Story you want to save.</li>
  <li>Tap the three-dot menu and copy the link, or use VidNova''s built-in browser to navigate to the profile.</li>
  <li>In VidNova''s browser, go to the profile and tap the Story. A download button will appear.</li>
</ol>
<p>Note: Private account Stories require you to be following the account and logged in via VidNova''s built-in browser.</p>

<h2>Downloading Regular Posts and Videos</h2>
<ol>
  <li>On any Instagram video post, tap the three-dot menu and select <strong>Copy Link</strong>.</li>
  <li>Paste the link into VidNova.</li>
  <li>For photo carousels, VidNova will show all images and let you download them individually or all at once.</li>
</ol>

<h2>Downloading IGTV Videos</h2>
<p>IGTV videos are now part of regular Instagram posts. Copy the link from the post or the profile''s video tab and paste into VidNova — it works exactly like a regular video download.</p>

<h2>Tips for Best Results</h2>
<ul>
  <li>Always use the most recent VidNova version — Instagram frequently updates its API.</li>
  <li>For private accounts, log into Instagram through VidNova''s built-in browser.</li>
  <li>If a download fails, try again after a few minutes — Instagram sometimes rate-limits requests.</li>
</ul>',
  '', 'Download Instagram Reels & Stories with VidNova', 'Complete guide to saving Instagram Reels, Stories, IGTV, and posts to your Android device using VidNova.'
),

-- Post 4
(
  'VidNova vs VidMate: Which Video Downloader is Better in 2025?',
  'vidnova-vs-vidmate-comparison-2025',
  'A detailed head-to-head comparison of VidNova and VidMate — two of the most popular Android video downloaders. Which one should you use?',
  '<p>VidMate has been a dominant force in Android video downloading since 2013. VidNova is the newer challenger, launched in 2019. In 2025, which one is actually better? We tested both extensively to give you a definitive answer.</p>

<h2>Supported Platforms</h2>
<p><strong>VidNova: 200+ platforms</strong><br /><strong>VidMate: ~150 platforms</strong></p>
<p>VidNova pulls ahead here with support for newer platforms like Pinterest, Reddit, and Twitch Clips that VidMate does not yet cover natively. Both fully support YouTube, Instagram, TikTok, and Facebook.</p>

<h2>Download Speed</h2>
<p><strong>VidNova:</strong> Multi-thread engine (8 streams) — average 28 MB/s on 100 Mbps Wi-Fi.<br /><strong>VidMate:</strong> Single-thread with acceleration — average 19 MB/s on the same connection.</p>
<p>VidNova is approximately <strong>40% faster</strong> on high-speed connections. On slower mobile data, the gap narrows to about 15%.</p>

<h2>App Size & RAM Usage</h2>
<p><strong>VidNova:</strong> 11.8 MB APK, ~85 MB RAM during downloads.<br /><strong>VidMate:</strong> 26.4 MB APK, ~140 MB RAM during downloads.</p>
<p>VidNova is significantly lighter — important for budget Android devices with 2 GB RAM.</p>

<h2>Safety & Privacy</h2>
<p>Both apps are safe to download, but VidNova has an edge: it does not require account registration and collects zero personal data. VidMate requires an account for some features and has historically been bundled with ad SDKs that were flagged by some antivirus tools. VidNova uses a clean, minimal permission set.</p>

<h2>UI & User Experience</h2>
<p>VidMate has a more feature-rich interface with a built-in app store and news feed. VidNova''s interface is cleaner and more focused on the core task: downloading videos. If you just want a fast, no-fuss downloader, VidNova wins. If you want a mini app-store experience, VidMate may be preferable.</p>

<h2>Verdict</h2>
<p>For pure video downloading, <strong>VidNova is the better choice in 2025</strong>: faster downloads, lighter footprint, stronger privacy, and more platform support. VidMate is still a solid app, but it feels bloated compared to the lean, focused experience VidNova offers.</p>',
  '', 'VidNova vs VidMate 2025: Which is Better?', 'Head-to-head comparison of VidNova and VidMate. We tested both apps to find the best Android video downloader for 2025.'
),

-- Post 5
(
  'How to Download TikTok Videos Without Watermark Using VidNova',
  'download-tiktok-videos-no-watermark-vidnova',
  'Remove the TikTok watermark and save any video to your device in full quality with VidNova. Works for all TikTok content including private accounts you follow.',
  '<p>TikTok''s built-in save feature saves videos with a large watermark stamped across the frame — useful for sharing but ugly for personal use. VidNova lets you download TikTok videos in their original quality with no watermark at all. Here is how to do it.</p>

<h2>Method 1: Copy & Paste (Fastest)</h2>
<ol>
  <li>Open TikTok and find the video you want.</li>
  <li>Tap the <strong>Share</strong> icon (arrow pointing right).</li>
  <li>Tap <strong>Copy Link</strong>.</li>
  <li>Open VidNova — it detects the link automatically and shows a "Download TikTok" prompt.</li>
  <li>Select <strong>No Watermark</strong> from the quality options and tap <strong>Download</strong>.</li>
</ol>

<h2>Method 2: Built-In Browser</h2>
<ol>
  <li>Open VidNova and go to the <strong>Browser</strong> tab.</li>
  <li>Navigate to tiktok.com or the TikTok app link.</li>
  <li>Browse to the video — a floating download button appears.</li>
  <li>Tap it, select <strong>No Watermark + HD</strong>, and save.</li>
</ol>

<h2>Supported TikTok Content</h2>
<ul>
  <li>Regular TikTok videos (up to 1080p, no watermark)</li>
  <li>TikTok Live recordings (from your Following tab)</li>
  <li>TikTok Stories</li>
  <li>Duets and Stitch videos</li>
</ul>
<p>For private accounts you follow, log into TikTok via VidNova''s built-in browser first.</p>

<h2>Why Does TikTok Add a Watermark?</h2>
<p>TikTok adds watermarks to encourage creators to keep their content exclusive to the platform. When you download via VidNova, we request the original source file directly — bypassing the watermarked export version.</p>

<h2>Is It Legal to Download TikTok Videos?</h2>
<p>Downloading for personal, offline viewing is generally considered fair use in most jurisdictions. Do not redistribute downloaded content without the creator''s permission, and always credit the original creator if you repost content anywhere.</p>',
  '', 'How to Download TikTok Videos Without Watermark', 'Step-by-step guide to downloading TikTok videos without the watermark using VidNova APK for Android.'
),

-- Post 6
(
  'Fix VidNova Not Working — 10 Common Problems & Solutions',
  'fix-vidnova-not-working-common-problems',
  'VidNova failing to download? Here are the 10 most common problems users encounter and exactly how to fix each one.',
  '<p>VidNova works flawlessly for the vast majority of users, but occasionally something goes wrong. Here are the 10 most commonly reported issues and their step-by-step solutions.</p>

<h2>1. "No Download Options Found"</h2>
<p><strong>Cause:</strong> Your VidNova version is outdated and the platform changed its API.<br /><strong>Fix:</strong> Update to the latest version from the <a href="/download">download page</a>. Updates are pushed weekly to keep up with platform changes.</p>

<h2>2. Video Downloads Without Audio</h2>
<p><strong>Cause:</strong> YouTube and some other platforms serve video and audio as separate streams for 4K content.<br /><strong>Fix:</strong> In VidNova Settings → Download, enable <strong>"Merge Audio + Video"</strong>. This is off by default but fixes the issue for 95% of cases.</p>

<h2>3. Download Stuck at 99%</h2>
<p><strong>Cause:</strong> Usually a network interruption during the final merge step.<br /><strong>Fix:</strong> Long-press the stuck download and tap <strong>Resume</strong>. If it stays stuck, tap <strong>Cancel</strong> and restart the download — VidNova will resume from the last checkpoint.</p>

<h2>4. Instagram Stories Not Downloading</h2>
<p><strong>Cause:</strong> Instagram changed its Stories API in late 2024.<br /><strong>Fix:</strong> Update to VidNova v4.2 or higher. Also make sure you are logged into Instagram through VidNova''s built-in browser for private accounts.</p>

<h2>5. "Parse Error" During Installation</h2>
<p><strong>Cause:</strong> The APK file is corrupted or incompletely downloaded.<br /><strong>Fix:</strong> Delete the APK file and re-download it from this page. Do not download from third-party mirror sites — only use the official link.</p>

<h2>6. VidNova Crashes on Launch</h2>
<p><strong>Cause:</strong> Corrupted app cache or conflicting old installation.<br /><strong>Fix:</strong> Go to Settings → Apps → VidNova → Clear Cache. If the crash persists, uninstall and reinstall from the latest APK.</p>

<h2>7. Downloads Not Appearing in Gallery</h2>
<p><strong>Cause:</strong> Media scanner has not indexed the new files.<br /><strong>Fix:</strong> In VidNova Settings → Storage, tap <strong>Scan Media Library</strong>. Alternatively, restart your device.</p>

<h2>8. Very Slow Download Speed</h2>
<p><strong>Cause:</strong> Often a Wi-Fi or mobile data issue, not VidNova itself.<br /><strong>Fix:</strong> In VidNova Settings → Network, increase <strong>Download Threads</strong> to 8 (default is 4). Also try toggling aeroplane mode on/off to refresh your connection.</p>

<h2>9. Cannot Download Age-Restricted YouTube Videos</h2>
<p><strong>Cause:</strong> YouTube requires sign-in for age-restricted content.<br /><strong>Fix:</strong> Open VidNova''s built-in browser, log into YouTube, then paste the video link. VidNova will use your session cookies to access the video.</p>

<h2>10. "Unknown Sources" Keeps Disabling</h2>
<p><strong>Cause:</strong> Some Android skins (Samsung, Xiaomi) automatically disable Unknown Sources after each restart.<br /><strong>Fix:</strong> On modern Android (8+), you grant Unknown Sources permission per-app. Grant it to your file manager app rather than a system-wide toggle — this is more persistent.</p>',
  '', 'Fix VidNova Not Working — 10 Common Problems Solved', 'Having trouble with VidNova? Here are 10 common problems and their step-by-step solutions to get you downloading again.'
),

-- Post 7
(
  'Best Settings to Configure in VidNova for Maximum Download Speed',
  'best-vidnova-settings-maximum-speed',
  'Get the most out of VidNova by optimising these 8 settings. Users report 2–3× faster downloads after applying these tweaks.',
  '<p>VidNova''s default settings are conservative — designed to work reliably on all devices including budget phones with limited RAM. But if you have a modern mid-range or flagship Android, you can unlock much higher download speeds by tweaking a few settings. Here are the most impactful ones.</p>

<h2>1. Increase Download Threads to 8</h2>
<p><strong>Settings → Network → Download Threads → 8</strong></p>
<p>The default is 4 threads. Raising to 8 can roughly double speeds on fast Wi-Fi (50 Mbps+). On mobile data, keep it at 4–6 to avoid throttling.</p>

<h2>2. Enable Segmented Downloading</h2>
<p><strong>Settings → Network → Segmented Downloads → On</strong></p>
<p>This splits large files into segments downloaded simultaneously. It is the single biggest speed improvement for files over 100 MB.</p>

<h2>3. Set Maximum Simultaneous Downloads to 5</h2>
<p><strong>Settings → Download → Max Simultaneous Downloads → 5</strong></p>
<p>The default is 3. Raising to 5 lets VidNova process more items from your queue at the same time without overloading the network.</p>

<h2>4. Enable DNS over HTTPS</h2>
<p><strong>Settings → Network → DNS → Use DoH → On (Cloudflare 1.1.1.1)</strong></p>
<p>Encrypted DNS resolves platform URLs faster and avoids ISP-level throttling that affects some video platforms in certain regions.</p>

<h2>5. Disable Auto-Pause on Mobile Data</h2>
<p><strong>Settings → Network → Auto-Pause on Mobile → Off</strong></p>
<p>If you have an unlimited data plan, disable this to allow downloads to continue on 4G/5G without any interruption.</p>

<h2>6. Pre-Cache Quality Options</h2>
<p><strong>Settings → Download → Pre-fetch Quality Options → On</strong></p>
<p>With this enabled, VidNova fetches available quality options in the background as soon as you paste a link. By the time you tap Download, the options are already loaded — saving 2–4 seconds per download.</p>

<h2>7. Enable Hardware-Accelerated Merge</h2>
<p><strong>Settings → Advanced → Use Hardware Encoder for Merge → On</strong></p>
<p>On devices with a dedicated media encoder (most Snapdragon 6xx and higher), this hardware-accelerates the final merge step, cutting it from 10–15 seconds to under 3 seconds for 1080p files.</p>

<h2>8. Set Default Storage to Internal (not SD Card)</h2>
<p><strong>Settings → Storage → Default Location → Internal Storage</strong></p>
<p>Writing to internal storage is 3–5× faster than SD cards on most devices. Only use SD card if you are critically low on internal storage.</p>

<p>Apply all 8 settings and restart VidNova. Most users report download speeds <strong>2–3× higher</strong> than the default configuration.</p>',
  '', 'Best VidNova Settings for Maximum Download Speed', 'Optimise these 8 VidNova settings to get 2-3x faster download speeds on your Android device.'
),

-- Post 8
(
  'Is VidNova Safe? A Full Security Analysis',
  'is-vidnova-safe-security-analysis',
  'We break down exactly how VidNova handles security, what permissions it needs and why, and what our third-party antivirus audits found.',
  '<p>When installing an APK from outside the Google Play Store, the number one concern is safety. Is the app malware-free? Does it steal your data? Does it mine cryptocurrency in the background? We answer all of these questions for VidNova with hard evidence.</p>

<h2>Third-Party Antivirus Scan Results</h2>
<p>Every VidNova release is uploaded to VirusTotal (which runs 71 antivirus engines simultaneously) before publication. VidNova v4.2 results:</p>
<ul>
  <li><strong>71 / 71 engines:</strong> Clean</li>
  <li><strong>Malware:</strong> None detected</li>
  <li><strong>Spyware:</strong> None detected</li>
  <li><strong>Adware:</strong> None detected</li>
  <li><strong>Cryptominer:</strong> None detected</li>
</ul>
<p>We also submit every release to CM Security, Lookout, and McAfee individually and publish their certificates on our GitHub.</p>

<h2>Permissions Analysis</h2>
<p>VidNova requests only 4 permissions — far fewer than most apps of its type:</p>
<ul>
  <li><strong>INTERNET</strong>: Required to download video files.</li>
  <li><strong>WRITE_EXTERNAL_STORAGE</strong>: Required to save files to your device.</li>
  <li><strong>READ_EXTERNAL_STORAGE</strong>: Required to display your download library.</li>
  <li><strong>FOREGROUND_SERVICE</strong>: Required to continue downloads when the app is in the background.</li>
</ul>
<p>We do NOT request: Location, Camera, Microphone, Contacts, SMS, or any other sensitive permission.</p>

<h2>Data Collection</h2>
<p>VidNova collects anonymous, aggregated usage statistics (which features are used most) via Firebase Analytics. All data is anonymised — it is impossible to trace analytics events back to any individual user. We do not collect:</p>
<ul>
  <li>Your name, email, or phone number (no account required)</li>
  <li>Your location</li>
  <li>Your download history</li>
  <li>Any content from your device</li>
</ul>

<h2>Open Source Components</h2>
<p>VidNova''s download engine is built on open-source libraries (<code>aria2</code>, <code>yt-dlp</code> derivatives) that are publicly auditable. Our core extraction logic is proprietary but the underlying transport layer is fully open source.</p>

<h2>Conclusion</h2>
<p>VidNova is safe. It has a clean antivirus record across 71 engines, minimal permissions, no personal data collection, and no account requirement. If you are downloading from the official link on this page, you are getting the exact same binary that passed our security audits.</p>',
  '', 'Is VidNova Safe? Complete Security Analysis 2025', 'A thorough security analysis of VidNova APK — antivirus results, permissions breakdown, data collection practices, and our final verdict.'
),

-- Post 9
(
  'Top 10 Video Downloader Apps for Android in 2025 (Ranked)',
  'top-10-video-downloader-apps-android-2025',
  'We tested 10 of the most popular Android video downloaders so you do not have to. Here is our definitive ranking for 2025.',
  '<p>There are dozens of Android video downloader apps on the market. We spent four weeks testing the top 10 across 15 different metrics — speed, platform support, safety, UI quality, and battery usage — to produce this definitive ranking.</p>

<h2>#1 — VidNova (Score: 9.4/10)</h2>
<p>VidNova tops our list for the third consecutive year. It combines the broadest platform support (200+ sites), the fastest download engine, the smallest footprint (11.8 MB), and a spotless security record. The new dark mode in v4.2 is a welcome UI refresh. Only downside: Android-only for now.</p>

<h2>#2 — VidMate (Score: 8.1/10)</h2>
<p>VidMate is still a strong performer with a built-in app store and solid YouTube/Instagram support. However, it is bulkier (26 MB), slower, and requires an account for advanced features. It also bundles ad SDKs that some users find intrusive.</p>

<h2>#3 — SnapTube (Score: 7.8/10)</h2>
<p>SnapTube has a polished UI and good YouTube support, but its platform coverage is narrower. It also monetises heavily through ads within the app, which reduces the experience quality.</p>

<h2>#4 — YTD Video Downloader (Score: 7.2/10)</h2>
<p>A solid choice for YouTube-only users. YTD is simple, reliable, and has a good batch download feature. However, it lacks support for Instagram, TikTok, and most non-YouTube platforms.</p>

<h2>#5 — InShot Downloader (Score: 7.0/10)</h2>
<p>Great for Instagram and TikTok content specifically. InShot Downloader is lightweight and easy to use, but falls behind for YouTube playlists and multi-platform users.</p>

<h2>#6 — AllSave (Score: 6.8/10)</h2>
<p>A browser extension-style downloader that works well but requires more manual steps than the top apps. Good as a backup tool.</p>

<h2>#7 — Videoder (Score: 6.5/10)</h2>
<p>Once a top-5 app, Videoder has not been updated in over 8 months. It still works for basic YouTube downloads but fails frequently on Instagram and TikTok due to outdated API handling.</p>

<h2>#8 — TubeMate (Score: 6.3/10)</h2>
<p>A YouTube-focused classic. Reliable for standard downloads but the UI feels dated and it offers no support for any non-YouTube platform.</p>

<h2>#9 — DVGet (Score: 5.9/10)</h2>
<p>Covers a decent range of platforms but has significant performance issues on Android 13+. Crashes were frequent during our testing on mid-range devices.</p>

<h2>#10 — AnyVideo Converter (Score: 5.5/10)</h2>
<p>Strong video conversion features (MP4, AVI, MKV) but weak downloading capabilities. More useful as a converter than a downloader.</p>

<h2>Our Recommendation</h2>
<p>For most users, <strong>VidNova is the clear choice</strong>. For those who want a feature-rich app-store experience alongside downloading, VidMate is a reasonable second option. Everyone else on this list has notable limitations that make them difficult to recommend as a primary app in 2025.</p>',
  '', 'Top 10 Video Downloader Apps for Android 2025 — Ranked & Reviewed', 'We tested 10 Android video downloader apps. Here is our definitive ranking with scores, pros, cons, and a final recommendation.'
);

-- ── Download Slug ────────────────────────────────────────────
INSERT INTO download_slugs (slug, is_current) VALUES ('download', 1) ON CONFLICT (slug) DO NOTHING;

-- ── Admin User: admin / admin123 ─────────────────────────────
INSERT INTO admin_users (username, password)
VALUES ('admin', '0192023a7bbd73250516f069df18b500')
ON CONFLICT DO NOTHING;
