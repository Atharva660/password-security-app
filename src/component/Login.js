import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, LogIn, UserPlus, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleAuth = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(30);
    setTimeout(() => {
      setProgress(100);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-emerald-400 overflow-hidden relative flex items-center justify-center p-4">
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

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center"
          >
            <motion.div className="w-64 bg-slate-800 border border-emerald-500/30 rounded-xl p-6">
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
                />
              </div>
              <motion.p className="text-center text-emerald-300 text-sm">
                {isLogin ? "Authenticating..." : "Creating account..."}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl shadow-xl overflow-hidden"
      >
        <motion.div className="relative p-8 text-center">
          <ShieldCheck className="mx-auto mb-4 text-emerald-500" size={64} />
          <h2 className="text-3xl font-bold mb-2 text-emerald-300">
            {isLogin ? "Secure Access" : "Create Account"}
          </h2>
          <p className="text-emerald-500 text-sm">
            {isLogin ? "Authenticate to continue" : "Establish your digital identity"}
          </p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div className="mx-6 mb-4 bg-red-900/20 border border-red-500/30 text-red-300 p-3 rounded-md flex items-center">
              <AlertTriangle className="mr-2 text-red-500" size={20} />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form onSubmit={handleAuth} className="px-8 pb-8 space-y-4">
          <div>
            <label className="block text-emerald-500 text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/50 border border-emerald-500/30 text-emerald-300 py-3 px-4 rounded-lg focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-emerald-500 text-sm mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-emerald-500/30 text-emerald-300 py-3 px-4 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-emerald-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-800/50 border border-emerald-500/30 text-emerald-300 py-3 rounded-lg hover:bg-emerald-900/50"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </motion.form>

        <div className="px-8 pb-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-emerald-500 underline">
            {isLogin ? "Create new account" : "Already have an account?"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthComponent;
