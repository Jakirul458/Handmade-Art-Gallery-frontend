import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { categories } from '../data/sampleProducts';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const { products } = useAdmin();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Only use admin-added products, no sample products
  const displayProducts = products;

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(displayProducts);
    } else {
      setFilteredProducts(
        displayProducts.filter(product => product.category === selectedCategory)
      );
    }
  }, [selectedCategory, displayProducts]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
  };

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Handmade Artician Gallery</h1>
        <p>Discover unique handcrafted paintings, bottle art, sketches, and portraits that will transform your living space into a masterpiece.</p>
      </section>

      {/* Category Dropdown */}
      <div className="category-dropdown-container">
        <div className="category-dropdown" ref={dropdownRef}>
          <button 
            className="category-dropdown-button"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
          >
            <span>Category: {selectedCategory}</span>
            <span className={`dropdown-arrow ${isCategoryDropdownOpen ? 'open' : ''}`}>▼</span>
          </button>
          
          {isCategoryDropdownOpen && (
            <div className="category-dropdown-menu">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-dropdown-item ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ color: '#6c757d', marginBottom: '1rem' }}>
            {products.length === 0 ? 'No products available yet' : 'No products found in this category'}
          </h3>
          <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
            {products.length === 0 
              ? 'Please add some products through the admin panel to get started.' 
              : 'Try selecting a different category or check back later.'
            }
          </p>
          {products.length === 0 && (
            <button 
              className="add-to-cart-btn"
              onClick={() => navigate('/admin')}
              style={{ maxWidth: '200px' }}
            >
              Go to Admin Panel
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage; 