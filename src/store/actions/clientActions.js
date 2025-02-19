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