import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorised, setAuthorised] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthorisation = async () => {
      setLoading(true);

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          toast.error("Please sign in to access this page.");
          setAuthorised(false);
          setLoading(false);
          return;
        }

        if (location.pathname.startsWith("/Questions/")) {
          // Get the user's document from Firestore
          const userRef = doc(db, "participants", user.uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            toast.error("Please start from the practice page");
            setAuthorised(false);
            setLoading(false);
            return;
          }

          const userData = userDoc.data();

          // Check study flow state for Questions route
          const pathSetId = parseInt(location.pathname.split("/").pop());
          if (!userData.flowStarted || pathSetId !== userData.currentStep) {
            toast.error("Please follow the proper study flow");
            setAuthorised(false);
            setLoading(false);
            return;
          }
        }

        setAuthorised(true);
        setLoading(false);
      });
      return () => unsubscribe();
    };

    checkAuthorisation();
  }, [location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authorised) {
    if (!auth.currentUser) {
      return <Navigate to="/SignIn" replace />;
    }
    if (location.pathname.startsWith("/Questions")) {
      return <Navigate to="/Practice" replace />;
    }
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
