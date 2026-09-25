import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'NovaWing Desk',
  description: 'NovaWing 本机后台配置中心',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
