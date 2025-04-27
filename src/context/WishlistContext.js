// src/context/WishlistContext.js

import React, { createContext, useEffect, useState, useContext } from 'react';
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserContext } from './UserContext';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useContext(UserContext);
  const [wishlistIds, setWishlistIds] = useState([]); // stored IDs in user doc
  const [wishlist, setWishlist]     = useState([]);    // full item objects

  // 1) Subscribe to user's `wishlist` array in their user doc
  useEffect(() => {
    if (!user) {
      setWishlistIds([]);
      setWishlist([]);
      return;
    }
    const userRef = doc(db, 'users', user.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      setWishlistIds(snap.data()?.wishlist || []);
    });
    return () => unsub();
  }, [user]);

  // 2) Whenever wishlistIds changes, fetch full item docs
  useEffect(() => {
    if (wishlistIds.length === 0) {
      setWishlist([]);
      return;
    }
    let cancelled = false;

    (async () => {
      const items = [];
      for (const id of wishlistIds) {
        const q = query(
          collection(db, 'items'),
          where('id', '==', id)
        );
        const snap = await getDocs(q);
        snap.forEach(d => items.push({ id: d.id, ...d.data() }));
      }
      if (!cancelled) {
        setWishlist(items);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [wishlistIds]);

  // 3) Add an item's id to the user's wishlist array
  const addToWishlist = async (item) => {
    if (!user) throw new Error("You must be signed in to add to wishlist");
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { wishlist: arrayUnion(item.id) });
  };

  // 4) Remove an item's id from the user's wishlist array
  const removeFromWishlist = async (item) => {
    if (!user) throw new Error("You must be signed in to modify the wishlist");
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { wishlist: arrayRemove(item.id) });
  };

  // 5) Clear the entire wishlist
  const clearWishlist = async () => {
    if (!user) throw new Error("You must be signed in to clear the wishlist");
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { wishlist: [] });
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
