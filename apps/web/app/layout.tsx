import type { ReactNode } from 'react';
import Link from 'next/link';
import './styles.css';

export const metadata = {
  title: 'NovaWing Desk',
  description: 'NovaWing 工程评测与证据控制台。',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <aside>
          <Link className="brand" href="/eval">NovaWing Desk</Link>
          <p className="brand-subtitle">Evaluation & Evidence</p>
          <p className="section-label">工程证据</p>
          <nav>
            <Link href="/eval">工程评测</Link>
          </nav>
        </aside>
        <main>{children}</main>
      </body>
    </html>
  );
}
