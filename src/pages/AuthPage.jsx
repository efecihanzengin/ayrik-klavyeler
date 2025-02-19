import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance from '../api/axios';
import { setUser, loginUser } from '../store/actions/clientActions';
import { toast } from 'react-toastify';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      role_id: "3"
    }
  });

  const selectedRole = watch("role_id");

  // Rolleri çek
  useEffect(() => {
    const fetchRoles = async () => {
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

    if (activeTab === 'signup') {
      fetchRoles();
    }
  }, [activeTab]);

  const onLoginSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
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
    
    setIsLoading(false);
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

  if (isLoading && activeTab === 'signup') {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Tab Buttons */}
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 ${activeTab === 'login' ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 'signup' ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="w-full p-2 border rounded"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="w-full p-2 border rounded"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="mr-2"
              />
              <label className="text-gray-700">Remember me</label>
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
          <form onSubmit={handleSubmit(onSignUpSubmit)} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                {...register("name", { 
                  required: "Name is required",
                  minLength: { value: 3, message: "Name must be at least 3 characters" }
                })}
                className="w-full p-2 border rounded"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="w-full p-2 border rounded"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                {...register("password", { 
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
                    message: "Password must contain at least 8 characters, including numbers, lowercase, uppercase and special chars"
                  }
                })}
                className="w-full p-2 border rounded"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-gray-700 mb-2">Role</label>
              <select
                {...register("role_id")}
                className="w-full p-2 border rounded"
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Store Fields */}
            {selectedRole === "2" && (
              <>
                <div>
                  <label className="block text-gray-700 mb-2">Store Name</label>
                  <input
                    type="text"
                    {...register("store_name", { 
                      required: "Store name is required",
                      minLength: { value: 3, message: "Store name must be at least 3 characters" }
                    })}
                    className="w-full p-2 border rounded"
                  />
                  {errors.store_name && <p className="text-red-500 text-sm mt-1">{errors.store_name.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Store Phone</label>
                  <input
                    type="tel"
                    {...register("store_phone", { 
                      required: "Store phone is required",
                      pattern: {
                        value: /^(\+90|0)?[0-9]{10}$/,
                        message: "Please enter a valid Turkish phone number"
                      }
                    })}
                    className="w-full p-2 border rounded"
                  />
                  {errors.store_phone && <p className="text-red-500 text-sm mt-1">{errors.store_phone.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Tax ID</label>
                  <input
                    type="text"
                    {...register("store_tax_no", { 
                      required: "Tax ID is required"
                    })}
                    className="w-full p-2 border rounded"
                  />
                  {errors.store_tax_no && <p className="text-red-500 text-sm mt-1">{errors.store_tax_no.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Bank Account</label>
                  <input
                    type="text"
                    {...register("store_bank_account", { 
                      required: "Bank account is required"
                    })}
                    className="w-full p-2 border rounded"
                  />
                  {errors.store_bank_account && <p className="text-red-500 text-sm mt-1">{errors.store_bank_account.message}</p>}
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
  );
};

export default AuthPage; 