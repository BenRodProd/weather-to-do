import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Weather To Do',
  description: 'to do list based on weather'
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
