import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const endpoint = () => `${process.env.NOVAWING_DESK_API_URL ?? 'http://127.0.0.1:3001'}/config/model-routing`;

async function proxy(method: 'GET' | 'PUT', body?: string) {
  try {
    const response = await fetch(endpoint(), {
      method,
      ...(body === undefined ? {} : { body, headers: { 'content-type': 'application/json' } }),
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ message: '无法连接本机 Desk API，请检查 API 和数据库。' }, { status: 502 });
  }
}

export async function GET() {
  return proxy('GET');
}

export async function PUT(request: NextRequest) {
  // The v0.1 UI is local-only; reject cross-site browser writes.
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ message: 'Origin 不匹配' }, { status: 403 });
  }
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return NextResponse.json({ message: '需要 JSON 请求' }, { status: 415 });
  }
  const body = await request.text();
  if (body.length > 16_384) {
    return NextResponse.json({ message: '配置过大' }, { status: 413 });
  }
  return proxy('PUT', body);
}
