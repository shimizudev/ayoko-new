import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import NavBar from '@/components/base/navbar';
import Footer from '@/components/base/footer';
import TanstackProvider from '@/providers/tanstack-provider';
import { JotaiProviders } from '@/providers/jotai-providers';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Ayoko - Watch Anime For Free In HD without any ads or trackers',
  description: 'Watch Anime For Free In HD without any ads or trackers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackProvider>
          <JotaiProviders>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NavBar />
              <main>{children}</main>
              <Footer />
            </ThemeProvider>
          </JotaiProviders>
        </TanstackProvider>
      </body>
    </html>
  );
}
