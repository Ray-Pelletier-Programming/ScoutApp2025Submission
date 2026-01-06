import type { Metadata } from 'next';
import './globals.css';
import { DaisyScoutNavBar } from './ui/navigation';
import { DaisyScoutingAppSettingsProvider } from './ui/context/settings-context';

export const metadata: Metadata = {
  title: 'Daisy Scout',
  description: 'Team 341 Miss Daisy Scouting App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <DaisyScoutingAppSettingsProvider>
          <DaisyScoutNavBar />
          {children}
        </DaisyScoutingAppSettingsProvider>
      </body>
    </html>
  );
}
