import type { Metadata } from 'next';
import './globals.css';

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export const metadata: Metadata = {
  title: 'My Personal Agent',
  description: 'A personal AI-style agent that orchestrates custom functions for your workflow.'
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
