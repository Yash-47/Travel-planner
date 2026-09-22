import React, { useState } from 'react';
import { useTripStore } from '../../store/tripStore';
import { Lock, Mail, User } from 'lucide-react';

export default function LoginModal() {
  const { user, setUser, logout } = useTripStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setUser({ email, name: isSignUp ? name : email.split('@')[0] });
  };

  if (user) return (
    <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 px-4 rounded-xl shadow-sm">
      <div className="text-right">
        <p className="text-xs font-bold text-slate-700">Welcome, {user.name}</p>
        <p className="text-[9px] text-slate-400 font-mono">{user.email}</p>
      </div>
      <button onClick={logout} className="text-[10px] bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white px-2.5 py-1.5 rounded-lg transition-all font-semibold border border-rose-200 hover:border-rose-500">
        Logout
      </button>
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-2xl w-full max-w-sm shadow-sm">
      <h3 className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">
        {isSignUp ? "Create Account" : "Secure Partner Portal"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-2.5">
        {isSignUp && (
          <div className="relative">
            <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-sky-200 rounded-lg p-2 pl-8 text-xs text-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100 placeholder:text-slate-400" required />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input type="email" placeholder="Enter Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-sky-200 rounded-lg p-2 pl-8 text-xs text-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100 placeholder:text-slate-400" required />
        </div>
        <button type="submit" className="w-full bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold py-2 rounded-lg transition-all shadow-sm shadow-blue-300/30">
          {isSignUp ? "Sign Up & Link Account" : "Authorize Gateway"}
        </button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)} className="text-[10px] text-slate-400 hover:text-sky-500 mt-2 block mx-auto text-center transition-colors">
        {isSignUp ? "Already registered? Log In" : "Need an account? Sign Up"}
      </button>
    </div>
  );
}