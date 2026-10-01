// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.user);
    } catch (error) {
      console.error("Error loading user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  

  // In AuthContext.jsx, update the login function
const login = async (email, password) => {
  try {
   const response = await authService.login({
  email: email.trim().toLowerCase(),
  password,
});
    if (response.success) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      return { success: true, user: response.user };
    }
    return { success: false, error: response.message };
  } catch (error) {
    // Check if error is about verification
    const errorMessage = error.response?.data?.message || "Login failed";
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        return { success: true, user: response.user };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Registration failed" 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Default export
export default AuthContext;