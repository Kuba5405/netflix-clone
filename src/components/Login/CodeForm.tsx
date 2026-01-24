import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login attempted with email: ${email}`);
  };

  return (
    <div className="w-full max-w-lg bg-black/75 rounded-md sm:rounded-md px-6 sm:px-16 py-8 sm:py-12 mt-8 sm:mt-0 text-white">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Sign In</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email or mobile number"
            className="w-full rounded-md bg-[#333] text-white placeholder-gray-400 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center mt-2 mb--2 self-center text-sm text-gray-400">
            Message and Data rates may apply
        </div>

        <button
          type="submit"
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-md py-3 text-center text-sm sm:text-base font-semibold"
        >
          Send Sign-In Code
        </button>

        <div className="flex items-center gap-3 mt-2">
          <div className="h-px flex-1 bg-[#737373]" />
          <span className="text-xs uppercase text-gray-400">or</span>
          <div className="h-px flex-1 bg-[#737373]" />
        </div>

        <button
          type="button"
          className="w-full bg-[#333] hover:bg-[#404040] transition-colors duration-200 rounded-md py-3 text-center text-sm sm:text-base font-semibold mt-2"
          onClick={() => { window.location.href = '../login'; }}
        >
          Use password
        </button>

        <div className="flex items-center mt-2 marginx-auto self-center">
          <button type="button" className="text-white text-md underline hover:text-gray-500 cursor-pointer" onClick={() => { navigate('/forgot'); }}>
            Forgot Email or Phone Number?
          </button>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="h-4 w-4 accent-blue-600" defaultChecked />
            <span>Remember me</span>
          </label>
        </div>
      </form>

      <div className="mt-4 text-sm text-gray-400">
        <p className="mb-3">
          New to Notflix?{' '}
          <button type="button" className="text-white hover:underline cursor-pointer" onClick={() => { navigate('/register'); }}>
            Sign up now
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
