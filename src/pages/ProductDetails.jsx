import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useState } from 'react';

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
  const { products } = useAdmin();
  const navigate = useNavigate();

  const product = products.find(p => p.id === id);
  const images = product && Array.isArray(product.images) && product.images.length > 0 ? product.images : [product?.image];
  const [currentImage, setCurrentImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  if (!product) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      <div style={{ position: 'relative', marginBottom: 24 }}>
        {!imageLoaded && (
          <div className="image-placeholder" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner"></div>
          </div>
        )}
        <img
          src={convertGoogleDriveLink(images[currentImage])}
          alt={product.title}
          className="product-details-image"
          style={{ maxWidth: 400, width: '100%', borderRadius: 12, display: imageLoaded ? 'block' : 'none' }}
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
      <h2>{product.title}</h2>
      <h3 style={{ color: '#e74c3c' }}>₹{product.price.toFixed(2)}</h3>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Dimensions:</strong> {product.dimensions}</p>
      <p><strong>Material:</strong> {product.material}</p>
      <p style={{ marginTop: 16 }}>{product.description}</p>
      <button className="add-to-cart-btn" onClick={() => navigate('/cart')}>Go to Cart</button>
    </div>
  );
};

export default ProductDetails; 