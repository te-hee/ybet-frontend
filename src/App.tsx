import React from 'react';
import { AuthProvider, useAuth } from './authContext.tsx';
import Login from './components/Login.tsx';
import ChatPage from './components/ChatPage.tsx';
import Input from './components/Input.tsx';

import './App.css'
import ActiveUsers from "./components/ActiveUsers.tsx";


const AppContent: React.FC = () => {
    const { token } = useAuth();

    return (
        <main>
            {!token ? (
                <Login />
            ) : (
                <>
                    <div className='left'>
                        <ChatPage limit={20}/>
                        <Input/>
                    </div>
                    <div className='right'>
                        <ActiveUsers users={['ja', 'on']}></ActiveUsers>
                    </div>
                </>
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