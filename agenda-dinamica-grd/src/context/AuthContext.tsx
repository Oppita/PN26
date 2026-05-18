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
  isAdmin: true,
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

      return {
        id,
        email: '7albahacas@gmail.com'
      };

    } catch (e) {

      return {
        id: 'fallback-id',
        email: '7albahacas@gmail.com'
      };
    }
  });

  // =========================
  // FORZAR ADMIN
  // =========================
  const [isAdmin] = useState(true);

  useEffect(() => {

    localStorage.setItem('pn26-admin', 'true');

    console.log('✅ ADMIN MODE ACTIVADO');

  }, []);

  return (

    <AuthContext.Provider
      value={{
        user,
        session: null,
        isAdmin,
        signOut: async () => {},
        signIn: async () => {},
        signUp: async () => {},
        loading: false
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
