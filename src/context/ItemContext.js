// src/contexts/ItemContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';

const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // 1) build a query for the "items" collection
    const q = query(collection(db, 'items'));

    // 2) subscribe to real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(list);
    }, (error) => {
      console.error('Failed to fetch items:', error);
    });

    // 3) cleanup on unmount
    return () => unsubscribe();
  }, []);



const addItem = async (item) => {
  try {
    // 1) create a new DocumentReference with an auto-generated ID
    const newDocRef = doc(collection(db, 'items'));
    // 2) write the document, including that ID in the data payload
    await setDoc(newDocRef, { ...item, id: newDocRef.id });
    // 3) return the newly created item (with its ID)
    return { id: newDocRef.id, ...item };
  } catch (e) {
    console.error('Error adding item:', e);
    throw e;
  }
};


  // UPDATE
  const updateItem = async (updated) => {
    try {
      const ref = doc(db, 'items', updated.id);
      // don't overwrite id field
      const { id, ...data } = updated;
      await updateDoc(ref, data);
    } catch (e) {
      console.error('Error updating item:', e);
    }
  };

  // DELETE
  const removeItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'items', id));
    } catch (e) {
      console.error('Error deleting item:', e);
    }
  };

  // READ helper
  const getItemById = (id) => items.find(item => item.id === id);

  return (
    <ItemContext.Provider
      value={{ items, addItem, updateItem, removeItem, getItemById }}
    >
      {children}
    </ItemContext.Provider>
  );
};

// Custom hook for consuming
export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
};
