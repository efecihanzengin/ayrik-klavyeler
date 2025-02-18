import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

const SignUpPage = () => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      role_id: "3" // Customer role_id (3) varsayılan değer olarak
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

    fetchRoles();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Form verisini düzenle
      const submitData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role_id: Number(data.role_id) // String'i number'a çevir
      };

      // Store role seçiliyse (role_id: 2)
      if (data.role_id === "2") {
        submitData.store = {
          name: data.store_name,
          phone: data.store_phone,
          tax_no: data.store_tax_no,
          bank_account: data.store_bank_account
        };
      }

      console.log('Submit Data:', submitData);

      await axiosInstance.post('/signup', submitData);
      alert('User created. Check your email for activation instructions.');
      navigate(-1);
    } catch (err) {
      console.log('Error Response:', err.response?.data);
      setError(err.response?.data?.message || 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              {...register("name", { 
                required: "Name is required",
                minLength: { value: 3, message: "Name must be at least 3 characters" }
              })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                minLength: { value: 8, message: "Password must be at least 8 characters" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
                }
              })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Password Confirmation */}
          <div>
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              {...register("passwordConfirm", { 
                validate: value => value === watch('password') || "Passwords do not match"
              })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.passwordConfirm && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm.message}</p>}
          </div>

          {/* Role Selection - Güncellendi */}
          <div>
            <label className="block text-gray-700 mb-2">Role</label>
            <select
              {...register("role_id")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roles.map(role => (
                role.code !== 'admin' && // Admin rolünü gösterme
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
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
                  {...register("store_name", { 
                    required: "Store name is required",
                    minLength: { value: 3, message: "Store name must be at least 3 characters" }
                  })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.store_name && <p className="text-red-500 text-sm mt-1">{errors.store_name.message}</p>}
              </div>

              {/* Store Phone */}
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.store_phone && <p className="text-red-500 text-sm mt-1">{errors.store_phone.message}</p>}
              </div>

              {/* Tax ID */}
              <div>
                <label className="block text-gray-700 mb-2">Tax ID</label>
                <input
                  type="text"
                  {...register("store_tax_no", { 
                    required: "Tax ID is required",
                    pattern: {
                      value: /^T\d{9}V\d{2}$/,
                      message: "Please enter a valid Tax ID (Format: TXXXXXXXXVXX)"
                    }
                  })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.store_tax_no && <p className="text-red-500 text-sm mt-1">{errors.store_tax_no.message}</p>}
              </div>

              {/* Bank Account */}
              <div>
                <label className="block text-gray-700 mb-2">Bank Account (IBAN)</label>
                <input
                  type="text"
                  {...register("store_bank_account", { 
                    required: "IBAN is required",
                    pattern: {
                      value: /^TR\d{2}\d{5}[A-Z0-9]{17}$/,
                      message: "Please enter a valid Turkish IBAN"
                    }
                  })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.store_bank_account && <p className="text-red-500 text-sm mt-1">{errors.store_bank_account.message}</p>}
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing up...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage; 