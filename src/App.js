import React from 'react';
import Navbar from './Navbar.js';
import { Routes, Route } from 'react-router-dom';

// Import Seller Pages
import MyProductsPage from './Seller/pages/MyProductsPage.js';

// Import other seller pages later: AddProductPage, SellerProductDetailPage, OrdersPage

// Import your Protected Route component
import ProtectedRoute from './Seller/components/ProtectedRoute.js'; // Assuming you create this

// Context Providers
import { UserProvider } from './UserContext.js';
import { CartProvider } from './CartContext.js';
import { CompareProvider } from './context/CompareContext.js';
import { WishlistProvider } from './context/WishlistContext.js';
import { SellerProvider } from './context/SellerContext.js'; // Import SellerProvider

import MainPage from './MainPage.js'
import ShoppingCartPage from './ShoppingCartPage.js'
import PaymentPage from './ShoppingCartPage.js'
import ComparePage from './ComparePage.js'
import WishlistPage from './WishlistPage.js'
import LoginPage from './Login.js'
import SignupPage from './Signup.js'
import AddProductForm from './Seller/pages/AddProudctPage.js';
import SellerProductDetailPage from './Seller/pages/SellerProductDetailPage.js';
import OrderPage from './Seller/pages/OrdersPage.js';
import { ItemProvider } from './context/ItemContext.js';
import AccountPage from './Admin/AccountPage';
import PolicyControl from './Admin/PolicyControl';
import PolicyPage from './Admin/PolicyPage';
import OrdersPage from './Buyer/OrdersPage.js';
import ProductDetailPage from './ProductDetailPage.js';
function App() {
  return (
    <UserProvider>
      <CartProvider>
        <WishlistProvider>
          <CompareProvider>
            <ItemProvider>
            <SellerProvider> {/* Wrap relevant parts in SellerProvider */}
              <Navbar /> {/* Navbar likely needs UserContext/SellerContext */}
              <Routes>
                Buyer Routes
                <Route path="/" element={<LoginPage  />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/cart" element={<ShoppingCartPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/item" element={<ProductDetailPage />} />
                  Add buyer product detail route maybe? /product/:productId
                  {/* Admin Routes */}
                  <Route path="/Admin/accounts" element={<AccountPage />} />
                  <Route path="/Admin/policycontrol" element={<PolicyControl />} />
                  <Route path="/policy" element={<PolicyPage />} />
                {/* --- Seller Routes --- */}
                <Route
                  path="/seller/products"
                  element={
                    // <ProtectedRoute requiredRole="seller">
          
                    <MyProductsPage />
                   
               
                    // </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/AddProduct"
                  element={

                   
                    <AddProductForm />
           
                    // </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/AddProduct"
                  element={
                    // <ProtectedRoute requiredRole="seller">
       
                   
                    <AddProductForm />

                    // </ProtectedRoute>
                  }
                />
                <Route path="/seller/product/:productId" element={<SellerProductDetailPage />} />
                <Route path="/seller/orders" element={<OrderPage />} />
                {/* Add other seller routes here later */}
                {/*
                <Route path="/seller/products/add" element={<ProtectedRoute requiredRole="seller"><AddProductPage /></ProtectedRoute>} />
                <Route path="/seller/product/:productId" element={<ProtectedRoute requiredRole="seller"><SellerProductDetailPage /></ProtectedRoute>} />
                <Route path="/seller/orders" element={<ProtectedRoute requiredRole="seller"><OrdersPage /></ProtectedRoute>} />
                */}

                {/* Catch-all or Not Found Route */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}
              </Routes>
              {/* Maybe Footer component here */}
            </SellerProvider>
            </ItemProvider>
          </CompareProvider>
        </WishlistProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;