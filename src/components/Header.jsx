import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const Header = () => {
  const { getTotalItems } = useCart();
  const { user, logout } = useUser();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Handmade Art Gallery
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          
          {/* Authenticated User Navigation */}
          {user && user.role === 'seller' && (
            <Link to="/seller/dashboard">Dashboard</Link>
          )}
          {user && user.role === 'buyer' && (
            <Link to="/user/dashboard">My Account</Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/admin/dashboard">Admin Panel</Link>
          )}
          
          {/* Guest Navigation */}
          {!user && (
            <>
              <Link to="/signin">Sign In</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
          
          {/* Cart (always visible) */}
          <Link to="/cart" className="cart-icon">
            <ShoppingCart size={24} />
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </Link>
          
          {/* User Profile & Logout */}
          {user && (
            <div className="user-menu">
              <span className="user-greeting">
                Hi, {user.firstName}!
              </span>
              <button 
                onClick={logout} 
                className="logout-button"
                style={{ 
                  marginLeft: 8, 
                  background: 'rgba(255,255,255,0.2)', 
                  border: 'none', 
                  color: 'white', 
                  cursor: 'pointer', 
                  fontWeight: 500,
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 