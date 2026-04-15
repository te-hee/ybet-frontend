import { useEffect, useRef, useCallback, useState } from 'react';
import type {WSEnvelope} from '../types.ts';
import { WS_BASE } from '../config';

export type WSStatus = 'connecting' | 'open' | 'closed';

export function useWebSocket(
    token: string | null,
    onMessage: (msg: WSEnvelope) => void,
) {
    const [status, setStatus] = useState<WSStatus>('closed');
    const wsRef = useRef<WebSocket | null>(null);
    const onMessageRef = useRef(onMessage);
    const retryRef = useRef<ReturnType<typeof setTimeout>>();
    const isMounted = useRef(true);

    useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);

    const connect = useCallback(() => {
        if (!token || !isMounted.current) return;

        setStatus('connecting');

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
