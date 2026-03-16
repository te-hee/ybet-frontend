import React from 'react';
import { AuthProvider, useAuth } from './authContext.tsx';
import Login from './assets/components/Login.tsx';
import Chat from './assets/components/Chat.tsx';
import Input from './assets/components/Input.tsx';

import './App.css'


const AppContent: React.FC = () => {
    const { token } = useAuth();

    return (
        <main>
            {!token ? (
                <Login />
            ) : (
                <div style={{
                    backgroundColor: 'red'
                }}>
                    <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                        <Chat limit={20} />
                    </div>
                    <Input />
                </div>
            )}
        </main>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}