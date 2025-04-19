import React, { useContext, useState } from "react";
import { ShoppingCart, BarChart2, Heart, Edit, Trash2, Eye } from "lucide-react"; // Added Edit, Trash2, Eye
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { CartContext } from "./CartContext";
import { CompareContext } from "./context/CompareContext";
import { WishlistContext } from "./context/WishlistContext";

// Assume SellerContext might be needed here eventually if seller actions were on the card
// import { SellerContext } from './context/SellerContext';

// Added mode prop, defaults to 'buyer'
// Added seller-specific action props: onViewDetailsClick, onEditClick, onDeleteClick
function ItemCard({
    item,
    mode = 'buyer',
    onViewDetailsClick, // Function for seller view details
    onEditClick,        // Function for seller edit
    onDeleteClick       // Function for seller delete
}) {
  const navigate = useNavigate(); // Hook for navigation

  // Buyer contexts
  const { addToCart } = useContext(CartContext);
  const { addToCompare, compareItems } = useContext(CompareContext);
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext);

  // Seller context (if actions were needed directly here)
  // const { deleteProduct } = useContext(SellerContext);

  const {
    id,
    title,
    base64image,
    price,
    discount = 0,       // Default discount to 0 if not present
    stock_quantity = 0, // Default stock to 0 if not present
    speed,
    capacity,
    brand,
    rating = 0,
  } = item;

  // Calculate final price, ensure price is a number
  const numericPrice = Number(price) || 0;
  const numericDiscount = Number(discount) || 0;
  const finalPrice = (numericPrice * (1 - numericDiscount / 100)).toFixed(2);

  const [isHovered, setIsHovered] = useState(false); // For buyer cart button
  const [isCompareHovered, setIsCompareHovered] = useState(false); // For buyer compare button


  // --- Buyer Mode Handlers ---
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click if button is clicked
    addToCart(item);
  };

  const handleAddToCompare = (e) => {
    e.stopPropagation();
    addToCompare(item);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    const isInWishlist = wishlist.some((i) => i.id === id);
    isInWishlist ? removeFromWishlist(item) : addToWishlist(item);
  };

  // --- Seller Mode Handler ---
   const handleCardClick = () => {
      if (mode === 'seller') {
          // Navigate to the seller-specific product detail page
          navigate(`/seller/product/${id}`);
      }
       // Optional: could navigate to buyer detail page if mode is 'buyer'
       // else { navigate(`/product/${id}`); }
  };


  // --- Conditional Rendering based on Mode ---

  const renderBuyerButtons = () => (
    <>
      {/* Cart Button */}
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleAddToCart}
        disabled={stock_quantity <= 0}
        style={{
          ...styles.iconButtonBase, // Use base style
          ...styles.cartButton, // Specific position
          backgroundColor:
            stock_quantity > 0
              ? isHovered ? "#f9fafb" : "#ffffff"
              : "#f3f4f6",
          cursor: stock_quantity > 0 ? "pointer" : "not-allowed",
        }}
        aria-label="Add to cart"
      >
        <ShoppingCart size={16} color="#111827" />
      </button>

      {/* Compare Button */}
      <button
        onMouseEnter={() => setIsCompareHovered(true)}
        onMouseLeave={() => setIsCompareHovered(false)}
        onClick={handleAddToCompare}
        style={{
          ...styles.iconButtonBase,
          ...styles.compareButton,
          backgroundColor: compareItems.some(i => i.id === id)
            ? "#d1fae5"
            : isCompareHovered ? "#f9fafb" : "#ffffff",
          cursor: compareItems.some(i => i.id === id) ? "default" : "pointer",
          borderColor: compareItems.some(i => i.id === id) ? "#10b981" : "#e5e7eb",
        }}
         aria-label="Add to compare"
      >
        <BarChart2
          size={16}
          color={compareItems.some(i => i.id === id) ? "#10b981" : "#111827"}
        />
      </button>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        style={{
          ...styles.iconButtonBase,
          ...styles.wishlistButton,
          backgroundColor: "#ffffff", // Keep consistent background
          borderColor: "#e5e7eb",
        }}
         aria-label="Toggle wishlist"
      >
        <Heart
          size={16}
          color={wishlist.some(i => i.id === id) ? "#ef4444" : "#9ca3af"}
          fill={wishlist.some(i => i.id === id) ? "#ef4444" : "none"}
        />
      </button>
    </>
  );

  // NOTE: Seller action buttons aren't shown per the design, but could be added here
  // const renderSellerActionButtons = () => (
  //   <>
  //     <button onClick={(e) => { e.stopPropagation(); onViewDetailsClick(item); }} style={{...styles.iconButtonBase, ...styles.detailsButton}}><Eye size={16} /></button>
  //     <button onClick={(e) => { e.stopPropagation(); onEditClick(item); }} style={{...styles.iconButtonBase, ...styles.editButton}}><Edit size={16} /></button>
  //     <button onClick={(e) => { e.stopPropagation(); onDeleteClick(item); }} style={{...styles.iconButtonBase, ...styles.deleteButton}}><Trash2 size={16} /></button>
  //   </>
  // );

  const renderStars = () => {
      // Only render for buyer mode
     if (mode !== 'buyer') return null;

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5; // No half star shown, use full or empty
    const emptyStars = 5 - fullStars; // - (halfStar ? 1 : 0); simplified

    return (
      <div style={styles.stars}>
        {"★".repeat(fullStars)}
        {/* {halfStar && "☆"} half star symbol often looks weird */}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };


  return (
    // Add onClick for seller mode navigation
    <div
        style={{...styles.card, cursor: mode === 'seller' ? 'pointer' : 'default'}}
        onClick={handleCardClick} // Navigate on click in seller mode
    >
      <div style={styles.imageWrapper}>
        <img src={base64image} alt={title} style={styles.image} />
        {/* Render buttons based on mode */}
        {mode === 'buyer' && renderBuyerButtons()}
        {/* {mode === 'seller' && renderSellerActionButtons()} */}
      </div>

      <div style={styles.content}>
        <p style={styles.title}>{title || "No Title"}</p>

        {/* Only show stars for buyer mode */}
        {mode === 'buyer' && renderStars()}

         {/* Only show detailed specs for buyer mode */}
        {mode === 'buyer' && (
            <div style={styles.specs}>
                <p><strong>Brand:</strong> {brand || 'N/A'}</p>
                {speed && <p><strong>Speed:</strong> {speed} MHz</p>}
                {capacity && <p><strong>Capacity:</strong> {capacity}</p>}
            </div>
        )}

        {/* Price display */}
        <div style={styles.priceContainer}>
           {/* Show original price only in buyer mode and if discount exists */}
          {mode === 'buyer' && numericDiscount > 0 && (
            <span style={styles.originalPrice}>${numericPrice.toFixed(2)}</span>
          )}
          <span style={styles.finalPrice}>${finalPrice}</span>
           {/* Show discount only in buyer mode and if discount exists */}
          {mode === 'buyer' && numericDiscount > 0 && (
            <span style={styles.discount}> (-{numericDiscount}%)</span>
          )}
        </div>

        {/* Only show stock for buyer mode */}
        {mode === 'buyer' && (
             <p
                style={{
                    ...styles.stockStatus, // Use a dedicated style
                    color: stock_quantity > 0 ? "#22c55e" : "#f87171",
                }}
            >
                {stock_quantity > 0
                    ? `${stock_quantity} in stock`
                    : "Out of stock"}
            </p>
        )}
      </div>
    </div>
  );
}


