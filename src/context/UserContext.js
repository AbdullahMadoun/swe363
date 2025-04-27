// src/context/UserContext.js
import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile]   = useState(null);
  const [users, setUsers]       = useState([]);

  // 1) Firebase Auth listener
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setAuthUser(u));
  }, []);

  useEffect(() => {
    if (!authUser?.uid) {
      setProfile(null);
      return;
    }
  
    // point directly at the users/{uid} document
    const userDocRef = doc(db, "users", authUser.uid);
  
    // subscribe to changes (or you can use getDoc for a one-time fetch)
    const unsub = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        setProfile({ id: snap.id, ...snap.data() });
      } else {
        setProfile(null);
      }
    });
  
    return () => unsub();
  }, [authUser]);

  // 3) Subscribe to entire users collection
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "users"),
      (snap) =>
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => console.error("Users fetch error:", err)
    );
    return () => unsub();
  }, []);

  // Auth + profile mutations
  const signupUser = async ({ email, password, username, role }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      email,
      username,
      role,
      createdAt: new Date(),
    });
    return cred.user;
  };
  const loginUser  = (email, pw) => signInWithEmailAndPassword(auth, email, pw);
  const logoutUser = () => signOut(auth);
  const updateUser = (id, data) => updateDoc(doc(db, "users", id),{username:data} );
  const removeUser = (id) => deleteDoc(doc(db, "users", id));

  // merge Auth + profile
  const fullUser = authUser
    ? {
        uid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName,
        ...profile,
      }
    : null;

  return (
    <UserContext.Provider
      value={{
        user: fullUser,
        authUser,
        profile,
        fullUser,
        users,
        signupUser,
        loginUser,
        logoutUser,
        updateUser,
        removeUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

