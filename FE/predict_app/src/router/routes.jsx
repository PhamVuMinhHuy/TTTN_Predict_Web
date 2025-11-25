import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import Layout from "../components/Layout";
import SuspenseWrapper from "../components/SuspenseWrapper";
import { ProtectedRoute, PublicRoute, AdminRoute } from "./RouteComponents";

// Lazy load components
const LandingPage = lazy(() => import("../(pages)/LandingPage"));
const Auth = lazy(() => import("../(auth)"));
const PredictPage = lazy(() => import("../(pages)/PredictPage"));
const HistoryPage = lazy(() => import("../(pages)/HistoryPage"));
const ScoreboardPage = lazy(() => import("../(pages)/ScoreboardPage"));
const SettingsPage = lazy(() => import("../(pages)/SettingsPage"));
const AdminDashboard = lazy(() => import("../(pages)/AdminDashboard")); // <-- thêm

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
        path: "/scoreboard",
        element: (
          <ProtectedRoute>
            <SuspenseWrapper loadingMessage="Đang tải bảng điểm...">
              <ScoreboardPage />
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
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <SuspenseWrapper loadingMessage="Đang tải Admin Dashboard...">
              <AdminDashboard />
            </SuspenseWrapper>
          </AdminRoute>
        ),
      },
    ],
  },
]);
