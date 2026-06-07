import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/components/layout/ReduxProvider';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Header } from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

// Runs before React hydrates — prevents flash of wrong theme
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`;

export const metadata: Metadata = {
  title: 'WeatherAQI — Live Forecast & Air Quality',
  description: 'Real-time weather forecasts and air quality data for cities worldwide. No API keys needed.',
  keywords: ['weather', 'AQI', 'air quality', 'forecast', 'PM2.5'],
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeProvider>
            <div className="relative min-h-screen flex flex-col">
              {/* Ambient blobs — dark mode only, hidden in light */}
              <div className="fixed inset-0 pointer-events-none overflow-hidden dark:block hidden">
                <div className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-indigo-600/8 rounded-full blur-3xl" />
              </div>

              <Header />

              <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {children}
              </main>

              <footer className="relative z-10 mt-auto border-t py-5 text-center border-[var(--border)]">
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>
                  Built by{' '}
                  <a
                    href="https://tanmaydevrani.github.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline transition-colors"
                    style={{ color: 'var(--text-2)' }}
                  >
                    Tanmay Devrani
                  </a>
                  {' '}· Powered by{' '}
                  <a
                    href="https://open-meteo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline transition-colors"
                    style={{ color: 'var(--text-3)' }}
                  >
                    Open-Meteo
                  </a>
                </p>
              </footer>
            </div>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
