import { useState } from 'react';
import { forgotPassword } from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await forgotPassword({ email });
      setMsg('Check your email for reset instructions.');
    } catch {
      setMsg('Failed to send reset email.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <button type="submit">Send Reset Link</button>
      {msg && <div>{msg}</div>}
    </form>
  );
} 