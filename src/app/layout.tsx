import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/components/layout/ReduxProvider';
import { Header } from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WeatherAQI — Live Forecast & Air Quality Dashboard',
  description: 'Real-time weather forecasts, AQI, and air quality data for cities worldwide. Powered by Open-Meteo.',
  keywords: ['weather', 'AQI', 'air quality', 'forecast', 'PM2.5', 'open-meteo'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen antialiased`}>
        <ReduxProvider>
          <div className="relative min-h-screen">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl" />
            </div>

            <Header />
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
              {children}
            </main>

            <footer className="relative z-10 border-t border-white/5 mt-16 py-6 text-center">
              <p className="text-white/20 text-xs">
                Powered by{' '}
                <a href="https://open-meteo.com" className="text-white/40 hover:text-white/60 transition-colors underline" target="_blank" rel="noopener noreferrer">
                  Open-Meteo
                </a>{' '}
                &{' '}
                <a href="https://nominatim.org" className="text-white/40 hover:text-white/60 transition-colors underline" target="_blank" rel="noopener noreferrer">
                  Nominatim
                </a>
                {' '}— Zero API keys required.
              </p>
            </footer>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
