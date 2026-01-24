import React, { useState } from 'react';
type PageView = 'reset' | 'find-account';

const ForgotForm: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('reset');
  const [resetMethod, setResetMethod] = useState<'email' | 'sms'>('email');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+977');
  
  // Find account form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reset method:', resetMethod, 'Contact:', emailOrPhone);
  };

  const handleFindAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Find account:', { firstName, lastName, cardNumber });
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 md:py-20">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-8 md:p-12">
            <h1 className="text-3xl font-medium text-gray-800 mb-6">
              Forgot Email/Password
            </h1>

            {/* Password Reset Page */}
            {currentPage === 'reset' && (
              <form onSubmit={handleResetSubmit}>
                <p className="text-gray-600 mb-4">
                  How would you like to reset your password?
                </p>

                {/* Radio buttons */}
                <div className="space-y-3 mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="resetMethod"
                      value="email"
                      checked={resetMethod === 'email'}
                      onChange={(e) => setResetMethod(e.target.value as 'email')}
                      className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">Email</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="resetMethod"
                      value="sms"
                      checked={resetMethod === 'sms'}
                      onChange={(e) => setResetMethod(e.target.value as 'sms')}
                      className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">Text Message (SMS)</span>
                  </label>
                </div>

                {/* Dynamic description text */}
                <p className="text-gray-600 text-sm mb-4">
                  {resetMethod === 'email'
                    ? 'We will send you an email with instructions on how to reset your password'
                    : 'We will text you a verification code to reset your password. Message and data rates may apply.'}
                </p>

                {/* Input fields - changes based on reset method */}
                {resetMethod === 'email' ? (
                  <input
                    type="text"
                    placeholder="name@example.com"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
                  />
                ) : (
                  <div className="flex gap-2 mb-6">
                    {/* Country code dropdown */}
                    <div className="relative w-32">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full h-12 px-3 pr-8 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
                      >
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+41">🇨🇭 +41</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+49">🇩🇪 +49</option>
                        <option value="+977">🇳🇵 +977</option>
                        <option value="+91">🇮🇳 +91</option>
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Phone number input */}
                    <input
                      type="tel"
                      placeholder=""
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Submit button - text changes based on method */}
                <button
                  type="submit"
                  className="w-full bg-[#0080ff] hover:bg-[#0070e0] text-white font-medium py-3 rounded transition-colors duration-200"
                >
                  {resetMethod === 'email' ? 'Email Me' : 'Text Me'}
                </button>

                {/* Footer link */}
                <button
                  type="button"
                  onClick={() => setCurrentPage('find-account')}
                  className="block w-full text-center text-blue-600 hover:underline mt-6 text-sm"
                >
                  I don't remember my email or phone
                </button>
              </form>
            )}

            {/* Find Account Page */}
            {currentPage === 'find-account' && (
              <form onSubmit={handleFindAccountSubmit}>
                <p className="text-gray-600 mb-6">
                  Please provide this information to help us find your account (all fields required):
                </p>

                {/* First name */}
                <label className="block mb-4">
                  <span className="block text-sm text-gray-500 mb-2">First name on account</span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </label>

                {/* Last name */}
                <label className="block mb-4">
                  <span className="block text-sm text-gray-500 mb-2">Last name on account</span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </label>

                {/* Card number */}
                <label className="block mb-6">
                  <span className="block text-sm text-gray-500 mb-2">Credit or debit card number on file</span>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </label>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-[#0080ff] hover:bg-[#0070e0] text-white font-medium py-3 px-8 rounded transition-colors duration-200"
                  >
                    Find Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage('reset')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-8 rounded transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

  );
};

export default ForgotForm;
