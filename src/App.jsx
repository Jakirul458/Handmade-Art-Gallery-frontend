import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { UserProvider } from './context/UserContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Booking from './pages/Booking';
import ProductDetails from './pages/ProductDetails';
import Signup from './pages/auth/Signup';
import Signin from './pages/auth/Signin';
import UserDashboard from './pages/user/UserDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <UserProvider>
      <AdminProvider>
        <CartProvider>
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
                  
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute allowedRoles={['admin', 'seller']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/booking" element={
                    <ProtectedRoute>
                      <Booking />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AdminProvider>
    </UserProvider>
  );
}

export default App;
