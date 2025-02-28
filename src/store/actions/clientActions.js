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
    const response = await axiosInstance.post('/login', {
      email: credentials.email,
      password: credentials.password
    });
    
    const token = response.data.token;
    
    if (!token) {
      throw new Error('No token received');
    }

    // Token'ı localStorage'a kaydet
    localStorage.setItem('token', token);
    
    // Token'ı axios instance'ına default header olarak ekle
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // User bilgilerini store'a kaydet
    const userData = {
      name: response.data.name,
      email: response.data.email,
      role_id: response.data.role_id
    };
    
    dispatch(setUser(userData));
    
    // User bilgilerini de localStorage'a kaydet
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
  // Local storage'dan token'ı sil
  localStorage.removeItem('token');
  
  // Axios headers'dan Authorization'ı kaldır
  delete axiosInstance.defaults.headers.common['Authorization'];
  
  // Store'daki user bilgisini temizle
  dispatch(setUser({}));
  
  return { success: true };
};

export const verifyToken = () => async (dispatch) => {
  try {
    // localStorage'dan token'ı al
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { success: false };
    }

    // Axios header'ına token'ı ekle
    axiosInstance.defaults.headers.common['Authorization'] = token;

    // Verify request'i yap
    const response = await axiosInstance.get('/verify');
    
    // User bilgilerini store'a kaydet
    dispatch(setUser({
      name: response.data.name,
      email: response.data.email,
      role_id: response.data.role_id
    }));

    // Yeni token'ı kaydet
    localStorage.setItem('token', response.data.token);
    axiosInstance.defaults.headers.common['Authorization'] = response.data.token;

    return { success: true };
  } catch (error) {
    // Token geçersizse temizle
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
    dispatch(setUser({}));
    
    return { success: false, error: error.response?.data?.message };
  }
};

// Yeni bir fonksiyon ekleyelim
export const checkAuthStatus = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  if (token && userData) {
    // Token'ı axios instance'ına ekle
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // User bilgilerini store'a yükle
    dispatch(setUser(JSON.parse(userData)));
    return true;
  }
  return false;
}; 