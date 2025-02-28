// Action Type'larını tanımlama
export const SET_CART = 'SET_CART';
export const SET_PAYMENT = 'SET_PAYMENT';
export const SET_ADDRESS = 'SET_ADDRESS';
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';
export const CLEAR_CART = 'CLEAR_CART';
export const SET_CART_ITEM_COUNT = 'SET_CART_ITEM_COUNT';
export const TOGGLE_CART_ITEM_CHECK = 'TOGGLE_CART_ITEM_CHECK';

// Action Creator'ları
export const setCart = (cart) => ({
  type: SET_CART,
  payload: cart
});

export const setPayment = (payment) => ({
  type: SET_PAYMENT,
  payload: payment
});

export const setAddress = (address) => ({
  type: SET_ADDRESS,
  payload: address
});

// Cart işlemleri için yardımcı fonksiyonlar
export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product
});

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId
});

export const updateCartItem = (productId, updates) => ({
  type: UPDATE_CART_ITEM,
  payload: { productId, updates }
});

export const clearCart = () => {
  return {
    type: CLEAR_CART
  };
}; 