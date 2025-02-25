import axiosInstance from '../../api/axios';

// Action Types
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const SET_FETCH_STATE = 'SET_FETCH_STATE';
export const SET_PRODUCTS = 'SET_PRODUCTS';
export const SET_TOTAL = 'SET_TOTAL';

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
  type: SET_TOTAL,
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

export const setProducts = (products) => ({
  type: SET_PRODUCTS,
  payload: products
});

// Thunk action
export const fetchProducts = (params = {}) => async (dispatch) => {
  try {
    dispatch(setFetchState('FETCHING'));
    
    // URL parametrelerini oluştur
    const queryParams = new URLSearchParams();
    
    // Varsayılan değerler
    queryParams.set('limit', params.limit || 25);
    queryParams.set('offset', params.offset || 0);
    
    // Diğer parametreleri ekle
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && !['limit', 'offset'].includes(key)) {
        queryParams.set(key, value);
      }
    });

    const response = await axiosInstance.get(`/products?${queryParams.toString()}`);
    
    dispatch(setProducts(response.data.products));
    dispatch(setTotal(response.data.total));
    dispatch(setFetchState('FETCHED'));
    
    return { success: true };
  } catch (error) {
    console.error('Error fetching products:', error);
    dispatch(setFetchState('FAILED'));
    return { success: false, error: error.message };
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