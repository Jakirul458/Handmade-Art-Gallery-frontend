import { useState } from 'react';
import { login as apiLogin, googleLogin } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await apiLogin(form);
      login(res.data.user, res.data.token);
      // Redirect based on role
      if (res.data.user.role === 'seller') navigate('/seller/dashboard');
      else if (res.data.user.role === 'buyer') navigate('/user/dashboard');
      else if (res.data.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  // Google login would use a popup and backend callback

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
      <button type="submit">Login</button>
      {error && <div>{error}</div>}
      {/* Google login button here */}
    </form>
  );
} 