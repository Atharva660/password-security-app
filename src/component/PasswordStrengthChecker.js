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
  ChevronDown,
  ChevronUp,
  ShieldCheck as ShieldCheckIcon,
  Key,
  ArrowRight,
  Zap,
  Database,
  Users,
  BarChart2,
  Shield,
  Globe,
  User,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const PasswordStrengthChecker = () => {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [leakResult, setLeakResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setShowDropdown(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

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
    setLeakResult(null);
    setShowDetails(false);

    if (!password) {
      setResult({ strength: "N/A", message: "Please enter a password!" });
      setIsLoading(false);
      return;
    }

    try {
      const strengthResult = await calculatePasswordStrength(password);
      const leakCheck = await checkPasswordLeak(password);

      setResult(strengthResult);
      setLeakResult(leakCheck);
      setIsLoading(false);

      setTimeout(() => {
        setShowDetails(true);
      }, 800);
    } catch (error) {
      setResult({ strength: "Error", message: "Failed to analyze password" });
      setLeakResult({
        isCompromised: false,
        message: "⚠ Error checking password leaks",
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    navigate("/password-suggester");
  };

  const getMeterColor = (strength) => {
    switch (strength) {
      case "Very Weak":
        return "#ef4444";
      case "Weak":
        return "#f97316";
      case "Medium":
        return "#eab308";
      case "Strong":
        return "#22c55e";
      case "Very Strong":
        return "#10b981";
      case "Compromised":
        return "#dc2626";
      default:
        return "#64748b";
    }
  };

  const getMeterValue = (strength) => {
    switch (strength) {
      case "Very Weak":
        return 20;
      case "Weak":
        return 40;
      case "Medium":
        return 60;
      case "Strong":
        return 80;
      case "Very Strong":
        return 100;
      case "Compromised":
        return 0;
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  // Hexagon pattern component
  const HexagonPattern = () => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
      const updateDimensions = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const hexSize = 60;
    const hexWidth = hexSize * Math.sqrt(3);
    const hexHeight = hexSize * 2;
    const cols = Math.ceil(dimensions.width / hexWidth) + 1;
    const rows = Math.ceil(dimensions.height / (hexHeight * 0.75)) + 1;

    return (
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            className="flex"
            style={{ marginTop: row === 0 ? 0 : -hexSize * 0.25 }}
          >
            {Array.from({ length: cols }).map((_, col) => {
              const x = col * hexWidth + (row % 2 === 0 ? 0 : hexWidth / 2);
              const y = row * hexHeight * 0.75;
              const delay = (row + col) * 0.1;

              return (
                <motion.div
                  key={`${row}-${col}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0.05, 0.15, 0.05],
                    scale: [0.9, 1.1, 0.9],
                  }}
                  transition={{
                    duration: 10 + Math.random() * 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: delay % 5,
                  }}
                  className="absolute"
                  style={{
                    left: x,
                    top: y,
                    width: hexSize * Math.sqrt(3),
                    height: hexSize * 2,
                    clipPath:
                      "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    background: "rgba(16, 185, 129, 0.1)",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Binary rain animation
  const BinaryRain = () => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [columns, setColumns] = useState(0);
    const [drops, setDrops] = useState([]);

    useEffect(() => {
      const updateDimensions = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        setDimensions({ width, height });
        setColumns(Math.floor(width / 20));
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    useEffect(() => {
      if (columns === 0) return;

      const newDrops = Array(columns)
        .fill(0)
        .map(() => ({
          y: Math.random() * -100,
          speed: 2 + Math.random() * 3,
          length: 5 + Math.floor(Math.random() * 10),
          opacity: 0.1 + Math.random() * 0.3,
        }));

      setDrops(newDrops);

      const interval = setInterval(() => {
        setDrops((prevDrops) =>
          prevDrops.map((drop) => ({
            ...drop,
            y:
              drop.y > dimensions.height
                ? -drop.length * 20
                : drop.y + drop.speed,
          }))
        );
      }, 50);

      return () => clearInterval(interval);
    }, [columns, dimensions.height]);

    return (
      <div className="absolute inset-0 overflow-hidden">
        {drops.map((drop, i) => (
          <motion.div
            key={i}
            className="absolute text-emerald-400 font-mono text-xs"
            style={{
              left: i * 20,
              top: drop.y,
              opacity: drop.opacity,
            }}
          >
            {Array(drop.length)
              .fill(0)
              .map((_, j) => (
                <div key={j}>{Math.random() > 0.5 ? "1" : "0"}</div>
              ))}
          </motion.div>
        ))}
      </div>
    );
  };

  // Connection lines animation
  const ConnectionLines = () => {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
      const nodeCount = 15;
      const newNodes = Array(nodeCount)
        .fill(0)
        .map(() => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 2 + Math.random() * 3,
          connections: [],
        }));

      // Create connections between nodes
      newNodes.forEach((node, i) => {
        const connectionCount = 1 + Math.floor(Math.random() * 3);
        for (let j = 0; j < connectionCount; j++) {
          const targetIndex = Math.floor(Math.random() * nodeCount);
          if (targetIndex !== i) {
            node.connections.push(targetIndex);
          }
        }
      });

      setNodes(newNodes);

      const interval = setInterval(() => {
        setNodes((prevNodes) =>
          prevNodes.map((node) => ({
            ...node,
            x: Math.max(0, Math.min(100, node.x + (Math.random() - 0.5))),
            y: Math.max(0, Math.min(100, node.y + (Math.random() - 0.5))),
          }))
        );
      }, 2000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="absolute inset-0 overflow-hidden">
        {nodes.map((node, i) => (
          <div key={i}>
            {node.connections.map((connIndex, j) => {
              const targetNode = nodes[connIndex];
              if (!targetNode) return null;

              return (
                <motion.div
                  key={j}
                  className="absolute bg-emerald-500"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    width: `${Math.sqrt(
                      Math.pow(targetNode.x - node.x, 2) +
                        Math.pow(targetNode.y - node.y, 2)
                    )}%`,
                    height: "1px",
                    originX: 0,
                    originY: 0,
                    transform: `rotate(${Math.atan2(
                      targetNode.y - node.y,
                      targetNode.x - node.x
                    )}rad)`,
                    opacity: 0.1,
                  }}
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 4,
                    repeat: Infinity,
                  }}
                />
              );
            })}
          </div>
        ))}
        {nodes.map((node, i) => (
          <motion.div
            key={`node-${i}`}
            className="absolute rounded-full bg-emerald-400"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: `${node.size}px`,
              height: `${node.size}px`,
              opacity: 0.5,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-emerald-400 overflow-hidden relative">
      {/* Cyber-themed background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-900/30 opacity-80" />

      {/* Hexagon grid pattern */}
      <HexagonPattern />

      {/* Binary rain animation */}
      <BinaryRain />

      {/* Connection lines animation */}
      <ConnectionLines />

      {/* Glowing particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-emerald-400"
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            x: [null, Math.random() * 100],
            y: [null, Math.random() * 100],
            opacity: [0, 0.4, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 5}px`,
            height: `${2 + Math.random() * 5}px`,
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.2,
        }}
        className="bg-slate-800/80 backdrop-blur-sm border-b border-emerald-500/20 relative z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="ml-2 text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Secure Cyber Future
              </motion.span>
            </motion.div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md bg-slate-700/50 hover:bg-slate-700/70 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="text-emerald-400" size={20} />
                    <span className="text-sm text-white">
                      {user.email.split("@")[0]}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg border border-emerald-500/20 z-50 overflow-hidden text-left focus:outline-none"
                        onClick={handleLogout}
                        whileHover={{
                          backgroundColor: "rgba(30, 41, 59, 0.5)",
                          transition: { duration: 0.1 },
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center px-4 py-2 text-sm text-red-400">
                          <LogOut className="mr-2 flex-shrink-0" size={16} />
                          <span>Sign Out</span>
                        </div>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white flex items-center shadow-lg shadow-emerald-500/10"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 5px 15px rgba(16, 185, 129, 0.4)",
                    transition: {
                      type: "spring",
                      stiffness: 300,
                    },
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.1 },
                  }}
                >
                  Secure Login <ArrowRight className="ml-2" size={18} />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-start p-4 pt-10 relative z-10">
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
                className="w-64 bg-slate-800 border border-emerald-500/30 rounded-2xl shadow-2xl p-6"
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

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.h1
              className="text-4xl font-bold text-emerald-300 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Password Strength Analyzer
            </motion.h1>
            <motion.p
              className="text-emerald-500 max-w-lg mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Check your password strength and get security recommendations
            </motion.p>
          </motion.div>

          {/* Form and Meter Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Card - Left Side */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="h-full bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl shadow-2xl overflow-hidden"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
              />

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
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
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

            {/* Meter Card - Right Side */}
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result-card"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover="hover"
                  className="h-full bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl shadow-2xl overflow-hidden"
                >
                  <motion.button
                    onClick={() => setResult(null)}
                    className="absolute top-4 right-4 text-emerald-500 hover:text-emerald-300 transition-colors duration-300 z-20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} />
                  </motion.button>

                  <div className="relative p-8 text-center h-full flex flex-col">
                    <ShieldCheck
                      className="mx-auto mb-4 text-emerald-500"
                      size={80}
                      strokeWidth={1.5}
                    />
                    <h2 className="text-3xl font-bold mb-2 text-emerald-300">
                      Analysis Results
                    </h2>
                    <p className="text-emerald-500 mb-6">
                      Your password security
                    </p>

                    <div className="flex-grow flex flex-col items-center justify-center">
                      <motion.div
                        className="relative"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                      >
                        <div className="w-48 h-48 relative">
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
                              initial={{ strokeDashoffset: 283 }}
                              animate={{
                                strokeDashoffset:
                                  283 -
                                  (283 * getMeterValue(result.strength)) / 100,
                              }}
                              transition={{
                                duration: 1.5,
                                ease: "easeInOut",
                                delay: 0.5,
                              }}
                              style={{
                                filter: `drop-shadow(0 0 8px ${getMeterColor(
                                  result.strength
                                )})`,
                              }}
                            />
                          </svg>

                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.span
                              className="text-xl font-bold"
                              style={{ color: getMeterColor(result.strength) }}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1 }}
                            >
                              {getMeterValue(result.strength)}%
                            </motion.span>
                          </div>
                        </div>

                        <motion.div
                          className="text-center mt-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2 }}
                        >
                          <div
                            className="text-2xl font-bold mb-2"
                            style={{
                              color: getMeterColor(result.strength),
                              textShadow: `0 0 8px ${getMeterColor(
                                result.strength
                              )}`,
                            }}
                          >
                            {result.strength}
                          </div>
                          <motion.p
                            className="text-emerald-400 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4 }}
                          >
                            {result.message}
                          </motion.p>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder-card"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="h-full bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center"
                >
                  <motion.div
                    className="p-8 text-center text-emerald-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Lock className="mx-auto mb-4" size={60} />
                    <h3 className="text-xl font-semibold mb-2">
                      Password Meter
                    </h3>
                    <p>Analyze a password to see its strength rating</p>
                    <motion.div
                      className="mt-6 w-32 h-2 bg-slate-700 rounded-full mx-auto overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.8, duration: 1 }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-slate-600 via-emerald-500 to-slate-600"
                        animate={{
                          x: [-100, 100],
                        }}
                        transition={{
                          repeat: Infinity,
                          repeatType: "loop",
                          duration: 2,
                          ease: "linear",
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Details Section - Below both cards */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  height: showDetails ? "auto" : 0,
                  transition: {
                    opacity: { duration: 0.3 },
                    height: { duration: 0.4 },
                  },
                }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <motion.div className="w-full bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl shadow-2xl overflow-hidden">
                  <motion.button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full flex items-center justify-between p-6 text-emerald-300 hover:text-emerald-200 transition-colors"
                    whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
                  >
                    <h3 className="text-xl font-bold flex items-center">
                      <AlertTriangle className="mr-2" size={20} />
                      Security Details & Recommendations
                    </h3>
                    {showDetails ? (
                      <ChevronUp className="text-emerald-500" />
                    ) : (
                      <ChevronDown className="text-emerald-500" />
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          transition: {
                            opacity: { delay: 0.2, duration: 0.3 },
                            height: { duration: 0.4 },
                          },
                        }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6"
                      >
                        <div className="space-y-4">
                          {/* Compromised Warning */}
                          {(result.isCompromised ||
                            (leakResult && leakResult.isCompromised)) && (
                            <motion.div
                              className="p-4 rounded-lg bg-red-900/20 border border-red-500/30"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <div className="flex items-start">
                                <AlertTriangle
                                  className="text-red-500 mr-3 mt-0.5 flex-shrink-0"
                                  size={20}
                                />
                                <div>
                                  <h4 className="font-bold text-red-400 mb-1">
                                    Security Alert!
                                  </h4>
                                  <p className="text-sm text-red-300">
                                    {result.compromiseSource === "local"
                                      ? "This password was found in our database of known compromised passwords!"
                                      : leakResult?.source === "api"
                                      ? "This password was found in breach databases (verified via API)!"
                                      : "This password was found in breach databases!"}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Safe Message */}
                          {leakResult &&
                            !result.isCompromised &&
                            !leakResult.isCompromised && (
                              <motion.div
                                className="p-4 rounded-lg bg-green-900/20 border border-green-500/30"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                              >
                                <div className="flex items-start">
                                  <ShieldCheck
                                    className="text-green-500 mr-3 mt-0.5 flex-shrink-0"
                                    size={20}
                                  />
                                  <div>
                                    <h4 className="font-bold text-green-400 mb-1">
                                      No Leaks Found
                                    </h4>
                                    <p className="text-sm text-green-300">
                                      {leakResult.message}
                                      {leakResult.source === "api" &&
                                        " (verified via API)"}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}

                          {/* Recommendations */}
                          {result.warnings?.length > 0 && (
                            <motion.div
                              className="p-4 rounded-lg bg-slate-800/50 border border-emerald-500/20"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <h4 className="text-lg font-bold text-emerald-300 mb-3 flex items-center">
                                <Activity className="mr-2" size={20} />
                                Recommendations
                              </h4>
                              <ul className="space-y-3">
                                {result.warnings.map((warning, i) => (
                                  <motion.li
                                    key={i}
                                    className="flex items-start"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + i * 0.1 }}
                                  >
                                    {warning.startsWith("DO NOT USE") ? (
                                      <AlertTriangle
                                        className="text-red-500 mr-3 mt-0.5 flex-shrink-0"
                                        size={16}
                                      />
                                    ) : (
                                      <span className="text-emerald-400 mr-3">
                                        •
                                      </span>
                                    )}
                                    <span className="text-sm">{warning}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                          )}

                          <motion.button
                            onClick={handleSubmit}
                            className="w-full mt-4 bg-emerald-800/50 border border-emerald-500/30 text-emerald-300 py-3 rounded-lg hover:bg-emerald-900/50 transition-colors duration-300 flex items-center justify-center"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                          >
                            <Code className="mr-2" size={18} />
                            Get Custom Password Suggestions
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthChecker;