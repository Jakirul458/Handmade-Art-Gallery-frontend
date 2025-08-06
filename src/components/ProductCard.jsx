import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  // Handle both single image and multiple images
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : [];
  const [currentImage, setCurrentImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setImageLoaded(false);
    setImageError(false);
  };
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setImageLoaded(false);
    setImageError(false);
  };

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="product-card">
        <div className="product-image-container" style={{ position: 'relative' }}>
          {!imageLoaded && (
            <div className="image-placeholder">
              <div className="loading-spinner"></div>
            </div>
          )}
          {images.length > 0 ? (
            <img
              src={convertGoogleDriveLink(images[currentImage])}
              alt={product.title}
              className={`product-image ${imageLoaded ? 'loaded' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: imageLoaded && !imageError ? 'block' : 'none' }}
            />
          ) : null}
          
          {(imageError || images.length === 0) && (
            <div className="image-error">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem', opacity: 0.3 }}>🎨</div>
                <span>No image available</span>
              </div>
            </div>
          )}
          {images.length > 1 && (
            <>
              <button
                className="carousel-arrow left"
                onClick={prevImage}
                style={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18 }}
                aria-label="Previous image"
              >
                &#8249;
              </button>
              <button
                className="carousel-arrow right"
                onClick={nextImage}
                style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18 }}
                aria-label="Next image"
              >
                &#8250;
              </button>
            </>
          )}
        </div>
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <div className="product-price">₹{product.price.toFixed(2)}</div>
          <p className="product-description">
            {product.description.length > 100
              ? `${product.description.substring(0, 100)}...`
              : product.description
            }
          </p>
          <button
            className="add-to-cart-btn"
            onClick={e => { e.preventDefault(); handleAddToCart(e); }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 