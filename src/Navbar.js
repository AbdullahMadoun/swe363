// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ShoppingCart } from 'lucide-react';

import { UserContext } from './context/UserContext';
import { CartContext } from './context/CartContext';

const Nav = styled.nav`
  background-color: white;
  padding: 10px 30px;
  border-bottom: 2px solid #1d1d1f;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 22px;
  font-weight: 600;
  color: #1d1d1f;
  text-decoration: none;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 20px;
  align-items: center;
  margin: 0;
  padding: 0;
`;

const NavLink = styled(Link)`
  position: relative;
  text-decoration: none;
  color: #1d1d1f;
  font-weight: 500;
  &:hover { text-decoration: underline; }
`;

const CartIconWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const Badge = styled.span`
  position: absolute;
  top: -6px;
  right: -10px;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-weight: 600;
  &:hover { text-decoration: underline; }
`;

export default function Navbar() {
  const { logoutUser, user } = useContext(UserContext);
  const { cart }         = useContext(CartContext);
  const navigate         = useNavigate();

  const buyerLinks = [
    { to: "/wishlist", label: "Wishlist" },
    { to: "/policy",   label: "Policy"   },
    { to: "/orders",   label: "Orders"   },
    { to: "/compare",   label: "Compare"   },

  ];

  const sellerLinks = [
    { to: "/seller/products", label: "My Products"  },
    { to: "/seller/orders",   label: "Orders"       },
    { to: "/seller/addproduct", label: "Add Product" },
    { to: "/policy",           label: "Policy"      },
  ];

  const adminLinks = [
    { to: "/admin/accounts",      label: "Accounts"       },
    { to: "/admin/policycontrol", label: "Policy Control" },
    { to: "/policy",              label: "Policy"         },
  ];

  const getRoleLinks = () => {
    if (!user?.role) return [];
    switch (user.role.toLowerCase()) {
      case "buyer":  return buyerLinks;
      case "seller": return sellerLinks;
      case "admin":  return adminLinks;
      default:       return [];
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <Nav>
      <Logo to={user ? "/main" : "/"}>TechMart</Logo>

      <NavList>
        {user && (
          <>
          
       
            {/* Home & Logout */}
            <li><NavLink to="/main">Home</NavLink></li>
         
            {/* Then role‐specific links (excluding /cart) */}
            {getRoleLinks().map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to}>{label}</NavLink>
              </li>
            ))}
            
            {/* Cart Icon */}
            {user.role === "Buyer" && (  <li>
              <NavLink to="/cart">
                <CartIconWrapper>
                  <ShoppingCart size={20} />
                  {cart.length > 0 && <Badge>{cart.length}</Badge>}
                </CartIconWrapper>
              </NavLink>
            </li>) }
            <li><LogoutButton onClick={handleLogout}>Logout</LogoutButton></li>

          
         
          </>
        )}

        {!user && (
          <>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/signup">Signup</NavLink></li>
          </>
        )}
      </NavList>
    </Nav>
  );
}
