import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

const initialState = {
  user: {},
  addressList: [],
  creditCards: [],
  roles: [],
  theme: 'light',
  language: 'en'
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setAddressList: (state, action) => {
      state.addressList = action.payload;
    },
    setCreditCards: (state, action) => {
      state.creditCards = action.payload;
    }
  }
});

export const {
  setUser,
  setRoles,
  setTheme,
  setLanguage,
  setAddressList,
  setCreditCards
} = clientSlice.actions;

// Thunks
export const fetchRoles = () => async (dispatch, getState) => {
  const { client } = getState();
  
  if (client.roles.length === 0) {
    try {
      const response = await axiosInstance.get('/roles');
      dispatch(setRoles(response.data));
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  }
};

export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/login', {
      email: credentials.email,
      password: credentials.password
    });
    
    const token = response.data.token;
    
    if (!token) {
      throw new Error('No token received');
    }

    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = token;
    
    const userData = {
      name: response.data.name,
      email: response.data.email,
      role_id: response.data.role_id
    };
    
    dispatch(setUser(userData));
    localStorage.setItem('user', JSON.stringify(userData));
    
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed'
    };
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token');
  delete axiosInstance.defaults.headers.common['Authorization'];
  dispatch(setUser({}));
  localStorage.removeItem('user'); // Also clear user data
  return { success: true };
};

export const verifyToken = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { success: false };
    }

    axiosInstance.defaults.headers.common['Authorization'] = token;

    const response = await axiosInstance.get('/verify');
    
    const userData = {
      name: response.data.name,
      email: response.data.email,
      role_id: response.data.role_id
    };

    dispatch(setUser(userData));
    localStorage.setItem('user', JSON.stringify(userData));

    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axiosInstance.defaults.headers.common['Authorization'] = response.data.token;
    }

    return { success: true };
  } catch (error) {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
    dispatch(setUser({}));
    return { success: false, error: error.response?.data?.message };
  }
};

export const checkAuthStatus = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  if (token && userData) {
    axiosInstance.defaults.headers.common['Authorization'] = token;
    dispatch(setUser(JSON.parse(userData)));
    return true;
  }
  return false;
};

export default clientSlice.reducer;
