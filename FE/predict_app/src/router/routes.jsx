import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import Layout from "../components/Layout";
import SuspenseWrapper from "../components/SuspenseWrapper";
import { ProtectedRoute, PublicRoute } from "./RouteComponents";

// Lazy load components
const LandingPage = lazy(() => import("../(pages)/LandingPage"));
const Auth = lazy(() => import("../(auth)"));
const PredictPage = lazy(() => import("../(pages)/PredictPage"));
const HistoryPage = lazy(() => import("../(pages)/HistoryPage"));
const SettingsPage = lazy(() => import("../(pages)/SettingsPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <SuspenseWrapper loadingMessage="Đang tải trang chủ...">
            <LandingPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/auth",
        element: (
          <PublicRoute>
            <SuspenseWrapper loadingMessage="Đang tải trang đăng nhập...">
              <Auth />
            </SuspenseWrapper>
          </PublicRoute>
        ),
      },
      {
        path: "/predict",
        element: (
          <ProtectedRoute>
            <SuspenseWrapper loadingMessage="Đang tải trang dự đoán...">
              <PredictPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "/history",
        element: (
          <ProtectedRoute>
            <SuspenseWrapper loadingMessage="Đang tải lịch sử dự đoán...">
              <HistoryPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <SuspenseWrapper loadingMessage="Đang tải trang cài đặt...">
              <SettingsPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
