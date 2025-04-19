import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #f8f9fa;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 15px;
  align-items: center;
  margin: 0;
  padding: 0;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #007bff;

  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

function Navbar() {
  const { user, logout } = useContext(UserContext);

  const buyerLinks = [
    { to: "/cart", label: "Cart" },
    { to: "/wishlist", label: "Wishlist" },
  ];

  const sellerLinks = [
    { to: "/seller/products", label: "My Products" },
    { to: "/seller/orders", label: "Orders" },
    { to: "/seller/products/add", label: "Add Product" },
  ];

  return (
    <Nav>
      <NavList>
        <li><NavLink to="/">Home</NavLink></li>

        {user ? (
          <>
            {(user.role === 'buyer' ? buyerLinks : sellerLinks).map(link => (
              <li key={link.to}>
                <NavLink to={link.to}>{link.label}</NavLink>
              </li>
            ))}
            <li><LogoutButton onClick={logout}>Logout</LogoutButton></li>
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
