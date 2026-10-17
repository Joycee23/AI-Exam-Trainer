import { createHash, randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'ai_exam_visitor';
const VISITOR_SET_KEY = 'ai-exam-trainer:unique-visitors:v1';

type UpstashCommandResult = { result: number | string | null };

export async function GET() {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/+$/, '');
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    return NextResponse.json({ uniqueVisitors: null, configured: false }, { headers: { 'Cache-Control': 'no-store' } });
  }

  const cookieStore = await cookies();
  const currentVisitorId = cookieStore.get(COOKIE_NAME)?.value;
  const visitorId = currentVisitorId || randomUUID();
  const visitorHash = createHash('sha256').update(visitorId).digest('hex');

  try {
    const result = await fetch(`${redisUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['SADD', VISITOR_SET_KEY, visitorHash],
        ['SCARD', VISITOR_SET_KEY],
      ]),
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });

    if (!result.ok) {
      return visitorResponse({ uniqueVisitors: null, configured: true, available: false }, currentVisitorId ? undefined : visitorId, 503);
    }

    const commands = await result.json() as UpstashCommandResult[];
    const count = Number(commands[1]?.result);
    if (!Number.isSafeInteger(count) || count < 0) {
      return visitorResponse({ uniqueVisitors: null, configured: true, available: false }, currentVisitorId ? undefined : visitorId, 503);
    }

    return visitorResponse({ uniqueVisitors: count, configured: true, available: true }, currentVisitorId ? undefined : visitorId);
  } catch {
    return visitorResponse({ uniqueVisitors: null, configured: true, available: false }, currentVisitorId ? undefined : visitorId, 503);
  }
}

function visitorResponse(
  payload: { uniqueVisitors: number | null; configured: boolean; available?: boolean },
  visitorId?: string,
  status = 200,
) {
  const response = NextResponse.json(payload, { status, headers: { 'Cache-Control': 'no-store' } });
  if (visitorId) {
    response.cookies.set(COOKIE_NAME, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10,
    });
  }
  return response;
}
