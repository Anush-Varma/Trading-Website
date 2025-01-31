import { createBrowserRouter } from "react-router-dom";
import HomePage from "./routes/HomePage";
import Tutorial from "./routes/Tutorial";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/Tutorial", element: <Tutorial /> },
    ],
  },
]);
