import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/app.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { initialiseStudyOrders } from "./firebase/caseStudySetUp";

initialiseStudyOrders()
  .then(() => console.log("Study orders initialized"))
  .catch((error) => console.error("Error initializing study orders:", error));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}> </RouterProvider>
  </React.StrictMode>
);
