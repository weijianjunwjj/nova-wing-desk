import type { ReactNode } from 'react';
import Link from 'next/link';
import './styles.css';

export const metadata = {
  title: 'NovaWing Desk',
  description: 'Configuration and management plane for NovaWing.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <aside>
          <Link className="brand" href="/models">NovaWing Desk</Link>
          <p className="section-label">Configuration</p>
          <nav>
            <Link href="/models">Models</Link>
            <Link href="/presets">Presets</Link>
          </nav>
        </aside>
        <main>{children}</main>
      </body>
    </html>
  );
}
