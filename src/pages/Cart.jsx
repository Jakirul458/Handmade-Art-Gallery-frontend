import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/booking');
  };

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <p>Your cart is empty.</p>
        <button 
          className="add-to-cart-btn"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      
      {items.map(item => (
        <div key={item.id} className="cart-item">
          <img 
            src={item.image} 
            alt={item.title} 
            className="cart-item-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/80x80?text=Art+Work';
            }}
          />
          
          <div className="cart-item-info">
            <h3 className="cart-item-title">{item.title}</h3>
            <p className="cart-item-price">₹{item.price.toFixed(2)}</p>
          </div>
          
          <div className="quantity-controls">
            <button 
              className="quantity-btn"
              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
            >
              <Minus size={16} />
            </button>
            <span>{item.quantity}</span>
            <button 
              className="quantity-btn"
              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
            >
              <Plus size={16} />
            </button>
          </div>
          
          <button 
            className="quantity-btn"
            onClick={() => removeFromCart(item.id)}
            style={{ backgroundColor: '#ff4757', color: 'white', border: 'none' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      
      <div className="cart-total">
        <p>Total: ₹{getTotalPrice().toFixed(2)}</p>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button 
          className="checkout-btn"
          style={{ backgroundColor: '#e74c3c' }}
          onClick={clearCart}
        >
          Clear Cart
        </button>
        <button 
          className="checkout-btn"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart; 