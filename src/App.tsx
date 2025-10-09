
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from "./context/AuthContext";

import FinanceLayout from "./layout/DashboardLayout";

import ProtectedRoute from "./routes/ProtectedRoutes";
import PublicRoute from "./routes/PublicRoutes";

import SignIn from "./pages/Auth/SignIn";
import NotFound from "./pages/Errors/NotFound";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <ToastContainer style={{ zIndex: 9999 }} position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<PublicRoute />}>
              <Route path="/" element={<SignIn />} />
            </Route>

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <FinanceLayout />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App