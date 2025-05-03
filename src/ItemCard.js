import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, BarChart2, Heart } from "lucide-react";
import styled from "styled-components";

import { CartContext } from "./context/CartContext";
import { CompareContext } from "./context/CompareContext";
import { WishlistContext } from "./context/WishlistContext";

export default function ItemCard({ item }) {
  const { addToCart } = useContext(CartContext);
  const { addToCompare, compareItems } = useContext(CompareContext);
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext);

  const {
    id,
    title,
    images,
    price,
    discount,
    stock_quantity,
    speed,
    capacity,
    brand,
    rating = 0,
  } = item;

  const finalPrice = (price * (1 - discount / 100)).toFixed(2);
  const [isHovered, setIsHovered] = useState(false);
  const [isCompareHovered, setIsCompareHovered] = useState(false);

  const isInCompareList = compareItems.some((i) => i.id === id);
  const isInWishlist = wishlist.some((i) => i.id === id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (stock_quantity > 0) addToCart(item);
  };

  const handleAddToCompare = (e) => {
    e.preventDefault();
    addToCompare(item);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    isInWishlist ? removeFromWishlist(item) : addToWishlist(item);
  };

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <Stars>
        {"★".repeat(fullStars)}
        {halfStar && "★"}
        {"☆".repeat(emptyStars)}
      </Stars>
    );
  };

  return (
    <CardLink
      to={`/products/${id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsCompareHovered(false);
      }}
    >
      <ImageWrapper>
        <ProductImage src={images} alt={title} />

        <CartButton
          onClick={handleAddToCart}
          disabled={stock_quantity <= 0}
          style={{
            backgroundColor:
              stock_quantity > 0
                ? isHovered
                  ? "#f9fafb"
                  : "#ffffff"
                : "#f3f4f6",
            cursor: stock_quantity > 0 ? "pointer" : "not-allowed",
          }}
        >
          <ShoppingCart size={16} color="#111827" />
        </CartButton>

        <CompareButton
          onClick={handleAddToCompare}
          onMouseEnter={() => setIsCompareHovered(true)}
          onMouseLeave={() => setIsCompareHovered(false)}
          style={{
            backgroundColor: isInCompareList
              ? "#d1fae5"
              : isCompareHovered
              ? "#f9fafb"
              : "#ffffff",
            cursor: isInCompareList ? "default" : "pointer",
            borderColor: isInCompareList ? "#10b981" : "#e5e7eb",
          }}
        >
          <BarChart2
            size={16}
            color={isInCompareList ? "#10b981" : "#111827"}
          />
        </CompareButton>

        <WishlistButton onClick={handleWishlistToggle}>
          <Heart
            size={16}
            color={isInWishlist ? "#ef4444" : "#9ca3af"}
            fill={isInWishlist ? "#ef4444" : "none"}
          />
        </WishlistButton>
      </ImageWrapper>

      <CardContent>
        <Title>{title}</Title>
        {renderStars()}

        <Specs>
          <p><strong>Brand:</strong> {brand}</p>
          <p><strong>Speed:</strong> {speed} MHz</p>
          <p><strong>Capacity:</strong> {capacity}</p>
        </Specs>

        <PriceInfo>
          {discount > 0 && <OriginalPrice>${price.toFixed(2)}</OriginalPrice>}
          <FinalPrice>${finalPrice}</FinalPrice>
          {discount > 0 && <Discount> (-{discount}%)</Discount>}
        </PriceInfo>

        <StockStatus inStock={stock_quantity > 0}>
          {stock_quantity > 0
            ? `${stock_quantity} in stock`
            : "Out of stock"}
        </StockStatus>
      </CardContent>
    </CardLink>
  );
}

// --- Styled Components ---

const CardLink = styled(Link)`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  text-decoration: none;
  color: #111111;
  transition: transform 0.2s ease;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 180px;
  overflow: hidden;
  position: relative;
  background-color: #f9fafb;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 10px;
`;

const CardContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.95rem;
`;

const Title = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const Specs = styled.div`
  font-size: 0.85rem;
  color: #4b5563;
  line-height: 1.4;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #9ca3af;
  font-size: 0.9rem;
`;

const FinalPrice = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
`;

const Discount = styled.span`
  color: #dc2626;
  font-weight: 500;
  font-size: 0.9rem;
`;

const StockStatus = styled.p`
  margin: 0;
  color: ${(props) => (props.inStock ? "#22c55e" : "#f87171")};
`;

const ButtonBase = styled.button`
  position: absolute;
  padding: 6px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  transition: background-color 0.2s ease;
  background-color: #ffffff;
`;

const CartButton = styled(ButtonBase)`
  top: 10px;
  right: 10px;
`;

const CompareButton = styled(ButtonBase)`
  top: 10px;
  right: 50px;
`;

const WishlistButton = styled(ButtonBase)`
  top: 10px;
  right: 90px;
`;
