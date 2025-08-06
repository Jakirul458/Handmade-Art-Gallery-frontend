import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { login as apiLogin } from '../../services/api';

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginUser } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Handle browser autofill
  useEffect(() => {
    const handleAutofill = () => {
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      
      if (emailInput && passwordInput) {
        // Check if browser autofilled the fields
        if (emailInput.value && passwordInput.value) {
          console.log('Autofill detected:', { email: emailInput.value, password: passwordInput.value ? '***' : 'EMPTY' });
          setFormData({
            email: emailInput.value,
            password: passwordInput.value
          });
        }
      }
    };

    // Check for autofill multiple times with increasing delays
    const timers = [
      setTimeout(handleAutofill, 100),
      setTimeout(handleAutofill, 500),
      setTimeout(handleAutofill, 1000),
      setTimeout(handleAutofill, 2000)
    ];

    // Also listen for autofill events
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) emailInput.addEventListener('animationstart', handleAutofill);
    if (passwordInput) passwordInput.addEventListener('animationstart', handleAutofill);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      if (emailInput) emailInput.removeEventListener('animationstart', handleAutofill);
      if (passwordInput) passwordInput.removeEventListener('animationstart', handleAutofill);
    };
  }, []);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Get the redirect path from location state, default to home
  const redirectTo = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed:`, value ? '***' : 'EMPTY');
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password || formData.password.trim() === '') {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get actual DOM values in case React state is not synced
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    const actualEmail = emailInput ? emailInput.value : formData.email;
    const actualPassword = passwordInput ? passwordInput.value : formData.password;
    
    console.log('Form submission - React state:', { email: formData.email, password: formData.password ? '***' : 'EMPTY' });
    console.log('Form submission - DOM values:', { email: actualEmail, password: actualPassword ? '***' : 'EMPTY' });
    
    // Use DOM values if React state is empty
    const finalData = {
      email: actualEmail,
      password: actualPassword
    };
    
    // Additional check for password
    if (!finalData.password || finalData.password.trim() === '') {
      setErrors({ password: 'Password is required' });
      return;
    }
    
    if (!finalData.email || finalData.email.trim() === '') {
      setErrors({ email: 'Email is required' });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Sending login data:', { email: finalData.email, password: finalData.password ? '***' : 'EMPTY' });
      const response = await apiLogin(finalData);
      
      if (response.data.success) {
        // Login the user
        loginUser(response.data.user, response.data.token);
        
        // Redirect based on role or to intended page
        const user = response.data.user;
        if (redirectTo === '/') {
          // If coming from home, redirect based on role
          if (user.role === 'seller') {
            navigate('/seller/dashboard');
          } else if (user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/user/dashboard');
          }
        } else {
          // Redirect to the intended page
          navigate(redirectTo);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Hnadmade Art Gallery</h2>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              disabled={isLoading}
              autoComplete="current-password"
              required
              onBlur={(e) => {
                if (!e.target.value.trim()) {
                  setErrors(prev => ({ ...prev, password: 'Password is required' }));
                }
              }}
              onFocus={(e) => {
                // Force sync with DOM value on focus
                if (e.target.value && !formData.password) {
                  setFormData(prev => ({ ...prev, password: e.target.value }));
                }
              }}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
           
          </div>

          <div className="form-options">
            <Link to="/forgot-password" className="auth-link">
              Forgot your password?
            </Link>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;