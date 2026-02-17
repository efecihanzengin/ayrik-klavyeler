import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

const initialState = {
  categories: [],
  productList: [],
  total: 0,
  limit: 25,
  offset: 0,
  filter: '',
  fetchState: 'IDLE', // 'IDLE' | 'FETCHING' | 'FETCHED' | 'FAILED'
  selectedProduct: null, // Seçili ürün detayı için
  productFetchState: 'IDLE', // Ürün detayı fetch durumu için
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setProductList: (state, action) => {
      state.productList = action.payload;
    },
    setTotal: (state, action) => {
      state.total = action.payload;
    },
    setFetchState: (state, action) => {
      state.fetchState = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    setOffset: (state, action) => {
      state.offset = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setProductFetchState: (state, action) => {
      state.productFetchState = action.payload;
    },
    // Adding setProducts alias for setProductList as it was used in actions
    setProducts: (state, action) => {
        state.productList = action.payload;
    }
  }
});

export const {
  setCategories,
  setProductList,
  setTotal,
  setFetchState,
  setLimit,
  setOffset,
  setFilter,
  setSelectedProduct,
  setProductFetchState,
  setProducts
} = productSlice.actions;

// Thunks
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
    const response = await axiosInstance.get('/categories');
    
    dispatch(setCategories(response.data));
    dispatch(setFetchState('FETCHED'));
    return { success: true };
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    dispatch(setFetchState('FAILED'));
    return { success: false, error: error.message };
  }
};

export const fetchProductDetail = (productId) => async (dispatch) => {
  try {
    dispatch(setProductFetchState('FETCHING'));
    
    const response = await axiosInstance.get(`/products/${productId}`);
    
    dispatch(setSelectedProduct(response.data));
    dispatch(setProductFetchState('FETCHED'));
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching product detail:', error);
    dispatch(setProductFetchState('FAILED'));
    return { success: false, error: error.message };
  }
};

export const clearProductDetail = () => (dispatch) => {
  dispatch(setSelectedProduct(null));
  dispatch(setProductFetchState('IDLE'));
};

export default productSlice.reducer;
