// All traffic goes through the Vite dev proxy (see vite.config.ts).
// REST:      /api/...  → http://localhost:8080/...
// WebSocket: /ws-proxy → ws://localhost:8081/ws
//
// In production point these at your actual hosts via env vars.
export const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? '';

// Derive WS base from the current page origin so it works behind ngrok/proxies.
// https://abc.ngrok-free.app → wss://abc.ngrok-free.app
const pageOrigin = typeof window !== 'undefined'
  ? window.location.origin
  : 'http://localhost:3000';
export const WS_BASE = (import.meta.env.VITE_WS_BASE as string | undefined)
  ?? pageOrigin.replace(/^http/, 'ws');
