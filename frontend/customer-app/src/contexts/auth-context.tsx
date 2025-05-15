'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, userService } from '@/services/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  mobile: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  user_type: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sendOTP: (mobile: string) => Promise<void>;
  verifyOTP: (mobile: string, otp: string) => Promise<{ isNewUser: boolean }>;
  registerCustomer: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await userService.getProfile();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to get user profile:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const sendOTP = async (mobile: string) => {
    setIsLoading(true);
    try {
      await authService.sendOTP(mobile);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (mobile: string, otp: string) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyOTP(mobile, otp);
      const { refresh, access, is_new_user, user_type } = response.data;

      if (!is_new_user) {
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        
        // Get user profile
        const userResponse = await userService.getProfile();
        setUser(userResponse.data);
        setIsAuthenticated(true);
      }

      return { isNewUser: is_new_user };
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerCustomer = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await authService.registerCustomer(data);
      const userResponse = await userService.getProfile();
      setUser(userResponse.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to register customer:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        sendOTP,
        verifyOTP,
        registerCustomer,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
