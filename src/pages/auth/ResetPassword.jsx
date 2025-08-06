import { useState } from 'react';
import { resetPassword } from '../../services/api';
import { useParams } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await resetPassword({ token, password });
      setMsg('Password reset! You can now log in.');
    } catch {
      setMsg('Failed to reset password.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New Password" required />
      <button type="submit">Reset Password</button>
      {msg && <div>{msg}</div>}
    </form>
  );
} 