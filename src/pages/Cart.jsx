import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getCart, updateCartItem, removeFromCart } from '../services/api';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchCart();
  }, [user, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      setCart(response.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(prev => ({ ...prev, [itemId]: true }));
      await updateCartItem(itemId, { quantity: newQuantity });
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      try {
        await removeFromCart(itemId);
        await fetchCart();
      } catch (error) {
        console.error('Error removing item:', error);
      }
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">
          <ShoppingBag size={64} />
        </div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any products to your cart yet.</p>
        <button onClick={handleContinueShopping} className="continue-shopping-btn">
          <ArrowLeft size={20} />
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button onClick={handleContinueShopping} className="back-btn">
          <ArrowLeft size={20} />
          Continue Shopping
        </button>
        <h1>Shopping Cart</h1>
        <p className="cart-subtitle">
          {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="cart-content">
        <div className="cart-items-section">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="image-placeholder">
                    🎨
                  </div>
                </div>

                <div className="item-details">
                  <h3 className="item-name">{item.product.name}</h3>
                  <p className="item-category">{item.product.category}</p>
                  <p className="item-price">₹{item.price.toFixed(2)}</p>
                  
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={updating[item._id] || item.quantity <= 1}
                        className="quantity-btn"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        disabled={updating[item._id]}
                        className="quantity-btn"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="remove-btn"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  <span className="total-amount">₹{(item.price * item.quantity).toFixed(2)}</span>
                  <span className="total-label">Total</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            
            <div className="summary-items">
              <div className="summary-row">
                <span>Subtotal ({cart.items.length} items)</span>
                <span>₹{cart.total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">Free</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{cart.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="checkout-actions">
              <button 
                onClick={handleCheckout}
                className="checkout-btn"
                disabled={cart.items.length === 0}
              >
                Proceed to Checkout
              </button>
              
              <button 
                onClick={handleContinueShopping}
                className="continue-shopping-btn"
              >
                Continue Shopping
              </button>
            </div>

            <div className="cart-info">
              <h4>Shipping Information</h4>
              <ul>
                <li>Free shipping on all orders</li>
                <li>Orders are processed within 24 hours</li>
                <li>Sellers will contact you for delivery details</li>
                <li>Secure payment processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 