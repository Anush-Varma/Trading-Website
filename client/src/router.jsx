import { createBrowserRouter } from "react-router-dom";
import HomePage from "./routes/HomePage";
import Tutorial from "./routes/Tutorial";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/Tutorial", element: <Tutorial /> },
]);
