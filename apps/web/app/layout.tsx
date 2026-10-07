import type { ReactNode } from 'react';
import Link from 'next/link';
import './styles.css';

export const metadata = {
  title: 'NovaWing 控制台',
  description: 'NovaWing 的配置、评测与管理控制台。',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <aside>
          <Link className="brand" href="/models">NovaWing 控制台</Link>
          <p className="section-label">配置</p>
          <nav>
            <Link href="/models">模型</Link>
            <Link href="/presets">任务预设</Link>
          </nav>
          <p className="section-label">工程证据</p>
          <nav>
            <Link href="/eval">职业评测</Link>
          </nav>
        </aside>
        <main>{children}</main>
      </body>
    </html>
  );
}
