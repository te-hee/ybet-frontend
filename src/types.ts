// ─── REST types ──────────────────────────────────────────────────────────────

export interface Message {
  message_id: string;
  user_id: string;
  username: string;
  content: string;
  timestamp: number;
}

export interface AuthState {
  token: string;
  username: string;
  user_id: string;
}

// ─── WebSocket envelope ───────────────────────────────────────────────────────

export type WSMessageType =
  | 'userMessage'
  | 'editMessage'
  | 'deleteMessage'
  | 'systemMessage'
  | 'userListUpdate';

export type WSEnvelope =
  | { type: 'userMessage'; payload: UserMessagePayload }
  | { type: 'editMessage'; payload: EditMessagePayload }
  | { type: 'deleteMessage'; payload: DeleteMessagePayload }
  | { type: 'systemMessage'; payload: SystemMessagePayload }
  | { type: 'userListUpdate'; payload: UserListUpdatePayload };

// ─── WebSocket payload shapes ─────────────────────────────────────────────────

export interface UserMessagePayload {
  message_id: string;
  user_id: string;
  username: string;
  content: string;
  timestamp: number;
}

export interface EditMessagePayload {
  message_id: string;
  content: string;
}

export interface DeleteMessagePayload {
  message_id: string;
}

export interface SystemMessagePayload {
  content: string;
}

export interface UserListUpdatePayload {
  action: 'connect' | 'disconnect';
  user_id: string;
  username: string;
}

// ─── UI types ─────────────────────────────────────────────────────────────────

export interface OnlineUser {
  user_id: string;
  username: string;
}

// A chat item is either a real message or a system notice
export type ChatItem =
  | { kind: 'message'; data: Message }
  | { kind: 'system'; id: string; content: string };
