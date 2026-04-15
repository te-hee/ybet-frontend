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

export type WSMessageType = 'userMessage' | 'editMessage' | 'deleteMessage' | 'systemMessage' | 'userListUpdate';

export interface WSEnvelope {
    type: WSMessageType;
    payload: Record<string, unknown>;
}

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

export interface OnlineUser {
    user_id: string;
    username: string;
}

export type ChatItem =
    | { kind: 'message'; data: Message }
    | { kind: 'system'; id: string; content: string };
