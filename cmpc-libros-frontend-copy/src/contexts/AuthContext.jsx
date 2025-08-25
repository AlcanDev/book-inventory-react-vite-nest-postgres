import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action?.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action?.payload?.user,
        token: action?.payload?.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action?.payload,
      };
    case 'INIT_AUTH':
      return {
        ...state,
        user: action?.payload?.user,
        token: action?.payload?.token,
        isAuthenticated: action?.payload?.isAuthenticated,
        isLoading: false,
      };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Initialize auth state from localStorage
    const token = localStorage.getItem('access_token');
    const userEmail = localStorage.getItem('userEmail');
    
    if (token && userEmail) {
      dispatch({
        type: 'INIT_AUTH',
        payload: {
          user: { email: userEmail },
          token,
          isAuthenticated: true,
        },
      });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('userEmail', user?.email);
    
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user, token },
    });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('rememberMe');
    
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};