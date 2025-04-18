

import { useEffect, useState } from 'react'

import Navbar from './Navbar.js'
import Loading from './Loading.js'
import ItemCard from './ItemCard.js'
import ShoppingCartPage from './ShoppingCartPage.js'
import { UserProvider } from './UserContext.js'
import { CartProvider } from './CartContext.js'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainPage from './MainPage.js'
import PaymentPage from './PaymentPage'
import ComparePage from './ComparePage.js'
import React from 'react'
import { CompareProvider } from './context/CompareContext.js';
import { WishlistProvider } from './context/WishlistContext.js';
import WishlistPage from './WishlistPage.js'





function App(){


  return (
    <>
 <UserProvider>
      <CartProvider>
      <WishlistProvider>
        <Routes>    
          <Route path="/cart" element={<ShoppingCartPage />} />
          <Route path="/payment" element={<PaymentPage />} />


          </Routes>

        <Navbar/>
        
            <WishlistPage/>
       
        <CompareProvider>
     
   
        <MainPage/>
      </CompareProvider>
      </WishlistProvider>
      </CartProvider>
     
    </UserProvider>
   
    </>
  )
}

export default App;