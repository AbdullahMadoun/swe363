// src/context/CartContext.js
import React, { createContext, useEffect, useState, useContext } from "react";
import {
  doc,
  onSnapshot,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { UserContext } from "./UserContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useContext(UserContext);
  const [cart, setCart]       = useState([]); // full item objects
  const [cartIds, setCartIds] = useState([]); // stored item ids (can include duplicates)

  // 1) Subscribe to the user's `cart` array in their user doc
  useEffect(() => {
    if (!user) {
      setCartIds([]);
      setCart([]);
      return;
    }
    const userRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      setCartIds(snap.data()?.cart || []);
    });
    return () => unsub();
  }, [user]);

  // 2) Whenever cartIds changes, fetch each item (including duplicates)
  useEffect(() => {
    if (cartIds.length === 0) {
      setCart([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const items = [];
      for (const storedId of cartIds) {
        const q = query(
          collection(db, "items"),
          where("id", "==", storedId)
        );
        const snap = await getDocs(q);
        snap.forEach((d) => {
          items.push({ id: d.id, ...d.data() });
        });
      }
      if (!cancelled) setCart(items);
    })();
    return () => { cancelled = true; };
  }, [cartIds]);

  // 3) Add an item’s id to the user's cart array (allows duplicates)
  const addToCart = async (item) => {
    if (!user) throw new Error("You must be signed in to add to cart");
    const userRef = doc(db, "users", user.uid);
    const snap    = await getDoc(userRef);
    const current = snap.data()?.cart || [];
    const updated = [...current, item.id];
    await updateDoc(userRef, { cart: updated });
  };

  // 4) Remove a single instance of an item’s id from the user's cart array
  const removeFromCart = async (item) => {
    if (!user) throw new Error("You must be signed in to modify the cart");
    const userRef = doc(db, "users", user.uid);
    const snap    = await getDoc(userRef);
    const current = snap.data()?.cart || [];
    const idx     = current.indexOf(item.id);
    if (idx < 0) return;
    const updated = [...current.slice(0, idx), ...current.slice(idx + 1)];
    await updateDoc(userRef, { cart: updated });
  };

  // 5) Clear the entire cart
  const clearCart = async () => {
    if (!user) throw new Error("You must be signed in to clear the cart");
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { cart: [] });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
