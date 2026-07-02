import './globals.css';

export const metadata = {
  title: 'Teknoloji ve Yenilik Zirvesi',
  description: 'Teknoloji ve Yenilik Zirvesi resmi web sitesi',
  icons: {
    icon: '/favicon-peak.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" data-theme="light" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
