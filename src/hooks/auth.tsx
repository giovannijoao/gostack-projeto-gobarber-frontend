import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/apiClient';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}
interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthState {
  token: string;
  user: User;
}

export interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');
    if (user && token) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post<AuthState>('sessions', {
      email,
      password,
    });
    const { token, user } = response.data;
    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;
    setData({ token, user });
  }, []);

  const updateUser = useCallback(
    async (userData: User) => {
      localStorage.setItem('@GoBarber:user', JSON.stringify(userData));
      setData({
        token: data.token,
        user: userData,
      });
    },
    [data.token],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');
    setData({} as AuthState);
    Reflect.deleteProperty(api.defaults.headers, 'authorization');
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  return context;
}
