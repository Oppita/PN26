import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2 } from 'lucide-react';

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('invalid login')) {
        setError('Credenciales inválidas. Verifica tu correo y contraseña.');
      } else if (err.message && err.message.toLowerCase().includes('already registered')) {
        setError('Este correo ya está registrado. Inicia sesión.');
      } else {
        setError(err.message || 'Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-100 p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-3xl italic uppercase text-white mx-auto shadow-lg shadow-blue-600/30">
            P
          </div>
          <h1 className="mt-6 text-2xl font-black text-slate-800 tracking-tight uppercase">PN26</h1>
          <p className="mt-2 text-xs font-bold text-slate-500 tracking-widest uppercase">Plataforma de Navegación</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold shrink-0 border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full text-sm border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 transition-all font-medium"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full text-sm border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 transition-all font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black uppercase tracking-widest py-3.5 rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isLogin ? (
              'Ingresar A La Plataforma'
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Ingresa'}
          </button>
        </div>
      </div>
    </div>
  );
}
