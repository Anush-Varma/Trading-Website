import { createBrowserRouter } from "react-router-dom";
import HomePage from "./routes/HomePage";
import Tutorial from "./routes/Tutorial";
import Layout from "./components/Layout";
import SignUpPage from "./routes/SignUpPage";
import SignInPage from "./routes/SignInPage";
import UserStudyPage from "./routes/UserStudyPage";
import QuestionsPage from "./routes/QuestionsPage";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/Tutorial", element: <Tutorial /> },
      { path: "/SignUp", element: <SignUpPage /> },
      { path: "/SignIn", element: <SignInPage /> },
      {
        path: "/Practice",
        element: (
          <ProtectedRoute>
            <UserStudyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Questions/:setId",
        element: (
          <ProtectedRoute>
            <QuestionsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
