import React, { useState } from 'react';
import { Shield, Lock, Key, ArrowLeft } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { AdminUser } from '../types';

interface AdminLoginProps {
  onLogin: (user: AdminUser) => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const { admins } = useData();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const admin = admins.find(a => a.id === id && a.password === password);
    
    if (admin) {
      onLogin(admin);
    } else {
      setError('Invalid Credentials.');
    }
  };

  const inputClass = "w-full pl-10 p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none transition-all placeholder-stone-400 text-stone-800";
  const labelClass = "block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2";

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4 relative">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 text-stone-400 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Resort
      </button>

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up border border-stone-800">
        <div className="text-center mb-8">
          <div className="bg-rose-950 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-rose-900/20">
             <Shield className="text-amber-500" size={36} />
          </div>
          <h2 className="font-serif text-3xl text-rose-950 mb-1">Staff Portal</h2>
          <p className="text-stone-500 text-sm">Nainagarh Palace Administration</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
           {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm text-center border border-red-100 font-medium animate-pulse">{error}</div>}
           <div>
             <label className={labelClass}>Admin ID</label>
             <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-stone-400" size={18} />
                <input 
                  type="text" 
                  value={id}
                  onChange={e => setId(e.target.value)}
                  className={inputClass}
                  placeholder="Enter Admin ID"
                />
             </div>
           </div>
           <div>
             <label className={labelClass}>Password</label>
             <div className="relative">
                <Key className="absolute left-3 top-3.5 text-stone-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
             </div>
           </div>
           <button className="w-full bg-rose-950 text-white py-4 rounded-lg font-serif tracking-widest text-sm hover:bg-rose-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 uppercase">
             Secure Login
           </button>
        </form>
        <div className="mt-8 text-center text-xs text-stone-400 border-t border-stone-100 pt-6">
          <p>Restricted Access Area</p>
          <p className="mt-1 text-stone-300">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
};
