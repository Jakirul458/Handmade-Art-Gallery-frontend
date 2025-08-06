import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import { getCart } from '../../services/api';

const UserDashboard = () => {
  const { user, logout } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // Fetch cart data
          const cart = await getCart();
          setCartItems(cart.items || []);
          setCartTotal(cart.total || 0);
          
          // TODO: Fetch user's recent orders and wishlist from API
          // For now, using placeholder data
          setRecentOrders([]);
          setWishlist([]);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCartItems([]);
          setCartTotal(0);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user.firstName}!</h1>
          <p>Manage your orders, wishlist, and account settings</p>
        </div>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Quick Stats */}
        <div className="dashboard-card stats-card">
          <h3>Quick Overview</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{cartItems.length}</div>
              <div className="stat-label">Items in Cart</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">₹{cartTotal.toFixed(2)}</div>
              <div className="stat-label">Cart Value</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{recentOrders.length}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{wishlist.length}</div>
              <div className="stat-label">Wishlist Items</div>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="dashboard-card profile-card">
          <h3>Profile Information</h3>
          <div className="profile-info">
            <div className="profile-avatar">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
              )}
            </div>
            <div className="profile-details">
              <h4>{user.firstName} {user.lastName}</h4>
              <p>{user.email}</p>
              {user.phone && <p>{user.phone}</p>}
              <p className="role-badge buyer">Buyer Account</p>
            </div>
          </div>
          <Link to="/profile" className="profile-edit-btn">
            Edit Profile
          </Link>
        </div>

        {/* Current Cart */}
        <div className="dashboard-card cart-card">
          <h3>Current Cart</h3>
          {cartItems.length > 0 ? (
            <div className="cart-preview">
              <div className="cart-items-preview">
                {cartItems.slice(0, 3).map(item => (
                  <div key={item.product._id} className="cart-item-preview">
                    <img src={item.product.images[0]} alt={item.product.name} />
                    <div className="item-details">
                      <span className="item-title">{item.product.name}</span>
                      <span className="item-price">₹{item.price}</span>
                    </div>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <p className="more-items">+{cartItems.length - 3} more items</p>
                )}
              </div>
              <div className="cart-actions">
                <Link to="/cart" className="view-cart-btn">
                  View Full Cart (₹{cartTotal.toFixed(2)})
                </Link>
              </div>
            </div>
          ) : (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <Link to="/" className="browse-btn">
                Browse Artworks
              </Link>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="dashboard-card orders-card">
          <h3>Recent Orders</h3>
          {recentOrders.length > 0 ? (
            <div className="orders-list">
              {recentOrders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <span className="order-id">#{order.id}</span>
                    <span className="order-date">{order.date}</span>
                  </div>
                  <div className="order-status">
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-total">₹{order.total}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No orders yet</p>
              <Link to="/" className="browse-btn">
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card actions-card">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/" className="action-btn primary">
              <span className="icon">🎨</span>
              Browse Gallery
            </Link>
            <Link to="/cart" className="action-btn">
              <span className="icon">🛒</span>
              View Cart
            </Link>
            <Link to="/orders" className="action-btn">
              <span className="icon">📦</span>
              Order History
            </Link>
            <Link to="/profile" className="action-btn">
              <span className="icon">👤</span>
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Recommendations */}
        <div className="dashboard-card recommendations-card">
          <h3>Recommended for You</h3>
          <div className="recommendations">
            <p>Based on your browsing history and preferences</p>
            <Link to="/?category=Canvas Painting" className="recommendation-link">
              Canvas Paintings →
            </Link>
            <Link to="/?category=Portrait" className="recommendation-link">
              Custom Portraits →
            </Link>
            <Link to="/?category=Bottle Painting" className="recommendation-link">
              Bottle Art →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;