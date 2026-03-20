import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Loader2, Command, ShieldCheck, Globe, Zap, Sparkles, UserPlus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
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
    const result = await register(name, email, password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Account Created Successfully', {
        icon: '🎉',
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
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-600/20 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className="relative z-10 w-full max-w-xl px-6 py-12"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-primary-600 p-0.5 mb-6 shadow-2xl shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight font-display mb-3">Join the Engine</h1>
          <p className="text-slate-400 font-medium text-lg">Every new account fuels the intelligence system.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-primary-500 rounded-[40px] opacity-10 blur group-hover:opacity-30 transition duration-1000"></div>
          
          <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 md:p-14 shadow-2xl overflow-hidden">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] font-display ml-1" htmlFor="name">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full bg-white/5 border-2 border-white/5 rounded-2xl h-16 px-6 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none transition-all duration-300 font-medium"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] font-display ml-1" htmlFor="email">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full bg-white/5 border-2 border-white/5 rounded-2xl h-16 px-6 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none transition-all duration-300 font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] font-display ml-1" htmlFor="password">
                    <Lock className="w-3.5 h-3.5" /> Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border-2 border-white/5 rounded-2xl h-16 px-6 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none transition-all duration-300 font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 relative group/btn overflow-hidden rounded-2xl bg-white text-slate-950 font-black uppercase tracking-[0.15em] text-sm hover:translate-y-[-2px] active:scale-[0.98] transition-all duration-300 shadow-xl"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <span>Create Account</span>
                  )}
                </div>
              </button>

              <div className="text-center pt-2">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  Already have an account? <Link to="/login" className="text-primary-400 hover:text-white transition-colors">Start Session</Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default RegisterPage;
