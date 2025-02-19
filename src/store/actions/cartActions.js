export const setCart = (cart) => ({
  type: 'SET_CART',
  payload: cart
});

export const setPayment = (payment) => ({
  type: 'SET_PAYMENT',
  payload: payment
});

export const setAddress = (address) => ({
  type: 'SET_ADDRESS',
  payload: address
});

// Cart işlemleri için yardımcı fonksiyonlar
export const addToCart = (product) => (dispatch, getState) => {
  const { cart } = getState().cart;
  const existingItem = cart.find(item => item.product.id === product.id);

  if (existingItem) {
    const updatedCart = cart.map(item =>
      item.product.id === product.id
        ? { ...item, count: item.count + 1 }
        : item
    );
    dispatch(setCart(updatedCart));
  } else {
    dispatch(setCart([...cart, { count: 1, product }]));
  }
};

export const removeFromCart = (productId) => (dispatch, getState) => {
  const { cart } = getState().cart;
  const updatedCart = cart.filter(item => item.product.id !== productId);
  dispatch(setCart(updatedCart));
};

export const updateCartItemCount = (productId, count) => (dispatch, getState) => {
  const { cart } = getState().cart;
  const updatedCart = cart.map(item =>
    item.product.id === productId
      ? { ...item, count: count }
      : item
  );
  dispatch(setCart(updatedCart));
}; 