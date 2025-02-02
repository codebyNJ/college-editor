import type { Metadata } from 'next';
import './root.css';

export const metadata: Metadata = {
  title: 'PicFus.IO',
  description: 'Collage Editor App'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh' }}>{children}</body>
    </html>
  );
}
