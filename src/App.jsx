import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import PageLoader from "./components/PageLoader.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgetPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// Dashboard & Applications tetap eager-loaded (halaman utama yang paling
// sering diakses). Notes di-lazy-load karena membawa dependency berat
// (rich text editor + export PDF/Word) yang tidak perlu membebani initial
// load halaman lain.
import Dashboard from "./pages/Dashboard.jsx";
import Applications from "./pages/Applications.jsx";
const Notes = lazy(() => import("./pages/Notes.jsx"));

const pageVariants = {
  initial: { opacity: 0, x: 80 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -80 },
};

const pageTransition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1],
};

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageTransition}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      minHeight: "100vh",
    }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <AnimatePresence mode="sync" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/login"
            element={
              <PageWrapper>
                <Login />
              </PageWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <PageWrapper>
                <Register />
              </PageWrapper>
            }
          />
          <Route
            path="/lupa-password"
            element={
              <PageWrapper>
                <ForgotPassword />
              </PageWrapper>
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <Dashboard />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <Applications />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <Suspense fallback={<PageLoader message="Memuat catatan..." />}>
                    <Notes />
                  </Suspense>
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AnimatedRoutes />
    </AuthProvider>
  );
}

export default App;
