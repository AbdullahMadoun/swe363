// src/context/OrderContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext'; // Assuming UserContext provides the user object

// Create the context
export const OrderContext = createContext();

// Define the key for localStorage
const LOCAL_STORAGE_KEY = 'allOrders';

// Create the provider component
export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state for initial load
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext); // Get user info to associate orders

    // Effect to load orders from localStorage on initial mount
    useEffect(() => {
        setLoading(true);
        setError(null);
        try {
            const storedOrders = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedOrders) {
                setOrders(JSON.parse(storedOrders));
            } else {
                setOrders([]); // Initialize with empty array if nothing is stored
            }
        } catch (err) {
            console.error("Failed to parse orders from localStorage:", err);
            setError("Failed to load order history.");
            setOrders([]); // Reset to empty on error
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array means run only once on mount

    // Function to add a new order
    const addOrder = (newOrderData) => {
        if (!user || !user.email) { // Assuming user.email is the unique identifier
             setError("Cannot add order: User not logged in.");
             console.error("Cannot add order: User not logged in.");
             return; // Or throw an error
        }

        setLoading(true); // Indicate activity
        setError(null);
        try {
            // --- Generate unique ID (simple approach) ---
            // A more robust solution might use a library like 'uuid'
            const uniqueId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

            const orderToAdd = {
                ...newOrderData, // Should include items, total, etc.
                id: uniqueId,
                buyerId: user.email, // Link order to the logged-in user
                orderDate: new Date().toISOString(), // Record the time
                status: 'Processing' // Default status
            };

            // Update state
            const updatedOrders = [...orders, orderToAdd];
            setOrders(updatedOrders);

            // Update localStorage
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedOrders));

        } catch (err) {
            console.error("Failed to save order:", err);
            setError("Failed to save the order.");
             // Optional: Rollback state update if needed, though less critical with localStorage
        } finally {
            setLoading(false);
        }
    };

    // Note: getOrdersForUser logic will be in the component that consumes the context,
    // as it needs the *current* user's ID to filter the full `orders` list.

    return (
        <OrderContext.Provider value={{ orders, loading, error, addOrder }}>
            {children}
        </OrderContext.Provider>
    );
};