// --- Styles --- (Combine and Refine)
const styles = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px", // Slightly less rounded?
    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
    overflow: "hidden",
    width: "280px", // Adjust width as needed
    display: "flex",
    flexDirection: "column",
    fontFamily: "system-ui, sans-serif", // Use system fonts
    border: "1px solid #e5e7eb",
    transition: "box-shadow 0.2s ease",
    color: "#1f2937", // Darker gray text
     // cursor added dynamically based on mode
     '&:hover': { // Basic hover effect
         boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
     }
  },
  imageWrapper: {
    width: "100%",
    height: "200px", // Adjust height as needed
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#f9fafb", // Light gray background for image area
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    maxWidth: "90%", // Don't let image touch edges
    maxHeight: "90%",
    objectFit: "contain",
  },
   iconButtonBase: { // Base style for all icon buttons
       position: "absolute",
       padding: "6px",
       borderRadius: "50%",
       border: "1px solid #e5e7eb",
       backgroundColor: "#ffffff",
       color: "#111827",
       display: "flex",
       alignItems: "center",
       justifyContent: "center",
       boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
       transition: "background-color 0.2s ease, box-shadow 0.2s ease",
       cursor: "pointer",
       zIndex: 2, // Ensure buttons are above image if needed
       '&:disabled': {
           cursor: 'not-allowed',
           backgroundColor: '#f3f4f6'
       }
   },
   cartButton: {
      top: "10px",
      right: "10px",
  },
  compareButton: {
       top: "10px",
       right: "50px",
  },
  wishlistButton: {
       top: "10px",
       right: "90px",
  },
  // Styles for potential seller buttons (adjust positions)
  // detailsButton: { top: "10px", right: "10px" },
  // editButton: { top: "10px", right: "50px" },
  // deleteButton: { top: "10px", right: "90px" },

  content: {
    padding: "12px 16px", // Adjust padding
    display: "flex",
    flexDirection: "column",
    gap: "6px", // Reduce gap slightly
    fontSize: "0.9rem", // Slightly smaller base font
    color: "#1f2937",
    flexGrow: 1, // Allow content to grow
  },
  title: {
    margin: "0",
    fontSize: "1rem", // Keep title prominent
    fontWeight: "500", // Medium weight
    color: "#111827", // Slightly darker title
    lineHeight: 1.3, // Allow wrapping
    // Clamp text to 2 lines (optional, requires more CSS)
    // display: '-webkit-box',
    // WebkitLineClamp: 2,
    // WebkitBoxOrient: 'vertical',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
    // minHeight: 'calc(1rem * 1.3 * 2)', // Reserve space for 2 lines
  },
  specs: { // Only shown for buyers
    fontSize: "0.8rem",
    color: "#6b7280", // Lighter gray for specs
    lineHeight: "1.4",
    marginTop: '4px',
  },
  priceContainer: {
    display: "flex",
    alignItems: "baseline", // Align text better
    gap: "8px",
    marginTop: 'auto', // Push price to the bottom
    paddingTop: '8px', // Add space above price
  },
  originalPrice: { // Only shown for buyers
    textDecoration: "line-through",
    color: "#9ca3af",
    fontSize: "0.85rem",
  },
  finalPrice: {
    fontWeight: "600", // Bold price
    fontSize: "1.15rem", // Make price stand out
    color: "#111827",
  },
  discount: { // Only shown for buyers
    color: "#dc2626", // Red for discount
    fontWeight: "500",
    fontSize: "0.8rem",
  },
  stars: { // Only shown for buyers
    display: "flex",
    gap: "2px",
    color: "#f59e0b", // Amber/Gold color for stars
    fontSize: '0.9rem', // Adjust star size
  },
   stockStatus: { // Only shown for buyers
       fontSize: '0.8rem',
       fontWeight: '500',
       margin: '4px 0 0 0', // Margin top
   }
};

export default ItemCard;