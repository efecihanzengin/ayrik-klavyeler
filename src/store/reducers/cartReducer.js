const initialState = {
  cart: [], // [{count: number, checked: boolean, product: object}]
  payment: {},
  address: {}
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.cart.findIndex(
        item => item.product.id === action.payload.id
      );

      if (existingItemIndex > -1) {
        // Ürün zaten sepette varsa count'u artır
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          count: updatedCart[existingItemIndex].count + 1
        };
        return { ...state, cart: updatedCart };
      }

      // Ürün sepette yoksa yeni ekle
      return {
        ...state,
        cart: [...state.cart, { count: 1, checked: true, product: action.payload }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload)
      };

    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, ...action.payload.updates }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };

    case 'SET_PAYMENT':
      return {
        ...state,
        payment: action.payload
      };

    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.payload
      };

    default:
      return state;
  }
};

export default cartReducer; 