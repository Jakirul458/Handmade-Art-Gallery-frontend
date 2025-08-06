import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getCart, createOrder } from '../services/api';
import AddressForm from '../components/AddressForm';

const Checkout = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState('cart'); // 'cart' or 'address'

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
      
      if (!response.data.cart.items || response.data.cart.items.length === 0) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (addressData) => {
    try {
      setSubmitting(true);
      
      // Create order with address data
      const orderData = {
        shippingAddress: addressData,
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price
        })),
        total: cart.total
      };

      const response = await createOrder(orderData);
      
      if (response.data.success) {
        alert('Order placed successfully! The seller will contact you soon.');
        navigate('/user/dashboard');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinueToAddress = () => {
    setStep('address');
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="loading-spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-container">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="continue-shopping-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <span className={`step ${step === 'cart' ? 'active' : 'completed'}`}>
            1. Review Cart
          </span>
          <span className={`step ${step === 'address' ? 'active' : ''}`}>
            2. Shipping Address
          </span>
        </div>
      </div>

      <div className="checkout-content">
        {step === 'cart' && (
          <div className="cart-review">
            <h2>Review Your Order</h2>
            
            <div className="cart-items">
              {cart.items.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="image-placeholder" style={{ display: 'none' }}>
                      🎨
                    </div>
                  </div>
                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <p className="item-category">{item.product.category}</p>
                    <p className="item-price">₹{item.price.toFixed(2)}</p>
                    <p className="item-quantity">Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-total">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{cart.total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{cart.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="checkout-actions">
              <button 
                onClick={handleBackToCart}
                className="back-btn"
              >
                Back to Cart
              </button>
              <button 
                onClick={handleContinueToAddress}
                className="continue-btn"
              >
                Continue to Address
              </button>
            </div>
          </div>
        )}

        {step === 'address' && (
          <div className="address-section">
            <AddressForm 
              onSubmit={handleAddressSubmit}
              loading={submitting}
            />
            
            <div className="address-actions">
              <button 
                onClick={() => setStep('cart')}
                className="back-btn"
                disabled={submitting}
              >
                Back to Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout; 