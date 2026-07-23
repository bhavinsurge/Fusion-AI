const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const TOKEN_KEY = 'fusion_access_token';
const USER_KEY = 'fusion_user';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export type ConversationSummary = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  selectedBy?: string | null;
  createdAt: string;
};

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setSession(accessToken: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (auth) {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      (data && (data.message as string | string[])) ||
      'Request failed';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return data as T;
}

export function register(input: {
  email: string;
  password: string;
  name?: string;
}) {
  return apiFetch<{ accessToken: string; user: AuthUser }>(
    '/auth/register',
    { method: 'POST', body: JSON.stringify(input) },
    false,
  );
}

export function login(input: { email: string; password: string }) {
  return apiFetch<{ accessToken: string; user: AuthUser }>(
    '/auth/login',
    { method: 'POST', body: JSON.stringify(input) },
    false,
  );
}

export function fetchMe() {
  return apiFetch<AuthUser>('/auth/me');
}

export function listConversations() {
  return apiFetch<ConversationSummary[]>('/conversations');
}

export function getConversation(id: string) {
  return apiFetch<{
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messages: ChatMessage[];
  }>(`/conversations/${id}`);
}

export function clearConversations() {
  return apiFetch<{ success: boolean }>('/conversations', {
    method: 'DELETE',
  });
}

export function sendChat(message: string, conversationId?: string | null) {
  return apiFetch<{
    conversationId: string;
    prompt: string;
    answer: string;
    selectedBy?: string | null;
    error?: string;
  }>('/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      ...(conversationId ? { conversationId } : {}),
    }),
  });
}
