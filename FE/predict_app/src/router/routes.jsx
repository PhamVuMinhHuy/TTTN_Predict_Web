import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "../components/Layout";
import { ProtectedRoute, PublicRoute } from "./RouteComponents";

// Lazy load components
const LandingPage = lazy(() => import("../(pages)/LandingPage"));
const Auth = lazy(() => import("../(auth)"));
const PredictPage = lazy(() => import("../(pages)/PredictPage"));
const HistoryPage = lazy(() => import("../(pages)/HistoryPage"));

// Loading component
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
      fontSize: "1.2rem",
      color: "#6b7280",
    }}
  >
    <div
      style={{
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          fontSize: "2rem",
          marginBottom: "1rem",
        }}
      >
        ⏳
      </div>
      <div>Đang tải trang...</div>
    </div>
  </div>
);

// Wrapper component for Suspense
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <SuspenseWrapper>
            <LandingPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/auth",
        element: (
          <PublicRoute>
            <SuspenseWrapper>
              <Auth />
            </SuspenseWrapper>
          </PublicRoute>
        ),
      },
      {
        path: "/predict",
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <PredictPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "/history",
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <HistoryPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
