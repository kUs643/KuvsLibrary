import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import logo from '/src/components/logoMesa de trabajo 1.png';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Special case for admin login
      if (email.toLowerCase() === 'kuvs' && password === 'nintendoiswack123') {
        const result = await onLogin({ 
          email: 'kuvs@example.com', 
          password: 'nintendoiswack123' 
        });
        
        if (!result.success) {
          throw new Error(result.message || 'Login failed');
        }
        return;
      }

      // Regular user login - append @example.com if no email is provided
      const loginEmail = email.includes('@') ? email : `${email}@example.com`;
      const result = await onLogin({ email: loginEmail, password });
      
      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Please contact Headcoach Kuvs in Discord for password reset.');
  };

  return (
    <div className="min-h-screen bg-kuvsbook-darker flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={logo}
            alt="KUVS Logo" 
            className="h-16 w-auto mx-auto"
          />
          <h1 className="mt-4 text-2xl font-bold text-white">KUV'S PLAYBOOK</h1>
          <p className="mt-1 text-gray-400">Valorant Strategies & Lineups</p>
        </div>
        
        {/* Login Form */}
        <div className="bg-[#2D283E] rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Team Login</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md flex items-center text-red-200">
                <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Username or Email
                  </label>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1E1A25] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                    placeholder="Enter your username or email"
                  />
                </div>
                
                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#1E1A25] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#802BB1] focus:border-transparent"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 bg-[#1E1A25] border-gray-700 rounded text-[#802BB1] focus:ring-[#802BB1]"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-[#802BB1] hover:text-[#9030d0]"
                  >
                    Forgot password?
                  </button>
                </div>
                
                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-[#802BB1] text-white py-2 px-4 rounded-md font-medium hover:bg-[#9030d0] transition-colors ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Footer */}
          <div className="px-8 py-4 bg-[#1E1A25] border-t border-gray-700">
            <p className="text-sm text-gray-400 text-center">
              Accounts are provisioned by coaches only. Contact team management for access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;