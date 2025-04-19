// src/Buyer/MyOrdersPage.js
import React, { useContext, useState, useEffect } from 'react';
import { OrderContext } from '../context/OrderContext';
import { UserContext } from '../UserContext';
import OrderCard from './OrderCard'; // Assuming OrderCard is in the same directory
import Loading from '../Loading'; // Your loading component
import { Link } from 'react-router-dom'; // For linking back to shopping


const MyOrdersPage = () => {
    const { orders: allOrders, loading: ordersLoading, error: ordersError } = useContext(OrderContext);
    const { user, loading: userLoading } = useContext(UserContext); // Get user and its loading state
    const [userOrders, setUserOrders] = useState([]);

    useEffect(() => {
        // Only filter when user is loaded and orders are loaded
        if (!userLoading && !ordersLoading && user && user.email) { // Check user exists and has identifier
             // Filter all orders to find ones matching the current user's email
             const filtered = allOrders.filter(order => order.buyerId === user.email);
             setUserOrders(filtered);
        } else if (!userLoading && !user) {
             // Handle case where user is not logged in but page is accessed
             setUserOrders([]); // Ensure orders are cleared if user logs out
        }
        // Dependency array: Re-run filter if orders, user, or loading states change
    }, [allOrders, user, ordersLoading, userLoading]);

    // Handle loading states
    if (userLoading || ordersLoading) {
        return <Loading />;
    }

    // Handle user not logged in (optional, depends on your routing protection)
    if (!user) {
        return (
            <div className="my-orders-page">
                <h2>My Orders</h2>
                <p>Please <Link to="/login">log in</Link> to view your orders.</p>
            </div>
        );
    }

    // Handle errors fetching orders
    if (ordersError) {
        return (
            <div className="my-orders-page error">
                <h2>My Orders</h2>
                <p>Error loading orders: {ordersError}</p>
            </div>
        );
    }

    return (
        <div className="my-orders-page">
            <h2>My Orders</h2>
            {userOrders.length === 0 ? (
                <p>You haven't placed any orders yet. <Link to="/">Start shopping!</Link></p>
            ) : (
                <div className="orders-list">
                    {userOrders
                        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)) // Sort by date, newest first
                        .map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;