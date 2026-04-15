import { useState } from 'react';
import { AuthState } from './types';
import { LoginPage } from './components/LoginPage';
import { ChatPage } from './components/ChatPage';

const SESSION_KEY = 'ybet_auth';

function loadAuth(): AuthState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthState;
  } catch {
    return null;
  }
}

function saveAuth(auth: AuthState) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(auth));
}

function clearAuth() {
  sessionStorage.removeItem(SESSION_KEY);
}

export default function App() {
  const [auth, setAuth] = useState<AuthState | null>(loadAuth);

  function handleLogin(a: AuthState) {
    saveAuth(a);
    setAuth(a);
  }

  function handleLogout() {
    clearAuth();
    setAuth(null);
  }

  if (!auth) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <ChatPage auth={auth} onLogout={handleLogout} />;
}
