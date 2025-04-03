import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";
import toast from "react-hot-toast";

const VISUALISATION_ORDERS = [
  { 0: "Time Series", 1: "Connected Scatter Plot", 2: "Enhanced Glyph" },
  { 0: "Time Series", 1: "Enhanced Glyph", 2: "Connected Scatter Plot" },
  { 0: "Connected Scatter Plot", 1: "Enhanced Glyph", 2: "Time Series" },
  { 0: "Connected Scatter Plot", 1: "Time Series", 2: "Enhanced Glyph" },
  { 0: "Enhanced Glyph", 1: "Time Series", 2: "Connected Scatter Plot" },
  { 0: "Enhanced Glyph", 1: "Connected Scatter Plot", 2: "Time Series" },
];

export const initialiseStudyOrders = async () => {
  try {
    const orderDocRef = doc(db, "user_study", "order_tracking");
    const orderDoc = await getDoc(orderDocRef);

    if (!orderDoc.exists()) {
      await setDoc(orderDocRef, {
        currentIndex: 0,
        orders: VISUALISATION_ORDERS,
      });
      console.log("Study order tracking initialised.");
    }
  } catch (error) {
    console.error("Error initialising study order tracking:", error);
  }
};

export const assignOrderToUser = async (userId) => {
  try {
    // First check if this user has already been assigned an order
    const userRef = doc(db, "participants", userId);
    const userDoc = await getDoc(userRef);

    // If the user already exists and has an order, return that order
    if (userDoc.exists() && userDoc.data().order) {
      console.log("User already has an assigned order");
      return userDoc.data().order;
    }

    // Otherwise, proceed with assigning a new order using a transaction
    const orderDocRef = doc(db, "user_study", "order_tracking");

    const assignedOrder = await runTransaction(db, async (transaction) => {
      const orderDoc = await transaction.get(orderDocRef);

      if (!orderDoc.exists()) {
        throw new Error("Order tracking document does not exist.");
      }

      const { currentIndex, orders } = orderDoc.data();
      const orderToAssign = orders[currentIndex % orders.length];

      // Increment the index within the transaction
      transaction.update(orderDocRef, {
        currentIndex: increment(1),
      });

      return orderToAssign;
    });

    // Record the assignment in the user document to prevent reassignment
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        order: assignedOrder,
        status: "in_progress",
        assignedAt: new Date().toISOString(),
      });
    } else {
      // Only update if no order exists yet
      if (!userDoc.data().order) {
        await updateDoc(userRef, {
          order: assignedOrder,
        });
      }
    }

    return assignedOrder;
  } catch (error) {
    console.error("Error assigning order to user:", error);
    toast.error("Error assigning order to user. Please try again.");
  }
};

export const checkUserCompletion = async (userId) => {
  try {
    const userRef = doc(db, "participants", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.status === "completed";
    }
    return false;
  } catch (error) {
    console.error("Error checking user completion:", error);
    toast.error("Error checking user completion. Please try again.");
    return false;
  }
};
