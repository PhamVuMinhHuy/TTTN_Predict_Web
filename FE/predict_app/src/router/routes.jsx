import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import LandingPage from "../(pages)/LandingPage";
import Auth from "../(auth)";
import PredictPage from "../(pages)/PredictPage";
import { ProtectedRoute, PublicRoute } from "./RouteComponents";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/auth",
        element: (
          <PublicRoute>
            <Auth />
          </PublicRoute>
        ),
      },
      {
        path: "/predict",
        element: (
          <ProtectedRoute>
            <PredictPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
