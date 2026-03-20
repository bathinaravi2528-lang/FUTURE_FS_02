import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Loader2, Command, ShieldCheck, Globe, Zap, Sparkles, Fingerprint } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields', {
        style: {
          borderRadius: '16px',
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      });
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('System Access Authorized', {
        icon: '🔐',
        style: {
          borderRadius: '16px',
          background: '#0f172a',
          color: '#38bdf8',
          border: '1px solid rgba(56,189,248,0.2)',
        },
      });
      navigate('/');
    } else {
      toast.error(result.message, {
        style: {
          borderRadius: '16px',
          background: '#450a0a',
          color: '#fecaca',
          border: '1px solid rgba(248,113,113,0.2)',
        },
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 font-sans">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-600/10 rounded-full blur-[100px]"></div>
        
        {/* Animated Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className="relative z-10 w-full max-w-xl px-6"
      >
        {/* Logo/Branding Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-indigo-600 p-0.5 mb-6 shadow-2xl shadow-primary-500/20 active:scale-95 transition-transform cursor-pointer">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
              <Command className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight font-display mb-3">
            MiniCRM <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Engine</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg">Next-generation behavioral intelligence system.</p>
        </motion.div>

        {/* Main Glassmorphism Card */}
        <motion.div 
          variants={itemVariants}
          className="relative group"
        >
          {/* Edge Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-[40px] opacity-10 blur group-hover:opacity-30 transition duration-1000"></div>
          
          <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 md:p-14 shadow-2xl overflow-hidden">
            {/* Inner background polish */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
            
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] font-display ml-1" htmlFor="email">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="admin@example.com"
                      className="w-full bg-white/5 border-2 border-white/5 rounded-2xl h-16 px-6 text-white placeholder:text-slate-600 focus:border-primary-500/50 focus:bg-white/10 focus:outline-none transition-all duration-300 font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] font-display" htmlFor="password">
                      <Lock className="w-3.5 h-3.5" /> Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-white/5 border-2 border-white/5 rounded-2xl h-16 px-6 text-white placeholder:text-slate-600 focus:border-primary-500/50 focus:bg-white/10 focus:outline-none transition-all duration-300 font-medium"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 relative group/btn overflow-hidden rounded-2xl bg-white text-slate-950 font-black uppercase tracking-[0.15em] text-sm hover:translate-y-[-2px] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-white/5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-indigo-100 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span>Login</span>
                      <Fingerprint className="w-5 h-5" />
                    </>
                  )}
                </div>
              </button>

              <div className="text-center pt-2">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  New to the Engine? <Link to="/register" className="text-primary-400 hover:text-white transition-colors">Register account</Link>
                </p>
              </div>

              {/* Credentials Box */}
              <div className="pt-4">
                <div 
                  onClick={() => {
                    setEmail('admin@example.com');
                    setPassword('password123');
                    toast.success('Admin Credentials Auto-filled', {
                      duration: 1500,
                      style: {
                        borderRadius: '16px',
                        background: '#1e293b',
                        color: '#f1f5f9',
                      },
                    });
                  }}
                  className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl group/cred hover:bg-white/[0.05] transition-colors relative overflow-hidden cursor-pointer active:scale-[0.98]"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-20 group-hover/cred:opacity-40 transition-opacity">
                    <Sparkles className="w-4 h-4 text-primary-400" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Admin Data</p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Email:</span>
                        <code className="text-xs font-mono text-primary-400 bg-primary-400/10 px-2 py-0.5 rounded">admin@example.com</code>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Password:</span>
                        <code className="text-xs font-mono text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">password123</code>
                     </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Footer Navigation */}
        <motion.div 
          variants={itemVariants} 
          className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 px-4"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">Secure Kernel v4.2.0</span>
          </div>
          <div className="flex gap-8 items-center">
             <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">Documentation</a>
             <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">System Status</a>
             <div className="flex gap-4">
               <Globe className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
               <Zap className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
             </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Foreground Polish Particles */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/10 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default LoginPage;

