import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Trash2, Edit } from 'lucide-react';

const AdminDashboard = () => {
  const { isAuthenticated, logout, products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    images: [], // Array for image URLs
    driveLinks: '', // Textarea for Google Drive links
    dimensions: '',
    material: ''
  });
  const [localImages, setLocalImages] = useState([]); // For local file uploads
  const [imagePreview, setImagePreview] = useState([]); // For image preview
  const [uploadStatus, setUploadStatus] = useState(''); // Upload status message
  const [isUploading, setIsUploading] = useState(false); // Upload loading state
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 files
    setLocalImages(files);
    
    // Create preview URLs
    const previews = files.map(file => ({
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2), // Size in MB
      url: URL.createObjectURL(file)
    }));
    setImagePreview(previews);
    
    // Clear any previous upload status
    setUploadStatus('');
  };

  const handleDriveLinksChange = (e) => {
    setFormData(prev => ({
      ...prev,
      driveLinks: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadStatus('');
    let uploadedImageUrls = [];

    try {
      // 1. Upload local images if any
      if (localImages.length > 0) {
        setUploadStatus('Uploading images...');
        const formDataFiles = new FormData();
        localImages.forEach(file => formDataFiles.append('images', file));
        
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formDataFiles
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }
        
        if (data.success && data.urls) {
          uploadedImageUrls = [...uploadedImageUrls, ...data.urls];
          setUploadStatus(`✅ ${data.urls.length} image(s) uploaded successfully`);
        }
      }

      // 2. Process Google Drive links
      if (formData.driveLinks) {
        setUploadStatus(prev => prev + '\nProcessing Google Drive links...');
        const driveLinksArr = formData.driveLinks
          .split('\n')
          .map(link => link.trim())
          .filter(link => link);
        
        // Validate and convert each Google Drive link
        for (const link of driveLinksArr) {
          try {
            const validateResponse = await fetch('http://localhost:5000/validate-drive-link', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: link })
            });
            const validateData = await validateResponse.json();
            if (validateData.convertedUrl) {
              uploadedImageUrls.push(validateData.convertedUrl);
            }
          } catch (err) {
            console.warn('Failed to validate drive link:', link);
            uploadedImageUrls.push(link); // Add as-is if validation fails
          }
        }
      }

      if (uploadedImageUrls.length === 0 && !editingProduct) {
        throw new Error('Please add at least one image');
      }

      setUploadStatus('Saving product...');

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        images: uploadedImageUrls,
        image: uploadedImageUrls[0] || '', // Set first image as primary
        inStock: true
      };

      if (editingProduct) {
        updateProduct({ ...productData, id: editingProduct.id });
        setEditingProduct(null);
      } else {
        addProduct(productData);
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        images: [],
        driveLinks: '',
        dimensions: '',
        material: ''
      });
      setLocalImages([]);
      setImagePreview([]);
      setShowAddForm(false);
      setSuccessMessage(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Error:', error);
      setUploadStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(''), 5000);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      images: product.images || [],
      driveLinks: product.images?.map(img => img).join('\n') || '',
      dimensions: product.dimensions || '',
      material: product.material || ''
    });
    setLocalImages([]); // Clear local images when editing
    setImagePreview([]); // Clear image preview when editing
    setUploadStatus(''); // Clear upload status
    setShowAddForm(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  // Helper function to convert Google Drive links
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {successMessage && (
        <div style={{ 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          padding: '1rem', 
          borderRadius: '6px', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {successMessage}
        </div>
      )}

      <div className="add-product-form">
        <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
        
        {!showAddForm && !editingProduct && (
          <button 
            className="add-product-btn"
            onClick={() => setShowAddForm(true)}
          >
            Add New Product
          </button>
        )}

        {(showAddForm || editingProduct) && (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Product Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #ecf0f1',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="Bottle Painting">Bottle Painting</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Canvas Painting">Canvas Painting</option>
                  <option value="Sketch">Sketch</option>
                  <option value="Ceramic">Ceramic</option>
                  <option value="Watercolor">Watercolor</option>
                  <option value="Oil Painting">Oil Painting</option>
                  <option value="Acrylic Painting">Acrylic Painting</option>
                  <option value="Digital Art">Digital Art</option>
                  <option value="Mixed Media">Mixed Media</option>
                  <option value="Sculpture">Sculpture</option>
                  <option value="Home Decor">Home Decor</option>
                  <option value="Cup Painting">Cup Painting</option>
                  <option value="T-Shirt Painting">T-Shirt Painting</option>
                  <option value="Mandela Art">Mandela Art</option>
                  <option value="Custom Orders">Custom Orders</option>
                  
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="images">Product Images (up to 5, local upload)</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #ecf0f1',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
                <small style={{ color: '#6c757d', fontSize: '0.85rem' }}>
                  Supported formats: JPG, PNG, GIF, WebP (Max 5MB per image)
                </small>
              </div>
            </div>

            {/* Image Preview Section */}
            {imagePreview.length > 0 && (
              <div className="form-group">
                <label>Image Preview</label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                  gap: '1rem',
                  marginTop: '0.5rem'
                }}>
                  {imagePreview.map((preview, index) => (
                    <div key={index} style={{
                      border: '2px solid #ecf0f1',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      textAlign: 'center'
                    }}>
                      <img 
                        src={preview.url} 
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          marginBottom: '0.5rem'
                        }}
                      />
                      <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                        <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                          {preview.name.length > 20 ? 
                            `${preview.name.substring(0, 17)}...` : 
                            preview.name
                          }
                        </div>
                        <div>{preview.size} MB</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Status */}
            {uploadStatus && (
              <div style={{
                padding: '1rem',
                borderRadius: '6px',
                margin: '1rem 0',
                backgroundColor: uploadStatus.includes('❌') ? '#f8d7da' : '#d4edda',
                color: uploadStatus.includes('❌') ? '#721c24' : '#155724',
                border: `1px solid ${uploadStatus.includes('❌') ? '#f5c6cb' : '#c3e6cb'}`,
                whiteSpace: 'pre-line',
                fontSize: '0.9rem'
              }}>
                {uploadStatus}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="driveLinks">Google Drive Image Links (one per line)</label>
                <textarea
                  id="driveLinks"
                  name="driveLinks"
                  value={formData.driveLinks}
                  onChange={handleDriveLinksChange}
                  rows={3}
                  placeholder="Paste Google Drive image links, one per line"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ecf0f1' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dimensions">Dimensions</label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleInputChange}
                  placeholder="e.g., 16 x 20"
                />
              </div>
              <div className="form-group">
                <label htmlFor="material">Material</label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  placeholder="e.g., Acrylic on Canvas"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '2px solid #ecf0f1',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="submit" 
                className="add-product-btn"
                disabled={isUploading}
                style={{ 
                  opacity: isUploading ? 0.7 : 1,
                  cursor: isUploading ? 'not-allowed' : 'pointer'
                }}
              >
                {isUploading ? 
                  '⏳ Processing...' : 
                  (editingProduct ? 'Update Product' : 'Add Product')
                }
              </button>
              <button 
                type="button"
                className="add-product-btn"
                style={{ backgroundColor: '#7f8c8d' }}
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                  setFormData({
                    title: '',
                    description: '',
                    price: '',
                    category: '',
                    images: [],
                    driveLinks: '',
                    dimensions: '',
                    material: ''
                  });
                  setLocalImages([]);
                  setImagePreview([]);
                  setUploadStatus('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div>
        <h3>Current Products ({products.length})</h3>
        <div className="products-grid">
          {products.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="product-card">
                <div className="product-image-container">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={convertGoogleDriveLink(product.images[0])} 
                      alt={product.title} 
                      className="product-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : product.image ? (
                    <img 
                      src={convertGoogleDriveLink(product.image)} 
                      alt={product.title} 
                      className="product-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="image-error" style={{ display: 'none' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '0.5rem', opacity: 0.3 }}>🎨</div>
                      <span>No image available</span>
                    </div>
                  </div>
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
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="quantity-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(product);
                      }}
                      style={{ backgroundColor: '#3498db', color: 'white', border: 'none' }}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="quantity-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(product.id);
                      }}
                      style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>
            No products added yet. Add your first product above!
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 