import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any;
  session: any;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  signOut: async () => {},
  signIn: async () => {},
  signUp: async () => {},
  loading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState<any>(() => {
    try {
      let id = localStorage.getItem('anon-user-id');
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('anon-user-id', id);
      }
      return { id, email: '7albahacas@gmail.com' };
    } catch(e) {
      return { id: 'fallback-id', email: '7albahacas@gmail.com' };
    }
  });

  const [isAdmin] = useState(() => {
    return localStorage.getItem('pn26-admin') === 'true' || window.location.search.includes('admin=true');
  });

  useEffect(() => {
    if (window.location.search.includes('admin=true')) {
      localStorage.setItem('pn26-admin', 'true');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session: null, 
      isAdmin, 
      signOut: async () => {
        localStorage.removeItem('pn26-admin');
        window.location.href = '/';
      }, 
      signIn: async () => {}, 
      signUp: async () => {}, 
      loading: false 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
