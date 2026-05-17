import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, KeyRound } from 'lucide-react';

export const LoginPage = () => {
  const { signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    try {
      if (isRegistering) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (e) {
      // Errors handled via alert in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10">
        <div className="mb-10">
            <h1 className="text-4xl font-extrabold uppercase tracking-tighter mb-3 font-serif bg-gradient-to-r from-orange-200 via-[#d4af88] to-orange-200 bg-clip-text text-transparent">
              Agenda GRD
            </h1>
            <p className="text-slate-400 text-xs tracking-[0.3em] uppercase">V Encuentro Nacional</p>
        </div>
        
        <div className="bg-[#111] border border-white/5 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <KeyRound className="w-5 h-5 text-[#d4af88]" />
            </div>
          </div>
          
          <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
            <button 
              type="button"
              className={`flex-1 text-xs uppercase tracking-widest pb-2 transition-colors ${!isRegistering ? 'text-[#d4af88] font-bold' : 'text-slate-500 hover:text-slate-300'}`}
              onClick={() => setIsRegistering(false)}
            >
              Acceso
            </button>
            <button 
              type="button"
              className={`flex-1 text-xs uppercase tracking-widest pb-2 transition-colors ${isRegistering ? 'text-[#d4af88] font-bold' : 'text-slate-500 hover:text-slate-300'}`}
              onClick={() => setIsRegistering(true)}
            >
              Registro
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="text-left">
              <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1 ml-1">Correo Electrónico</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@restaurante.com"
                required
                className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#d4af88] transition-colors"
              />
            </div>
            
            <div className="text-left mb-4">
              <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1 ml-1">Contraseña</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#d4af88] transition-colors"
              />
            </div>

            <button 
              type="submit"
              disabled={loading || isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#d4af88] to-orange-300 text-black font-bold py-4 rounded-xl hover:opacity-90 transition-opacity uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(212,175,136,0.2)] disabled:opacity-50"
            >
              {(loading || isSubmitting) ? <Loader2 className="w-4 h-4 animate-spin" /> : (isRegistering ? 'Crear Credencial' : 'Entrar al Dashboard')}
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-[10px] text-slate-500 uppercase tracking-[0.2em]">
            Acceso seguro · End-to-end encrypted
        </p>
      </div>
    </div>
  );
};
