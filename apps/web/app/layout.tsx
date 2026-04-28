import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import FloatingChat from '@/components/ui/organisms/FloatingChat/FloatingChat';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VitalPath — Portal Médico',
  description: 'Portal médico para profesionales de la salud',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-brand-background text-brand-text-primary">
        <ReactQueryProvider>
          {children}
          <FloatingChat />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
