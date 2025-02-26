import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance from '../api/axios';
import { setUser, loginUser } from '../store/actions/clientActions';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const AuthPage = () => {
  // Aktif sekmeyi "login" olarak başlat
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Login formu için
  const loginForm = useForm();
  
  // Signup formu için ayrı bir form instance'ı
  const signupForm = useForm({
    defaultValues: {
      role_id: "3" // Default müşteri rolü
    }
  });

  const selectedRole = signupForm.watch("role_id");

  // Rolleri çek
  useEffect(() => {
    const fetchRoles = async () => {
      if (activeTab !== 'signup') return;
      
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/roles');
        setRoles(response.data);
      } catch (err) {
        setError('Failed to fetch roles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [activeTab]);

  const onLoginSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await dispatch(loginUser({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe
      }));
      
      if (result.success) {
        toast.success('Successfully logged in!');
        navigate(-1);
      } else {
        toast.error(result.error);
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUpSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const submitData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role_id: Number(data.role_id)
      };

      if (data.role_id === "2") {
        submitData.store = {
          name: data.store_name,
          phone: data.store_phone,
          tax_no: data.store_tax_no,
          bank_account: data.store_bank_account
        };
      }

      await axiosInstance.post('/signup', submitData);
      toast.success('User created. Check your email for activation instructions.');
      navigate(-1);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred during signup';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tab Buttons */}
        <div className="flex border-b">
          <button
            type="button"
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'login' 
                ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'signup' 
                ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  {...loginForm.register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full p-2 border rounded"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    {...loginForm.register("password", { required: "Password is required" })}
                    className="w-full p-2 border rounded pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  {...loginForm.register("rememberMe")}
                  className="mr-2"
                />
                <label htmlFor="rememberMe" className="text-gray-700">Remember me</label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <form onSubmit={signupForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  {...signupForm.register("name", { 
                    required: "Name is required",
                    minLength: { value: 3, message: "Name must be at least 3 characters" }
                  })}
                  className="w-full p-2 border rounded"
                />
                {signupForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.name.message}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  {...signupForm.register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full p-2 border rounded"
                />
                {signupForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <label className="block text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    {...signupForm.register("password", { 
                      required: "Password is required",
                      minLength: { value: 8, message: "Password must be at least 8 characters" },
                      validate: {
                        hasNumber: (value) => /\d/.test(value) || "Password must contain at least one number",
                        hasUpperCase: (value) => /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                        hasLowerCase: (value) => /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
                        hasSpecialChar: (value) => 
                          /[!@#$%^&*.,;:'"(){}[\]<>?/\\|_+-=]/.test(value) || 
                          "Password must contain at least one special character"
                      }
                    })}
                    className="w-full p-2 border rounded pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showSignupPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {signupForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showSignupConfirmPassword ? "text" : "password"}
                    {...signupForm.register("confirmPassword", { 
                      required: "Please confirm your password",
                      validate: value => value === signupForm.watch('password') || "Passwords do not match"
                    })}
                    className="w-full p-2 border rounded pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showSignupConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {signupForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  {...signupForm.register("role_id")}
                  className="w-full p-2 border rounded"
                >
                  {roles.length > 0 ? (
                    roles.map(role => (
                      role.code !== 'admin' && // Admin rolünü gösterme
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))
                  ) : (
                    <option value="3">Müşteri</option>
                  )}
                </select>
              </div>

              {/* Store Fields - Conditional Rendering (role_id: 2 için) */}
              {selectedRole === "2" && (
                <>
                  {/* Store Name */}
                  <div>
                    <label className="block text-gray-700 mb-2">Store Name</label>
                    <input
                      type="text"
                      {...signupForm.register("store_name", { 
                        required: "Store name is required",
                        minLength: { value: 3, message: "Store name must be at least 3 characters" }
                      })}
                      className="w-full p-2 border rounded"
                    />
                    {signupForm.formState.errors.store_name && (
                      <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.store_name.message}</p>
                    )}
                  </div>

                  {/* Store Phone */}
                  <div>
                    <label className="block text-gray-700 mb-2">Store Phone</label>
                    <input
                      type="tel"
                      {...signupForm.register("store_phone", { 
                        required: "Store phone is required",
                        pattern: {
                          value: /^(\+90|0)?[0-9]{10}$/,
                          message: "Please enter a valid Turkish phone number"
                        }
                      })}
                      className="w-full p-2 border rounded"
                    />
                    {signupForm.formState.errors.store_phone && (
                      <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.store_phone.message}</p>
                    )}
                  </div>

                  {/* Tax ID */}
                  <div>
                    <label className="block text-gray-700 mb-2">Tax ID</label>
                    <input
                      type="text"
                      {...signupForm.register("store_tax_no", { 
                        required: "Tax ID is required",
                        pattern: {
                          value: /^T\d{9}V\d{2}$/,
                          message: "Please enter a valid Tax ID (Format: TXXXXXXXXVXX)"
                        }
                      })}
                      className="w-full p-2 border rounded"
                    />
                    {signupForm.formState.errors.store_tax_no && (
                      <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.store_tax_no.message}</p>
                    )}
                  </div>

                  {/* Bank Account */}
                  <div>
                    <label className="block text-gray-700 mb-2">Bank Account (IBAN)</label>
                    <input
                      type="text"
                      {...signupForm.register("store_bank_account", { 
                        required: "IBAN is required",
                        pattern: {
                          value: /^TR\d{2}\d{5}[A-Z0-9]{17}$/,
                          message: "Please enter a valid Turkish IBAN"
                        }
                      })}
                      className="w-full p-2 border rounded"
                    />
                    {signupForm.formState.errors.store_bank_account && (
                      <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.store_bank_account.message}</p>
                    )}
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 