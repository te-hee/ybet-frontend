import { useState, FormEvent } from 'react';
import { login } from '../api';
import { AuthState } from '../types';
import { extractUserId } from '../api';
import '../styles/login.css';

interface Props {
  onLogin: (auth: AuthState) => void;
}

export function LoginPage({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const name = username.trim();
    if (!name) return;

    setLoading(true);
    setError('');

    try {
      const token = await login(name);
      const user_id = extractUserId(token);
      onLogin({ token, username: name, user_id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed :(');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-root">
      <div className="login-grid-bg" />
      <div className="login-glow" />

      <div className="login-card">
        <div className="login-logo">YBET</div>
        <div className="login-tagline">
          yapping but <em>end-to-end</em> encrypted :3
        </div>

        <form onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="username">
            username
          </label>
          <input
            id="username"
            className="login-input"
            type="text"
            placeholder="type your name..."
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="off"
            autoFocus
            disabled={loading}
            maxLength={32}
          />

          {error && <div className="login-error">⚠ {error}</div>}

          <button className="login-btn" type="submit" disabled={loading || !username.trim()}>
            {loading ? 'connecting...' : 'Log in'}
          </button>
        </form>

        <div className="login-credits">
          built with &lt;3 by<br />
          <span>Adas :*</span> · <span>hipo :333</span> · <span>Dawid =^w^=</span> · <span>ishu uwu</span>
        </div>
      </div>
    </div>
  );
}
