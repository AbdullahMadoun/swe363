import React, { createContext, useContext, useEffect, useState } from 'react';

// Optionally, import your default items list
// import defaultItems from '../data/items';

const ItemContext = createContext();

export const ItemProvider = ({ children, initialItems = [] }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('items');
      return stored ? JSON.parse(stored) : initialItems;
    } catch (e) {
      console.error('Failed to parse items from localStorage', e);
      return initialItems;
    }
  });

  // Persist changes
  useEffect(() => {
    try {
      localStorage.setItem('items', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save items to localStorage', e);
    }
  }, [items]);

  // CRUD operations
  const addItem = (item) => {
    setItems((prev) => [...prev, item]);
  };

  const updateItem = (updated) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getItemById = (id) => items.find((item) => item.id === id);

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
