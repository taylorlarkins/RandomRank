import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) setMessage(error.message);
    else setMessage('Check your email for a confirmation link!');
    setLoading(false);
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) setMessage(error.message);
    else setMessage('Signed in successfully!');
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', textAlign: 'center' }}>
      <h1>Welcome to RandomRank</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: '8px', margin: '8px 0' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: '8px', margin: '8px 0' }}
      />
      <div style={{ margin: '12px 0' }}>
        <button onClick={handleSignUp} disabled={loading}>
          Sign Up
        </button>
        <button onClick={handleSignIn} disabled={loading} style={{ marginLeft: 8 }}>
          Sign In
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
