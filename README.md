# YBET Frontend =^w^=

React + TypeScript frontend for the **Ybet** end-to-end encrypted chat system.

## Stack

- **Vite** — build tool
- **React 18** + **TypeScript**
- **IBM Plex Mono** + **Syne** — fonts
- Plain CSS (no CSS-in-JS, no Tailwind)

## Setup

```bash
cp .env.example .env
# Edit .env to point at your gateway & websocket host

npm install
npm run dev      # dev server on :3000
npm run build    # production build → dist/
npm run preview  # preview production build
```

## Environment variables

| Variable        | Default                  | Description                        |
|-----------------|--------------------------|------------------------------------|
| `VITE_API_BASE` | `http://localhost:8080`  | Gateway REST base URL              |
| `VITE_WS_BASE`  | `ws://localhost:8081`    | WebSocket base URL                 |

## WebSocket note

Browsers cannot send custom HTTP headers over WebSocket connections.
The JWT is forwarded as a `?token=<jwt>` query parameter instead of
the `Authorization: Bearer` header. Make sure the gateway handles this.

## Features

- Login with username → JWT
- Real-time chat via WebSocket (auto-reconnect every 3s)
- Message history (GET /messages?limit=100)
- Send messages (Enter to send, Shift+Enter for newline)
- Edit your own messages (hover → click **edit**)
- Delete your own messages (hover → click **del**)
- Live online users sidebar
- System messages shown inline
- Session persisted in `sessionStorage` (cleared on tab close)

## Project structure

```
src/
├── main.tsx
├── App.tsx                  # auth state, session persistence
├── config.ts                # env vars
├── api.ts                   # all REST calls + JWT decode
├── types.ts                 # shared TypeScript types
├── index.css                # global styles + design tokens
├── hooks/
│   └── useWebSocket.ts      # WS hook with auto-reconnect
└── components/
    ├── LoginPage.tsx
    ├── ChatPage.tsx          # main chat, state management
    ├── MessageItem.tsx       # single message with edit/delete
    └── UserList.tsx          # online users sidebar
```
