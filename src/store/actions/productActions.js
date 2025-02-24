import axiosInstance from '../../api/axios';

// Action Types
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const SET_FETCH_STATE = 'SET_FETCH_STATE';

// Action Creators
export const setCategories = (categories) => ({
  type: SET_CATEGORIES,
  payload: categories
});

export const setProductList = (products) => ({
  type: 'SET_PRODUCT_LIST',
  payload: products
});

export const setTotal = (total) => ({
  type: 'SET_TOTAL',
  payload: total
});

export const setFetchState = (state) => ({
  type: SET_FETCH_STATE,
  payload: state
});

export const setLimit = (limit) => ({
  type: 'SET_LIMIT',
  payload: limit
});

export const setOffset = (offset) => ({
  type: 'SET_OFFSET',
  payload: offset
});

export const setFilter = (filter) => ({
  type: 'SET_FILTER',
  payload: filter
});

// Thunk action creator örneği (ileride kullanılabilir)
export const fetchProducts = () => async (dispatch) => {
  dispatch(setFetchState('FETCHING'));
  try {
    // API call gelecek
    dispatch(setFetchState('FETCHED'));
  } catch (error) {
    dispatch(setFetchState('FAILED'));
  }
};

export const fetchCategories = () => async (dispatch) => {
  dispatch(setFetchState('FETCHING'));
  try {
    console.log('Fetching categories...');
    const response = await axiosInstance.get('/categories');
    console.log('API Response:', response.data);
    
    dispatch(setCategories(response.data));
    dispatch(setFetchState('FETCHED'));
    return { success: true };
  } catch (error) {
    console.error('Error fetching categories:', error);
    console.error('Error response:', error.response);
    
    dispatch(setFetchState('FAILED'));
    return { success: false, error: error.message };
  }
}; 