// Action Creators
export const setCategories = (categories) => ({
  type: 'SET_CATEGORIES',
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
  type: 'SET_FETCH_STATE',
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