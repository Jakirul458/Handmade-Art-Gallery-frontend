import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProductById, addToCart } from '../services/api';
import { useUser } from '../context/UserContext';

function convertGoogleDriveLink(url) {
  if (!url) return '';
  if (url.includes('drive.google.com/uc?export=view&id=')) return url;
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  const fileId = fileIdMatch ? fileIdMatch[1] : null;
  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  return url;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart({ productId: product._id, quantity });
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    // Add to cart first, then navigate to checkout
    handleAddToCart().then(() => {
      navigate('/checkout');
    });
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  const images = product && Array.isArray(product.images) && product.images.length > 0 ? product.images : [product?.image];

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setImageLoaded(false);
    setImageError(false);
  };
  
  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setImageLoaded(false);
    setImageError(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      <div className="product-details-grid">
        {/* Product Images */}
        <div className="product-images-section">
          <div className="main-image-container">
            {!imageLoaded && (
              <div className="image-placeholder">
                <div className="loading-spinner"></div>
              </div>
            )}
            <img
              src={convertGoogleDriveLink(images[currentImage])}
              alt={product.name}
              className="product-details-image"
              onLoad={() => setImageLoaded(true)}
              onError={() => { setImageError(true); setImageLoaded(true); }}
            />
            {imageError && (
              <div className="image-error">
                <span>Image not available</span>
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  className="carousel-arrow left"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  &#8249;
                </button>
                <button
                  className="carousel-arrow right"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  &#8250;
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="image-thumbnails">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${index === currentImage ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentImage(index);
                    setImageLoaded(false);
                    setImageError(false);
                  }}
                >
                  <img
                    src={convertGoogleDriveLink(image)}
                    alt={`${product.name} - Image ${index + 1}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-price">₹{product.price.toFixed(2)}</div>
          
          <div className="product-details">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Dimensions:</strong> {product.dimensions}</p>
            <p><strong>Material:</strong> {product.materials}</p>
            <p><strong>Stock:</strong> {product.stock} available</p>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              {[...Array(Math.min(10, product.stock))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            
            <button 
              className="buy-now-btn"
              onClick={handleBuyNow}
              disabled={addingToCart}
            >
              Buy Now
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <button 
              className="continue-shopping-btn"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </button>
            
            <button 
              className="go-to-cart-btn"
              onClick={handleGoToCart}
            >
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 