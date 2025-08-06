import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getSellerProducts, getSellerOrders } from '../../services/api';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  Phone,
  MapPin
} from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.role !== 'seller') {
      navigate('/');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        getSellerProducts(),
        getSellerOrders()
      ]);
      
      setProducts(productsRes.data.products || []);
      setOrders(ordersRes.data.orders || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigate('/seller/add-product');
  };

  const handleEditProduct = (productId) => {
    navigate(`/seller/edit-product/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(p => p._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      shipped: '📦',
      delivered: '🎉',
      cancelled: '❌'
    };
    return icons[status] || '📋';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome back, {user?.firstName}!</h1>
            <p>Here's what's happening with your store today</p>
          </div>
          <button onClick={handleAddProduct} className="add-product-btn">
            <Plus size={20} />
            Add New Product
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-number">{products.length}</p>
            <span className="stat-label">Active listings</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-number">{orders.length}</p>
            <span className="stat-label">All time</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>Revenue</h3>
            <p className="stat-number">₹{totalRevenue.toFixed(2)}</p>
            <span className="stat-label">Total earnings</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <span>⏳</span>
          </div>
          <div className="stat-content">
            <h3>Pending Orders</h3>
            <p className="stat-number">{pendingOrders.length}</p>
            <span className="stat-label">Need attention</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
        >
          Orders ({orders.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="overview-grid">
              <div className="recent-orders">
                <h3>Recent Orders</h3>
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="order-preview">
                    <div className="order-info">
                      <span className="order-id">#{order._id.slice(-8)}</span>
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </div>
                    <div className="order-details">
                      <p>₹{order.total.toFixed(2)} • {order.items.length} items</p>
                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="empty-state">No orders yet</p>
                )}
              </div>

              <div className="top-products">
                <h3>Top Products</h3>
                {products.slice(0, 5).map((product) => (
                  <div key={product._id} className="product-preview">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="product-thumbnail"
                    />
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>₹{product.price.toFixed(2)}</p>
                      <span className="stock-info">Stock: {product.stock}</span>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <p className="empty-state">No products yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-header">
              <h2>My Products</h2>
              <button onClick={handleAddProduct} className="add-btn">
                <Plus size={16} />
                Add Product
              </button>
            </div>

            {products.length === 0 ? (
              <div className="empty-products">
                <Package size={64} />
                <h3>No products yet</h3>
                <p>Start selling by adding your first product</p>
                <button onClick={handleAddProduct} className="primary-btn">
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="image-placeholder">🎨</div>
                    </div>
                    
                    <div className="product-content">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-category">{product.category}</p>
                      <p className="product-price">₹{product.price.toFixed(2)}</p>
                      <p className="product-stock">Stock: {product.stock}</p>
                      
                      <div className="product-actions">
                        <button
                          onClick={() => handleEditProduct(product._id)}
                          className="edit-btn"
                          title="Edit product"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="delete-btn"
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Orders</h2>
            
            {orders.length === 0 ? (
              <div className="empty-orders">
                <ShoppingCart size={64} />
                <h3>No orders yet</h3>
                <p>Orders from customers will appear here</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div className="order-id-section">
                        <h3>Order #{order._id.slice(-8)}</h3>
                        <span className="order-date">
                          <Calendar size={16} />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </div>

                    <div className="order-details">
                      <div className="customer-info">
                        <h4>Customer Information</h4>
                        <div className="customer-details">
                          <p>
                            <User size={16} />
                            {order.buyer.firstName} {order.buyer.lastName}
                          </p>
                          <p>
                            <Phone size={16} />
                            {order.shippingAddress.phone}
                          </p>
                          <p>
                            <MapPin size={16} />
                            {order.shippingAddress.address}, {order.shippingAddress.city}
                          </p>
                        </div>
                      </div>

                      <div className="order-items">
                        <h4>Order Items</h4>
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="item-thumbnail"
                            />
                            <div className="item-info">
                              <h5>{item.product.name}</h5>
                              <p>Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                            </div>
                            <span className="item-total">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="order-summary">
                        <div className="summary-row">
                          <span>Subtotal:</span>
                          <span>₹{order.total.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                          <span>Shipping:</span>
                          <span>Free</span>
                        </div>
                        <div className="summary-row total">
                          <span>Total:</span>
                          <span>₹{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="order-actions">
                      <button className="view-details-btn">
                        <Eye size={16} />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard; 