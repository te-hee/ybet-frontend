import React from 'react';
import { AuthProvider, useAuth } from './authContext.tsx';
import Login from './assets/components/Login.tsx';
import Chat from './assets/components/Chat.tsx';
import Input from './assets/components/Input.tsx';


// We create a separate component to consume the context
// because useAuth() must be called inside a descendant of AuthProvider
const AppContent: React.FC = () => {
    const { token } = useAuth();

    return (
        <main style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#1e1e2f' // Feel free to move this to your main.css
        }}>
            {!token ? (
                // If there is no token, only show the Login component
                <Login />
            ) : (
                // If there is a token, show the Chat app
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    maxWidth: '800px',
                    height: '80vh',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    {/* ActiveUsers could go here or in a sidebar */}
                    {/* <ActiveUsers users={["User1", "User2"]} /> */}

                    <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                        <Chat limit={20} />
                    </div>

                    <div>
                        <Input />
                    </div>
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