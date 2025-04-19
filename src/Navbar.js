import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {useNavigate } from 'react-router-dom';
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
  text-decoration: none;
  color: #1d1d1f;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/some-path');
  };
  
  const buyerLinks = [
    { to: "/cart", label: "Cart" },
    { to: "/wishlist", label: "Wishlist" },
    { to: "/policy", label: "Policy"},
    {to:"/orders", label: "Orders"}
  ];

  const sellerLinks = [
    { to: "/seller/products", label: "My Products" },
    { to: "/seller/orders", label: "Orders" },
    { to: "/seller/addproduct", label: "Add Product" },
    { to: "/policy", label: "Policy"},
  ];

  const adminLinks = [
    { to: "/Admin/accounts", label: "Accounts" },
    { to: "/Admin/policycontrol", label: "Policy Control" },
    { to: "/policy", label: "Policy"},
  ];

  const getRoleLinks = () => {
    const role = (user?.role || '').toLowerCase();
    if (role === 'buyer') return buyerLinks;
    if (role === 'seller') return sellerLinks;
    if (role === 'admin') return adminLinks;
    return [];
  };
    const logouty = () => { 
      logout(); 
      navigate("/");
    }
  return (
    <Nav>
      <Logo to="/main">TechMart</Logo>

      <NavList>
        {!user || user.role ==="Admin" ? "": <li><NavLink to="/main">Home</NavLink></li>}

        {user ? (
          <>
            {getRoleLinks().map(link => (
              <li key={link.to}>
                <NavLink to={link.to}>{link.label}</NavLink>
              </li>
            ))}
            <li><LogoutButton onClick={logouty}>Logout</LogoutButton></li>
          </>
        ) : (
          <>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/signup">Signup</NavLink></li>
          </>
        )}
      </NavList>
    </Nav>
  );
}

export default Navbar;
