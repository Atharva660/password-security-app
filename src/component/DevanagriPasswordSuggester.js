import React, { useState, useEffect } from "react";
import { generateDevnagriPassword,} from "../utils/passwordGenerator";
import { calculatePasswordStrength } from "../utils/passwordStrength";
import { savePasswordToDB } from "../utils/passwordUtils";
import {
  ShieldCheck,
  Lock,
  Activity,
  Fingerprint,
  Code,
  Copy,
  Check,
  X,
  Text,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BarChart2,
  User,
  LogOut,
  ArrowRight,
  Zap,
} from "lucide-react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const DevanagriPasswordSuggester = () => {
  const [passwords, setPasswords] = useState([]);
  const [selectedPassword, setSelectedPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [savedPassword, setSavedPassword] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [title, setTitle] = useState("");
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStrengthDetails, setShowStrengthDetails] = useState(false);
  const [strengthResult, setStrengthResult] = useState(null);
  const [options, setOptions] = useState({
    numbers: true,
    letters: true,
    specialChars: true,
    devnagri: true,
    length: 12
  });
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

  useEffect(() => {
    if (selectedPassword) {
      const result = calculatePasswordStrength(selectedPassword);
      setStrengthResult(result);
    }
  }, [selectedPassword]);

  const getMeterColor = (strength) => {
    switch (strength) {
      case "Very Weak": return "#ef4444";
      case "Weak": return "#f97316";
      case "Medium": return "#eab308";
      case "Strong": return "#22c55e";
      case "Very Strong": return "#10b981";
      default: return "#64748b";
    }
  };

  const getMeterValue = (strength) => {
    switch (strength) {
      case "Very Weak": return 20;
      case "Weak": return 40;
      case "Medium": return 60;
      case "Strong": return 80;
      case "Very Strong": return 100;
      default: return 0;
    }
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
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const hexSize = 60;
    const hexWidth = hexSize * Math.sqrt(3);
    const hexHeight = hexSize * 2;
    const cols = Math.ceil(dimensions.width / hexWidth) + 1;
    const rows = Math.ceil(dimensions.height / (hexHeight * 0.75)) + 1;

    return (
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="flex" style={{ marginTop: row === 0 ? 0 : -hexSize * 0.25 }}>
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
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    background: 'rgba(16, 185, 129, 0.1)',
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
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
      if (columns === 0) return;

      const newDrops = Array(columns).fill(0).map(() => ({
        y: Math.random() * -100,
        speed: 2 + Math.random() * 3,
        length: 5 + Math.floor(Math.random() * 10),
        opacity: 0.1 + Math.random() * 0.3,
      }));

      setDrops(newDrops);

      const interval = setInterval(() => {
        setDrops(prevDrops => 
          prevDrops.map(drop => ({
            ...drop,
            y: drop.y > dimensions.height ? -drop.length * 20 : drop.y + drop.speed,
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
            {Array(drop.length).fill(0).map((_, j) => (
              <div key={j}>
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    );
  };

  const handleOptionChange = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleLengthChange = (e) => {
    setOptions(prev => ({
      ...prev,
      length: parseInt(e.target.value)
    }));
  };

  const handleSuggestPasswords = () => {
    setIsLoading(true);
    setSavedPassword(false);

    setTimeout(() => {
      const generatedPasswords = Array.from(
        { length: 5 },
        () => generateDevnagriPassword(options)
      );
      setPasswords(generatedPasswords);
      setIsLoading(false);
    }, 1000);
  };

  const handleSavePassword = () => {
    if (!user) {
      alert("Please sign in to save passwords");
      return;
    }
    setShowSavePopup(true);
  };

  const handleConfirmSave = async () => {
    if (!title.trim()) {
      alert("Please enter a title/URL!");
      return;
    }

    setIsLoading(true);

    try {
      const passwordData = {
        title,
        password: selectedPassword,
        createdAt: new Date().toISOString(),
      };

      await savePasswordToDB(passwordData, user.uid);
      setSavedPassword(true);
      setShowSavePopup(false);
      setTitle("");

      setTimeout(() => {
        setSavedPassword(false);
        setSelectedPassword("");
        setPasswords([]);
      }, 2000);
    } catch (error) {
      console.error("Error saving password:", error);
      alert("Error saving password!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-emerald-400 overflow-hidden relative">
      {/* Cyber-themed background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-900/30 opacity-80" />
      
      {/* Hexagon grid pattern */}
      <HexagonPattern />
      
      {/* Binary rain animation */}
      <BinaryRain />
      
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
            filter: 'blur(1px)',
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
                  {savedPassword ? "Saving Password..." : "Generating Passwords..."}
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save Password Popup */}
        <AnimatePresence>
          {showSavePopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-md bg-slate-800 border border-emerald-500/30 rounded-2xl p-6 relative"
              >
                <motion.button
                  onClick={() => setShowSavePopup(false)}
                  className="absolute top-4 right-4 text-emerald-500 hover:text-emerald-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>

                <h3 className="text-xl font-bold text-emerald-300 mb-6 flex items-center">
                  <Lock className="mr-2" size={20} />
                  Save Password
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-emerald-400 text-sm mb-1 flex items-center">
                      <Text className="mr-2" size={16} />
                      Title/URL
                    </label>
                    <motion.input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Google Account or https://google.com"
                      className="w-full bg-slate-900/50 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>

                  <div>
                    <label className="block text-emerald-400 text-sm mb-1 flex items-center">
                      <Lock className="mr-2" size={16} />
                      Password
                    </label>
                    <input
                      type="text"
                      value={selectedPassword}
                      readOnly
                      className="w-full bg-slate-900/50 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Password Strength Meter */}
                  {strengthResult && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-emerald-400">Password Strength</span>
                        <span 
                          className="text-sm font-medium"
                          style={{ color: getMeterColor(strengthResult.strength) }}
                        >
                          {strengthResult.strength}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${getMeterValue(strengthResult.strength)}%`,
                            backgroundColor: getMeterColor(strengthResult.strength)
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-emerald-400 mt-1">{strengthResult.message}</p>
                    </div>
                  )}

                  <motion.button
                    onClick={handleConfirmSave}
                    disabled={isLoading}
                    className="w-full bg-emerald-800/50 border border-emerald-500/30 text-emerald-300 py-3 rounded-lg hover:bg-emerald-900/50 transition-colors duration-300 mt-4 flex items-center justify-center"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {isLoading ? (
                      "Saving..."
                    ) : (
                      <>
                        <Check className="mr-2" size={20} />
                        Confirm Save
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 w-full max-w-md bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Animated Border */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
          />

          {/* Header */}
          <div className="relative p-8 text-center">
            <motion.div 
              className="absolute top-4 left-4"
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring" }}
            >
              <Fingerprint className="text-emerald-500" size={30} />
            </motion.div>
            <motion.div 
              className="absolute top-4 right-4"
              whileHover={{ rotate: -15 }}
              transition={{ type: "spring" }}
            >
              <Code className="text-emerald-500" size={30} />
            </motion.div>

            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <ShieldCheck
                className="mx-auto mb-4 text-emerald-500"
                size={80}
                strokeWidth={1.5}
              />
            </motion.div>

            <motion.h2 
              className="text-3xl font-bold mb-2 text-emerald-300"
              whileHover={{ scale: 1.02 }}
            >
              Devnagri Passwords
            </motion.h2>
            <motion.p 
              className="text-emerald-500"
              whileHover={{ scale: 1.01 }}
            >
              Generate & Secure Your Passwords
            </motion.p>
            {user && (
              <motion.p 
                className="text-sm text-emerald-400 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Logged in as: {user.email}
              </motion.p>
            )}
          </div>

          {/* Password Generation */}
          <div className="px-8 pb-8 space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.numbers} 
                  onChange={() => handleOptionChange('numbers')} 
                  className="hidden" 
                />
                <div className={`w-5 h-5 border ${options.numbers ? 'border-emerald-500 bg-emerald-500' : 'border-emerald-500/50'} rounded flex items-center justify-center`}>
                  {options.numbers && <Check className="text-white" size={16} />}
                </div>
                <span className="text-sm text-emerald-400">Numbers</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.letters} 
                  onChange={() => handleOptionChange('letters')} 
                  className="hidden" 
                />
                <div className={`w-5 h-5 border ${options.letters ? 'border-emerald-500 bg-emerald-500' : 'border-emerald-500/50'} rounded flex items-center justify-center`}>
                  {options.letters && <Check className="text-white" size={16} />}
                </div>
                <span className="text-sm text-emerald-400">Letters</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.specialChars} 
                  onChange={() => handleOptionChange('specialChars')} 
                  className="hidden" 
                />
                <div className={`w-5 h-5 border ${options.specialChars ? 'border-emerald-500 bg-emerald-500' : 'border-emerald-500/50'} rounded flex items-center justify-center`}>
                  {options.specialChars && <Check className="text-white" size={16} />}
                </div>
                <span className="text-sm text-emerald-400">Special Chars</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.devnagri} 
                  onChange={() => handleOptionChange('devnagri')} 
                  className="hidden" 
                />
                <div className={`w-5 h-5 border ${options.devnagri ? 'border-emerald-500 bg-emerald-500' : 'border-emerald-500/50'} rounded flex items-center justify-center`}>
                  {options.devnagri && <Check className="text-white" size={16} />}
                </div>
                <span className="text-sm text-emerald-400">Devnagri</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-emerald-400 text-sm mb-2">Password Length: <span className="font-bold">{options.length}</span></label>
              <input 
                type="range" 
                min="6" 
                max="20" 
                value={options.length}
                onChange={handleLengthChange}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <motion.button
              onClick={handleSuggestPasswords}
              disabled={isLoading}
              className="w-full bg-emerald-800/50 border border-emerald-500/30 text-emerald-300 py-3 rounded-lg hover:bg-emerald-900/50 transition-colors duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Activity className="mr-2" size={20} />
              Generate Secure Passwords
            </motion.button>

            {/* Password List */}
            {passwords.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5 }}
                className="bg-slate-900/50 border border-emerald-500/30 rounded-lg overflow-hidden"
              >
                {passwords.map((pwd, index) => (
                  <motion.div
                    key={index}
                    className={`flex justify-between items-center p-3 border-b border-emerald-500/20 last:border-b-0 
                      ${selectedPassword === pwd ? "bg-emerald-500/20" : ""}`}
                    whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                  >
                    <div className="flex-grow">
                      <p className="text-emerald-300 text-sm">{pwd}</p>
                    </div>
                    <motion.button
                      onClick={() => setSelectedPassword(pwd)}
                      className="ml-2 text-emerald-500 hover:text-emerald-300 transition-colors"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {selectedPassword === pwd ? (
                        <Check size={20} />
                      ) : (
                        <Copy size={20} />
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Selected Password and Strength Analysis */}
            {selectedPassword && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-900/50 border border-emerald-500/30 p-4 rounded-lg"
              >
                <div className="mb-3">
                  <p className="text-emerald-300">
                    Selected Password:{" "}
                    <span className="font-bold">{selectedPassword}</span>
                  </p>
                </div>

                {/* Password Strength Analysis */}
                {strengthResult && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-emerald-400 flex items-center">
                        <Zap className="mr-1" size={16} />
                        Password Strength
                      </span>
                      <span 
                        className="text-sm font-medium"
                        style={{ color: getMeterColor(strengthResult.strength) }}
                      >
                        {strengthResult.strength}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${getMeterValue(strengthResult.strength)}%`,
                          backgroundColor: getMeterColor(strengthResult.strength)
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-emerald-400 mt-1">{strengthResult.message}</p>

                    <motion.button
                      onClick={() => setShowStrengthDetails(!showStrengthDetails)}
                      className="w-full mt-2 text-emerald-400 text-sm flex items-center justify-between"
                      whileHover={{ color: "#34d399" }}
                    >
                      <span>View detailed analysis</span>
                      {showStrengthDetails ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {showStrengthDetails && strengthResult.warnings && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 bg-slate-800/50 rounded-lg p-3 border border-emerald-500/20"
                        >
                          <h4 className="text-sm font-bold text-emerald-300 mb-2 flex items-center">
                            <BarChart2 className="mr-2" size={16} />
                            Detailed Analysis
                          </h4>
                          <ul className="space-y-2">
                            {strengthResult.warnings.map((warning, i) => (
                              <motion.li
                                key={i}
                                className="flex items-start text-sm"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                              >
                                {warning.startsWith("DO NOT USE") ? (
                                  <AlertTriangle
                                    className="text-red-500 mr-2 mt-0.5 flex-shrink-0"
                                    size={14}
                                  />
                                ) : (
                                  <span className="text-emerald-400 mr-2">•</span>
                                )}
                                <span>{warning}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <motion.button
                  onClick={handleSavePassword}
                  disabled={isLoading}
                  className="w-full bg-emerald-800/50 border border-emerald-500/30 text-emerald-300 py-3 rounded-lg hover:bg-emerald-900/50 transition-colors duration-300"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Save Securely
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DevanagriPasswordSuggester;