import { createContext, useContext, useReducer, useEffect } from 'react';

const AdminContext = createContext();

const adminReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        admin: action.payload
      };

    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        admin: null
      };

    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload
      };

    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload]
      };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };

    default:
      return state;
  }
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, {
    isAuthenticated: false,
    admin: null,
    products: []
  });

  // Load products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        dispatch({ type: 'SET_PRODUCTS', payload: parsedProducts });
      } catch (error) {
        console.error('Error loading products from localStorage:', error);
        localStorage.removeItem('products');
      }
    }
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    if (state.products.length > 0) {
      localStorage.setItem('products', JSON.stringify(state.products));
    }
  }, [state.products]);

  const login = (adminData) => {
    // Simple admin authentication (in real app, this would be API call)
    if (adminData.username === 'admin' && adminData.password === 'admin123') {
      dispatch({ type: 'LOGIN', payload: { username: adminData.username } });
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
  };

  const updateProduct = (product) => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: product });
  };

  const deleteProduct = (productId) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: productId });
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated: state.isAuthenticated,
      admin: state.admin,
      products: state.products,
      login,
      logout,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}; 