import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NhostProvider } from "@nhost/react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./config/apollo";
import { nhost } from "./config/nhost";
import AuthProvider from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <ErrorBoundary>
      <NhostProvider nhost={nhost}>
        <ApolloProvider client={apolloClient}>
          <AuthProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/login" element={<LoginPage key="login" />} />
                  <Route path="/signup" element={<SignupPage key="signup" />} />
                  <Route path="/" element={<Navigate to="/chat" />} />
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </Router>
          </AuthProvider>
        </ApolloProvider>
      </NhostProvider>
    </ErrorBoundary>
  );
}

export default App;
