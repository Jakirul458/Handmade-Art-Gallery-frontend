import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import Signup from './pages/auth/Signup';
import Signin from './pages/auth/Signin';
import UserDashboard from './pages/user/UserDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import ProductForm from './components/ProductForm';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

// Loading component
const LoadingScreen = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '18px'
  }}>
    <div>Loading...</div>
  </div>
);

// Main app content
const AppContent = () => {
  const { loading } = useUser();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            
            {/* Protected Routes */}
            <Route path="/user/dashboard" element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/seller/dashboard" element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/seller/add-product" element={
              <ProtectedRoute allowedRoles={['seller']}>
                <ProductForm />
              </ProtectedRoute>
            } />
            
            <Route path="/seller/edit-product/:productId" element={
              <ProtectedRoute allowedRoles={['seller']}>
                <ProductForm />
              </ProtectedRoute>
            } />
            
            <Route path="/checkout" element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <Checkout />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
