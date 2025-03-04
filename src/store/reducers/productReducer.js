import { SET_CATEGORIES, SET_FETCH_STATE, SET_PRODUCTS, SET_TOTAL } from '../actions/productActions';

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

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };
    case SET_PRODUCTS:
      return {
        ...state,
        productList: action.payload
      };
    case SET_TOTAL:
      return {
        ...state,
        total: action.payload
      };
    case SET_FETCH_STATE:
      return {
        ...state,
        fetchState: action.payload
      };
    case 'SET_LIMIT':
      return {
        ...state,
        limit: action.payload
      };
    case 'SET_OFFSET':
      return {
        ...state,
        offset: action.payload
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
    case 'SET_SELECTED_PRODUCT':
      return {
        ...state,
        selectedProduct: action.payload
      };
    case 'SET_PRODUCT_FETCH_STATE':
      return {
        ...state,
        productFetchState: action.payload
      };
    default:
      return state;
  }
};

export default productReducer; 