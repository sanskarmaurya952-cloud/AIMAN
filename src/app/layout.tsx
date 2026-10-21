import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AIMAN - Medicine Price Comparison & Jan Aushadhi Discovery',
  description:
    'Compare branded medicine prices with government-backed Jan Aushadhi generic alternatives. Verified data sourced from PMBI & NPPA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-surface-50 text-slate-900`}>
        <AuthProvider>
          <DisclaimerBanner />
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
