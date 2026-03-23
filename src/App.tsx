import React from "react";
import { AuthProvider, useAuth } from "./authContext.tsx";
import Login from "./assets/components/Login/index.tsx";
import Chat from "./assets/components/Chat/index.tsx";
import Input from "./assets/components/Input/index.tsx";

import "./App.css";
import ActiveUsers from "./assets/components/ActiveUsers/index.tsx";

const AppContent: React.FC = () => {
  const { token } = useAuth();

  return (
    <main>
      {!token ? (
        <Login />
      ) : (
        <>
          <div className="left">
            <Chat limit={20} />
            <Input />
          </div>
          <div className="right">
            <ActiveUsers users={["ja", "on"]}></ActiveUsers>
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
