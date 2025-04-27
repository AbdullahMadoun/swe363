// src/context/SellerContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserContext } from './UserContext';

export const SellerContext = createContext();

export function SellerProvider({ children }) {
  const { user } = useContext(UserContext);

  const [sellerProducts, setSellerProducts] = useState([]);
  const [sellerOrders, setSellerOrders]     = useState([]);
  const [isLoading, setIsLoading]           = useState(true);

  // --- realtime subscription to this seller's products ---
  useEffect(() => {
    if (!user || user.role !== 'Seller') {
      setSellerProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const productsRef = collection(db, 'items');
    const q           = query(productsRef, where('sellerId', '==', user.id));

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setSellerProducts(list);
        setIsLoading(false);
      },
      error => {
        console.error('Failed to fetch products:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // --- realtime subscription to this seller's orders ---
  useEffect(() => {
    if (!user || user.role !== 'Seller') {
      setSellerOrders([]);
      return;
    }

    const ordersRef = collection(db, 'orders');
    const q         = query(ordersRef, where('sellerId', '==', user.id));

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setSellerOrders(list);
      },
      error => console.error('Failed to fetch orders:', error)
    );

    return () => unsubscribe();
  }, [user]);

  // --- create a new product ---
  const addProduct = async (newProductData) => {
    const data = {
      ...newProductData,
      sellerId:  user.id,
      createdAt: serverTimestamp()
    };
    const ref = await addDoc(collection(db, 'items'), data);
    return { id: ref.id, ...data };
  };

  // --- update an existing product ---
  const updateProduct = async (productId, updatedData) => {
    const ref = doc(db, 'products', productId);
    await updateDoc(ref, updatedData);
    // local state will refresh via onSnapshot
  };

  // --- delete a product ---
  const deleteProduct = async (productId) => {
    try{
      const ref = doc(db, 'items', productId);
      await deleteDoc(ref);
    }
    catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true; 
    // local state will refresh via onSnapshot
  };

  // --- change the status of an order ---
  const updateOrderStatus = async (orderId, newStatus) => {
    const ref = doc(db, 'orders', orderId);
    await updateDoc(ref, { status: newStatus });
    // local state will refresh via onSnapshot
  };

  // --- one-off fetch of orders (if you ever need it) ---
  const fetchSellerOrders = async () => {
    if (!user || user.role !== 'Seller') {
      setSellerOrders([]);
      return;
    }
    const ordersRef = collection(db, 'orders');
    const q         = query(ordersRef, where('sellerId', '==', user.uid));
    const snap      = await getDocs(q);
    const list      = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setSellerOrders(list);
  };

  return (
    <SellerContext.Provider value={{
      sellerProducts,
      sellerOrders,
      isLoading,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      fetchSellerOrders
    }}>
      {children}
    </SellerContext.Provider>
  );
}
