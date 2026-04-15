import { API_BASE } from './config';
import { Message } from './types';

// ─── helpers ──────────────────────────────────────────────────────────────────

async function handle(res: Response): Promise<Response> {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch { /* ignore */ }
    throw new Error(msg);
  }
  return res;
}

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// ─── auth ─────────────────────────────────────────────────────────────────────

export async function login(username: string): Promise<string> {
  const res = await handle(
    await fetch(`${API_BASE}/api/v1/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    }),
  );
  const data = await res.json();
  return data.token as string;
}

// ─── messages ─────────────────────────────────────────────────────────────────

export async function getMessages(token: string, limit = 100): Promise<Message[]> {
  const res = await handle(
    await fetch(`${API_BASE}/api/v1/messages?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
  const data = await res.json();
  return (data.messages ?? []) as Message[];
}

export async function sendMessage(
  token: string,
  content: string,
): Promise<{ message_id: string; timestamp: number }> {
  const res = await handle(
    await fetch(`${API_BASE}/api/v1/messages`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ content }),
    }),
  );
  return res.json();
}

export async function editMessage(
  token: string,
  messageId: string,
  content: string,
): Promise<void> {
  await handle(
    await fetch(`${API_BASE}/api/v1/messages/${messageId}`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ content }),
    }),
  );
}

export async function deleteMessage(token: string, messageId: string): Promise<void> {
  await handle(
    await fetch(`${API_BASE}/api/v1/messages/${messageId}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    }),
  );
}

// ─── JWT decode (client-side, no verification) ────────────────────────────────

export function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const part = token.split('.')[1];
    // base64url → base64
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b64));
  } catch {
    return {};
  }
}

export function extractUserId(token: string): string {
  const p = decodeJwtPayload(token);
  // Try common field names used by go-jwt and similar libraries
  return (p['user_id'] ?? p['sub'] ?? p['id'] ?? '') as string;
}
