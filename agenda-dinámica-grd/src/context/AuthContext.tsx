import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabase } from '../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
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
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const supabase = getSupabase();
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (e: any) {
      console.error(e);
      if (e.message && e.message.toLowerCase().includes('invalid login credentials')) {
        alert('Credenciales inválidas. Verifica tu correo y contraseña. Si no tienes una cuenta, por favor regístrate primero.');
      } else {
        alert('Error al acceder: ' + e.message);
      }
      throw e;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      // Tratar de loguear inmediatamente si el confirm email está apagado
      await supabase.auth.signInWithPassword({ email, password });
    } catch (e: any) {
      console.error(e);
      if (e.message && e.message.toLowerCase().includes('already registered')) {
        alert('Este correo ya está registrado. Por favor, selecciona la opción de "Acceso" para iniciar sesión con tu contraseña.');
      } else {
        alert('Error al registrar: ' + e.message + '\n\nNota: Si dice Email no confirmado, debes desactivar "Confirm email" en Supabase -> Authentication -> Providers -> Email.');
      }
      throw e;
    }
  };

  const signOut = async () => {
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
  };

  const isAdmin = user?.email?.toLowerCase() === '7albahacas@gmail.com';

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, signOut, signIn, signUp, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
