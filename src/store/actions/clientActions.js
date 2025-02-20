import axiosInstance from '../../api/axios';

// Action Creators
export const setUser = (user) => ({
  type: 'SET_USER',
  payload: user
});

export const setRoles = (roles) => ({
  type: 'SET_ROLES',
  payload: roles
});

export const setTheme = (theme) => ({
  type: 'SET_THEME',
  payload: theme
});

export const setLanguage = (language) => ({
  type: 'SET_LANGUAGE',
  payload: language
});

// Thunk Action Creator for roles
export const fetchRoles = () => async (dispatch, getState) => {
  const { client } = getState();
  
  // Sadece roles boşsa fetch yap
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
    const response = await axiosInstance.post('/login', credentials);
    
    // User bilgilerini store'a kaydet
    dispatch(setUser({
      name: response.data.name,
      email: response.data.email,
      role_id: response.data.role_id
    }));
    
    // Token'ı localStorage'a kaydet (eğer rememberMe true ise)
    if (credentials.rememberMe) {
      localStorage.setItem('token', response.data.token);
    }
    
    // Token'ı axios instance'ına default header olarak ekle
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed'
    };
  }
};

export const logoutUser = () => (dispatch) => {
  // Local storage'dan token'ı sil
  localStorage.removeItem('token');
  
  // Axios headers'dan Authorization'ı kaldır
  delete axiosInstance.defaults.headers.common['Authorization'];
  
  // Store'daki user bilgisini temizle
  dispatch(setUser({}));
  
  return { success: true };
}; 