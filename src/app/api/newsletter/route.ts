import { NextResponse } from 'next/server';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Server-only Brevo boundary. Credentials never reach the browser. */
export async function POST(request: Request) {
  let body: { email?: unknown; consent?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL.test(email) || body.consent !== true) {
    return NextResponse.json({ error: 'invalid_subscription' }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!apiKey || !Number.isInteger(listId) || listId <= 0) {
    return NextResponse.json({ error: 'newsletter_not_configured' }, { status: 503 });
  }

  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
    cache: 'no-store',
  });

  if (!response.ok) return NextResponse.json({ error: 'newsletter_provider_error' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
