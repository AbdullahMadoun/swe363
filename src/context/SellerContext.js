import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserContext } from "../UserContext.js";

export const SellerContext = createContext();

// Helper function to get all products from localStorage
const getAllProductsFromStorage = () => {
    const storedProducts = localStorage.getItem("ecommerce_products");
    return storedProducts ? JSON.parse(storedProducts) : [];
};

// Helper function to get all orders from localStorage
const getAllOrdersFromStorage = () => {
    const storedOrders = localStorage.getItem("ecommerce_orders");
    return storedOrders ? JSON.parse(storedOrders) : [];
};

// Helper function to save orders to localStorage
const saveOrdersToStorage = (orders) => {
    localStorage.setItem("ecommerce_orders", JSON.stringify(orders));
};

export function SellerProvider({ children }) {
    const { user } = useContext(UserContext); // Get the logged-in user
    const [sellerProducts, setSellerProducts] = useState([]);
    const [sellerOrders, setSellerOrders] = useState([]);

    // Fetch seller-specific data
    useEffect(() => {
        if (user && user.role === 'Seller') {
            const allProducts = getAllProductsFromStorage();
            const filteredProducts = allProducts.filter(product => product.sellerId === user.id);
            setSellerProducts(filteredProducts);

            const allOrders = getAllOrdersFromStorage();
            const filteredOrders = allOrders.filter(order => order.sellerId === user.id);
            setSellerOrders(filteredOrders);
        } else {
            setSellerProducts([]);
            setSellerOrders([]);
        }
    }, [user]);

    // --- Functions to manage products ---
    const addProduct = (newProductData) => {
        const newProduct = {
            ...newProductData,
            id: `prod_${Date.now()}_${Math.random().toString(16).slice(2)}`,
            sellerId: user.id
        };
        const allProducts = getAllProductsFromStorage();
        const updatedProducts = [...allProducts, newProduct];
        localStorage.setItem("ecommerce_products", JSON.stringify(updatedProducts));
        setSellerProducts(prev => [...prev, newProduct]);
        return newProduct;
    };

    const updateProduct = (productId, updatedData) => {
        const allProducts = getAllProductsFromStorage();
        let productUpdated = null;
        const updatedProducts = allProducts.map(p => {
            if (p.id === productId && p.sellerId === user.id) {
                productUpdated = { ...p, ...updatedData };
                return productUpdated;
            }
            return p;
        });
        localStorage.setItem("ecommerce_products", JSON.stringify(updatedProducts));
        if (productUpdated) {
            setSellerProducts(prev => prev.map(p => p.id === productId ? productUpdated : p));
        }
        return productUpdated;
    };

    const deleteProduct = (productId) => {
        const allProducts = getAllProductsFromStorage();
        const updatedProducts = allProducts.filter(p => !(p.id === productId && p.sellerId === user.id));
        if (updatedProducts.length < allProducts.length) {
            localStorage.setItem("ecommerce_products", JSON.stringify(updatedProducts));
            setSellerProducts(prev => prev.filter(p => p.id !== productId));
            return true;
        }
        return false;
    };

    // --- Functions to manage orders ---
    const updateOrderStatus = (orderId, newStatus) => {
        const allOrders = getAllOrdersFromStorage();
        const updatedOrders = allOrders.map(order =>
            order.id === orderId && order.sellerId === user.id ? { ...order, status: newStatus } : order
        );
        saveOrdersToStorage(updatedOrders);
        setSellerOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    };

    // Function to simulate fetching seller orders (using local storage)
    const fetchSellerOrders = async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const allOrders = getAllOrdersFromStorage();
                const filteredOrders = allOrders.filter(order => order.sellerId === user.id);
                setSellerOrders(filteredOrders);
                resolve();
            }, 100); // Simulate a short delay
        });
    };

    return (
        <SellerContext.Provider value={{ sellerProducts, sellerOrders, addProduct, updateProduct, deleteProduct, updateOrderStatus, fetchSellerOrders }}>
            {children}
        </SellerContext.Provider>
    );
}