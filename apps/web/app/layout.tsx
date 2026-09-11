import type { ReactNode } from 'react';

export const metadata = {
  title: 'NovaWing Desk',
  description: 'Post-run operations for NovaWing.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
