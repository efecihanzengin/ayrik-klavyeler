import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './slices/clientSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';

const store = configureStore({
  reducer: {
    client: clientReducer,
    product: productReducer,
    cart: cartReducer
  }
});

export default store;
