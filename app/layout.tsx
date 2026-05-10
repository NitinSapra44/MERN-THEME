import type { Metadata } from 'next';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: 'AppNova',
  description: 'The ultimate free app download platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
