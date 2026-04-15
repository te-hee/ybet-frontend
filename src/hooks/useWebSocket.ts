import { useEffect, useRef, useCallback, useState } from 'react';
import { WSEnvelope } from '../types';
import { WS_BASE } from '../config';

export type WSStatus = 'connecting' | 'open' | 'closed';

/**
 * Manages a WebSocket connection with auto-reconnect.
 *
 * Token flow:
 *  1. We open  ws://<host>/ws-proxy  with the JWT as the WebSocket subprotocol.
 *  2. The Vite proxy intercepts the upgrade, reads Sec-WebSocket-Protocol,
 *     sets Authorization: Bearer <token> on the forwarded request, then
 *     connects to ws://localhost:8081/ws — which expects the standard header.
 */
export function useWebSocket(
  token: string | null,
  onMessage: (msg: WSEnvelope) => void,
) {
  const [status, setStatus] = useState<WSStatus>('closed');
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  const retryRef = useRef<ReturnType<typeof setTimeout>>();
  const isMounted = useRef(true);

  // Keep onMessage stable so we don't restart the connection on each render
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);

  const connect = useCallback(() => {
    if (!token || !isMounted.current) return;

    setStatus('connecting');

    // Browsers can't send custom headers on WebSocket upgrade requests.
    // We pass the JWT as the Sec-WebSocket-Protocol value instead.
    // The Vite proxy (proxyReqWs) picks it up, sets Authorization: Bearer <token>,
    // and removes the protocol header before forwarding to the gateway.
    const ws = new WebSocket(`${WS_BASE}/ws-proxy`, [token]);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!isMounted.current) { ws.close(); return; }
      setStatus('open');
    };

    ws.onmessage = (ev: MessageEvent) => {
      try {
        const msg = JSON.parse(ev.data as string) as WSEnvelope;
        onMessageRef.current(msg);
      } catch (e) {
        console.warn('[ws] Failed to parse message', e);
      }
    };

    ws.onclose = () => {
      if (!isMounted.current) return;
      setStatus('closed');
      retryRef.current = setTimeout(connect, 3000);
    };

    ws.onerror = () => {
      // onclose fires immediately after, which handles reconnect
    };
  }, [token]);

  useEffect(() => {
    isMounted.current = true;
    connect();
    return () => {
      isMounted.current = false;
      clearTimeout(retryRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { status };
}
