import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useAdmin } from '../../context/AdminContext';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
  const { user, logout } = useUser();
  const { products } = useAdmin();
  const [sellerStats, setSellerStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  // Filter products by current seller (in a real app, you'd filter by seller ID)
  const sellerProducts = products; // For now, showing all products

  useEffect(() => {
    // Calculate seller statistics
    setSellerStats({
      totalProducts: sellerProducts.length,
      totalSales: 0, // TODO: Calculate from orders
      totalRevenue: 0, // TODO: Calculate from orders
      pendingOrders: 0 // TODO: Calculate from orders
    });
  }, [sellerProducts]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Seller Dashboard</h1>
          <p>Welcome back, {user.firstName}! Manage your artwork and sales</p>
        </div>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Seller Stats */}
        <div className="dashboard-card stats-card">
          <h3>Your Business Overview</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{sellerStats.totalProducts}</div>
              <div className="stat-label">Total Products</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{sellerStats.totalSales}</div>
              <div className="stat-label">Total Sales</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">₹{sellerStats.totalRevenue.toFixed(2)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{sellerStats.pendingOrders}</div>
              <div className="stat-label">Pending Orders</div>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="dashboard-card profile-card">
          <h3>Seller Profile</h3>
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
              <p className="role-badge seller">Seller Account</p>
            </div>
          </div>
          <Link to="/profile" className="profile-edit-btn">
            Edit Profile
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card actions-card">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/admin/dashboard" className="action-btn primary">
              <span className="icon">➕</span>
              Add New Product
            </Link>
            <Link to="/seller/products" className="action-btn">
              <span className="icon">📦</span>
              Manage Products
            </Link>
            <Link to="/seller/orders" className="action-btn">
              <span className="icon">📋</span>
              View Orders
            </Link>
            <Link to="/seller/analytics" className="action-btn">
              <span className="icon">📊</span>
              Analytics
            </Link>
          </div>
        </div>

        {/* Recent Products */}
        <div className="dashboard-card products-card">
          <h3>Your Recent Products</h3>
          {sellerProducts.length > 0 ? (
            <div className="products-preview">
              {sellerProducts.slice(0, 3).map(product => (
                <div key={product.id} className="product-preview">
                  <img 
                    src={product.images?.[0] || product.image || '/placeholder-art.jpg'} 
                    alt={product.title}
                    onError={(e) => {
                      e.target.src = '/placeholder-art.jpg';
                    }}
                  />
                  <div className="product-info">
                    <h4>{product.title}</h4>
                    <p>₹{product.price.toFixed(2)}</p>
                    <span className="product-category">{product.category}</span>
                  </div>
                </div>
              ))}
              {sellerProducts.length > 3 && (
                <div className="view-all">
                  <Link to="/admin/dashboard">View All Products →</Link>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <p>You haven't added any products yet</p>
              <Link to="/admin/dashboard" className="add-product-btn">
                Add Your First Product
              </Link>
            </div>
          )}
        </div>

        {/* Sales Performance */}
        <div className="dashboard-card performance-card">
          <h3>Sales Performance</h3>
          <div className="performance-metrics">
            <div className="metric">
              <span className="metric-label">This Month</span>
              <span className="metric-value">₹0.00</span>
              <span className="metric-change positive">+0%</span>
            </div>
            <div className="metric">
              <span className="metric-label">Last Month</span>
              <span className="metric-value">₹0.00</span>
            </div>
            <div className="metric">
              <span className="metric-label">Best Selling</span>
              <span className="metric-value">
                {sellerProducts.length > 0 ? sellerProducts[0].title : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Tips for Sellers */}
        <div className="dashboard-card tips-card">
          <h3>Seller Tips</h3>
          <div className="tips-list">
            <div className="tip">
              <span className="tip-icon">💡</span>
              <p>Add high-quality images to increase sales</p>
            </div>
            <div className="tip">
              <span className="tip-icon">📝</span>
              <p>Write detailed descriptions for your artwork</p>
            </div>
            <div className="tip">
              <span className="tip-icon">💰</span>
              <p>Price competitively based on market research</p>
            </div>
            <div className="tip">
              <span className="tip-icon">📱</span>
              <p>Respond quickly to customer inquiries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard; 