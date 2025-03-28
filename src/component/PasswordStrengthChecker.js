import React, { useState, useEffect } from "react";
import {
  calculatePasswordStrength,
  checkPasswordLeak,
} from "../utils/passwordStrength";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Activity,
  Fingerprint,
  Code,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PasswordStrengthChecker = () => {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [leakResult, setLeakResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setScanProgress((prev) =>
          prev >= 100 ? 100 : prev + Math.floor(Math.random() * 20)
        );
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const analyzePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setLeakResult("");

    if (!password) {
      setResult({ strength: "N/A", message: "Please enter a password!" });
      setIsLoading(false);
      return;
    }

    try {
      const strengthResult = calculatePasswordStrength(password);
      const leakCheck = await checkPasswordLeak(password);

      setResult(strengthResult);
      setLeakResult(leakCheck);
      setIsLoading(false);
    } catch (error) {
      setLeakResult("⚠️ Error checking password leak database.");
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    navigate("/password-suggester");
  };

  const getMeterColor = (strength) => {
    switch (strength) {
      case "Very Weak":
        return "#ef4444"; // red-500
      case "Weak":
        return "#f97316"; // orange-500
      case "Moderate":
        return "#eab308"; // yellow-500
      case "Strong":
        return "#22c55e"; // green-500
      case "Very Strong":
        return "#10b981"; // emerald-500
      default:
        return "#64748b"; // slate-500
    }
  };

  const getMeterValue = (strength) => {
    switch (strength) {
      case "Very Weak":
        return 20;
      case "Weak":
        return 40;
      case "Moderate":
        return 60;
      case "Strong":
        return 80;
      case "Very Strong":
        return 100;
      default:
        return 0;
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
            className="fixed inset-0 z-50 bg-slate-900/90 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-64 bg-slate-800 border border-emerald-500/30 rounded-lg p-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="mb-4 flex justify-center"
              >
                <Lock className="text-emerald-500" size={60} />
              </motion.div>
              <div className="w-full bg-slate-700 rounded-full h-2.5 mb-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scanProgress}%` }}
                  className="bg-emerald-500 h-2.5 rounded-full"
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
                className="text-center text-emerald-300"
              >
                Analyzing password...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container - Both Cards Side by Side */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-center gap-6 p-4">
        {/* Input Card - Always Visible */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl shadow-2xl overflow-hidden"
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
              <Fingerprint
                className="absolute top-4 left-4 text-emerald-500"
                size={30}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Code
                className="absolute top-4 right-4 text-emerald-500"
                size={30}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <ShieldCheck
                className="mx-auto mb-4 text-emerald-500"
                size={80}
                strokeWidth={1.5}
              />
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold mb-2 text-emerald-300"
            >
              Password Strength
            </motion.h2>
            <motion.p variants={itemVariants} className="text-emerald-500">
              Analyze and secure your password
            </motion.p>
          </motion.div>

          {/* Password Form */}
          <motion.form
            onSubmit={analyzePassword}
            className="px-8 pb-8 space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <label className="block text-emerald-500 text-sm mb-2">
                Enter Password
              </label>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
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
                    className="absolute right-3 top-[40%] -translate-y-1/2 text-emerald-500 hover:text-emerald-300 transition-colors duration-300"
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
                  <Activity className="mr-2" size={20} />
                  Analyze Password
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
        </motion.div>

        {/* Results Card - Appears to the right */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="w-full max-w-md bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setResult(null)}
                className="absolute top-4 right-4 text-emerald-500 hover:text-emerald-300 transition-colors duration-300 z-20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>

              {/* Header */}
              <div className="relative p-8 text-center">
                <ShieldCheck
                  className="mx-auto mb-4 text-emerald-500"
                  size={80}
                  strokeWidth={1.5}
                />
                <h2 className="text-3xl font-bold mb-2 text-emerald-300">
                  Analysis Results
                </h2>
                <p className="text-emerald-500">Your password security</p>
              </div>

              {/* Results Content */}
              <div className="px-8 pb-8">
                <div className="bg-slate-900/50 border border-emerald-500/30 p-4 rounded-lg">
                  <h3 className="text-emerald-300 font-bold text-xl mb-4 text-center">
                    Security Meter
                  </h3>

                  {/* Circular Progress Bar Container */}
                  <div className="flex flex-col items-center justify-center mb-6">
                    <motion.div
                      className="relative"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      {/* SVG Container with proper dimensions */}
                      <div className="w-48 h-48 relative">
                        {/* Background and progress circles */}
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#334155"
                            strokeWidth="8"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={getMeterColor(result.strength)}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="283"
                            strokeDashoffset="283"
                            animate={{
                              strokeDashoffset:
                                283 -
                                (283 * getMeterValue(result.strength)) / 100,
                            }}
                            transition={{
                              duration: 1.5,
                              ease: "easeInOut",
                            }}
                            style={{
                              filter: `drop-shadow(0 0 8px ${getMeterColor(
                                result.strength
                              )})`,
                            }}
                          />
                        </svg>

                        {/* Centered percentage text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.span
                            className="text-xl font-bold"
                            style={{ color: getMeterColor(result.strength) }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}
                          >
                            {getMeterValue(result.strength)}%
                          </motion.span>
                        </div>
                      </div>

                      {/* Strength label positioned below the circle */}
                      <motion.div
                        className="text-center mt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                      >
                        <div
                          className="text-2xl font-bold"
                          style={{
                            color: getMeterColor(result.strength),
                            textShadow: `0 0 8px ${getMeterColor(
                              result.strength
                            )}`,
                          }}
                        >
                          {result.strength}
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Result details with proper spacing */}
                  <div className="space-y-3 text-center">
                    <motion.p
                      className="text-emerald-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      {result.message}
                    </motion.p>

                    {leakResult && (
                      <motion.div
                        className={`p-2 rounded ${
                          leakResult.includes("⚠️")
                            ? "bg-yellow-900/30"
                            : "bg-red-900/30"
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.4 }}
                      >
                        <p
                          className={`text-sm ${
                            leakResult.includes("⚠️")
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {leakResult}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>

                <motion.button
                  onClick={handleSubmit}
                  className="mt-4 w-full bg-emerald-800/50 border border-emerald-500/30 text-emerald-300 py-3 rounded-lg hover:bg-emerald-900/50 transition-colors duration-300"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Get Password Suggestions
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PasswordStrengthChecker;
