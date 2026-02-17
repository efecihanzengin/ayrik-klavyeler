import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [], // [{count: number, checked: boolean, product: object}]
  payment: {},
  address: {}
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cart.find(
        item => item.product.id === action.payload.id
      );

      if (existingItem) {
        existingItem.count += 1;
      } else {
        state.cart.push({ count: 1, checked: true, product: action.payload });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.product.id !== action.payload);
    },
    updateCartItem: {
      prepare: (productId, updates) => ({
        payload: { productId, updates }
      }),
      reducer: (state, action) => {
        const { productId, updates } = action.payload;
        const item = state.cart.find(item => item.product.id === productId);
        if (item) {
          Object.assign(item, updates);
        }
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
    setPayment: (state, action) => {
      state.payment = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  setPayment,
  setAddress,
  setCart
} = cartSlice.actions;

export default cartSlice.reducer;
