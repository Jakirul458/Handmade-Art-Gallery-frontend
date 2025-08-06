import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  const categories = ['All', 'Paintings', 'Bottle Art', 'Sketches', 'Portraits', 'Digital Art', 'Sculptures'];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5003/api/products');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(product => product.category === selectedCategory)
      );
    }
  }, [selectedCategory, products]);

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
        <h1>Welcome to Handmade Artisan Gallery</h1>
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3>Loading products...</h3>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ color: '#6c757d', marginBottom: '1rem' }}>
            {products.length === 0 ? 'No products available yet' : 'No products found in this category'}
          </h3>
          <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
            {products.length === 0 
              ? 'Sellers will add products soon. Check back later!' 
              : 'Try selecting a different category or check back later.'
            }
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default HomePage; 