import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

const Login       = lazy(() => import("./pages/Login"));
const Register    = lazy(() => import("./pages/Register"));
const Dashboard   = lazy(() => import("./pages/Dashboard"));
const ChainVerify = lazy(() => import("./pages/ChainVerify"));
const Transfer    = lazy(() => import("./pages/Transfer"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const MyListings  = lazy(() => import("./pages/MyListings"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Cardano     = lazy(() => import("./pages/Cardano"));

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", color: "#94A3B8" }}>Loading...</div>}>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/chain-verify"  element={<ProtectedRoute><ChainVerify /></ProtectedRoute>} />
        <Route path="/transfer"      element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
        <Route path="/marketplace"   element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/my-listings"   element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="/transactions"  element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/cardano"       element={<ProtectedRoute><Cardano /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
