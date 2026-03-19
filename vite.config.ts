import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        allowedHosts: [
            '8a95bc6fb80f.ngrok-free.app',
        ],
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
            '/ws-proxy': {
                target: 'ws://localhost:8081',
                ws: true,
                rewrite: (path) => path.replace(/^\/ws-proxy/, '/ws'),
                configure: (proxy, _options) => {
                    proxy.on('proxyReqWs', (proxyReq, req, socket, options, head) => {
                        const token = req.headers['sec-websocket-protocol'];

                        if (token) {
                            proxyReq.setHeader('Authorization', `Bearer ${token}`);
                            proxyReq.removeHeader('sec-websocket-protocol');
                        }
                    });
                }
            }
        }
    }
});