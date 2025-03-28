import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  ShieldCheck,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  UserPlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ModernSecureLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + Math.random() * 10;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/password-strength");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/profile-setup");
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-900 text-emerald-400 overflow-hidden relative flex items-center justify-center p-4">
      {/* Animated Grid Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(30,41,59,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30,41,59,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute w-1 h-1 rounded-full bg-emerald-400"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-64 bg-slate-800 border border-emerald-500/30 rounded-xl p-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="mb-4 flex justify-center"
              >
                <Loader2 className="text-emerald-500" size={48} />
              </motion.div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 mb-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-emerald-500 h-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #10b981, #34d399, #10b981)",
                  }}
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1.5,
                }}
                className="text-center text-emerald-300 text-sm"
              >
                {isLogin ? "Authenticating..." : "Creating account..."}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Login Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl shadow-xl overflow-hidden"
        whileHover={{ boxShadow: "0 0 30px rgba(16, 185, 129, 0.2)" }}
      >
        {/* Animated Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
        />

        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative p-8 text-center"
        >
          <motion.div variants={itemVariants}>
            <ShieldCheck
              className="mx-auto mb-4 text-emerald-500"
              size={64}
              strokeWidth={1.5}
            />
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold mb-2 text-emerald-300"
          >
            {isLogin ? "Secure Access" : "Create Account"}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-emerald-500 text-sm"
          >
            {isLogin
              ? "Authenticate to continue"
              : "Establish your digital identity"}
          </motion.p>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mx-6 mb-4 overflow-hidden"
            >
              <div
                className="bg-red-900/20 border border-red-500/30 text-red-300 p-3 rounded-md flex items-center"
                style={{ boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)" }}
              >
                <AlertTriangle className="mr-2 text-red-500" size={20} />
                <span className="text-sm">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Authentication Form */}
        <motion.form
          onSubmit={handleAuth}
          className="px-8 pb-8 space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <label className="block text-emerald-500 text-sm mb-2">
              Email Address
            </label>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-emerald-500/30 text-emerald-300 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <label className="block text-emerald-500 text-sm mb-2">
              Password
            </label>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-emerald-500/30 text-emerald-300 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-emerald-500 hover:text-emerald-300 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-800/50 border border-emerald-500/30 text-emerald-300 py-3 rounded-lg hover:bg-emerald-900/50 transition-colors duration-300 flex items-center justify-center group relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                className="flex items-center"
              >
                {isLogin ? (
                  <>
                    <LogIn className="mr-2" size={20} />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2" size={20} />
                    Create Account
                  </>
                )}
              </motion.span>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Loader2 className="animate-spin" size={20} />
                </motion.div>
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Mode Toggle */}
        <motion.div className="px-8 pb-6 text-center" variants={itemVariants}>
          <motion.button
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-500 hover:text-emerald-300 underline transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLogin ? "Create new account" : "Already have an account?"}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ModernSecureLogin;
