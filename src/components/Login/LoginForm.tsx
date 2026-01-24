import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
      <h2 className="text-white text-4xl mb-8 font-semibold">Sign In</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-orange-500 p-3 rounded text-white text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-neutral-700 rounded-md px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-neutral-700 rounded-md px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 py-3 text-white rounded-md w-full mt-4 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="flex flex-row items-center gap-4 mt-8 justify-center">
        <div
          onClick={() => navigate('/forgot')}
          className="text-neutral-400 hover:underline cursor-pointer text-sm"
        >
          Forgot password?
        </div>
      </div>

      <p className="text-neutral-400 mt-12">
        New to Notflix?{' '}
        <span
          onClick={() => navigate('/register')}
          className="text-white ml-1 hover:underline cursor-pointer"
        >
          Sign up now
        </span>
        .
      </p>
    </div>
  );
};

export default LoginForm;
