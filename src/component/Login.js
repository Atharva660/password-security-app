import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import crypto from "crypto-js";
import {
  ShieldCheck,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  UserPlus,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";

const ModernSecureLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const hashPassword = (password, salt = null) => {
    const usedSalt = salt || crypto.lib.WordArray.random(64).toString();
    const hash = crypto
      .PBKDF2(password, usedSalt, {
        keySize: 256 / 32,
        iterations: 1000,
      })
      .toString();
    return { salt: usedSalt, hash };
  };

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

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.email));

      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.email), {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
          provider: "google",
        });
      }

      navigate("/landing");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        if (!email || !password) {
          throw new Error("Please enter both email and password");
        }

        const [firebaseAuthResult, customAuthResult] = await Promise.allSettled(
          [
            signInWithEmailAndPassword(auth, email, password).catch((e) => e),
            (async () => {
              const userDoc = await getDoc(doc(db, "users", email));
              if (!userDoc.exists()) {
                return { valid: false, error: "User not found" };
              }

              if (userDoc.data().provider === "google") {
                return { valid: false, error: "Please sign in with Google" };
              }

              const { salt, hash: storedHash } = userDoc.data();
              const { hash: enteredHash } = hashPassword(password, salt);
              return {
                valid: enteredHash === storedHash,
                error: "Incorrect password",
              };
            })(),
          ]
        );

        const firebaseSuccess = firebaseAuthResult.status === "fulfilled";
        const customSuccess =
          customAuthResult.status === "fulfilled" &&
          customAuthResult.value.valid;

        if (!firebaseSuccess && !customSuccess) {
          const firebaseError =
            firebaseAuthResult.status === "rejected"
              ? firebaseAuthResult.reason
              : firebaseAuthResult.value;
          const customError =
            customAuthResult.value?.error || "Authentication failed";

          throw new Error(firebaseError?.message || customError);
        }

        navigate("/landing");
      } else {
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters long");
        }

        const [firebaseUser, customUser] = await Promise.all([
          getAuth()
            .getUserByEmail(email)
            .catch(() => null),
          getDoc(doc(db, "users", email)),
        ]);

        if (firebaseUser || customUser.exists()) {
          throw new Error("User with this email already exists");
        }

        await Promise.all([
          createUserWithEmailAndPassword(auth, email, password),
          (async () => {
            const { salt, hash } = hashPassword(password);
            await setDoc(doc(db, "users", email), {
              email,
              salt,
              hash,
              createdAt: new Date(),
              provider: "email",
            });
          })(),
        ]);

        navigate("/profile-setup");
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

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

  // Connection lines animation
  const ConnectionLines = () => {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
      const nodeCount = 15;
      const newNodes = Array(nodeCount).fill(0).map(() => ({
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
        setNodes(prevNodes => 
          prevNodes.map(node => ({
            ...node,
            x: `Math.max(0, Math.min(100, node.x + (Math.random() - 0.5))`,
            y: `Math.max(0, Math.min(100, node.y + (Math.random() - 0.5)))`,
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
                    height: '1px',
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
    <div className="min-h-screen bg-slate-900 text-emerald-400 overflow-hidden relative flex items-center justify-center p-4">
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
            filter: 'blur(1px)',
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
          className="px-8 pb-4 space-y-4"
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

          {/* Social Login Divider */}
          <motion.div className="relative flex items-center py-4" variants={itemVariants}>
            <div className="flex-grow border-t border-emerald-500/20"></div>
            <span className="flex-shrink mx-4 text-emerald-500/80 text-sm">OR</span>
            <div className="flex-grow border-t border-emerald-500/20"></div>
          </motion.div>

          {/* Google Sign-In Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-slate-800/50 border border-emerald-500/30 text-emerald-300 py-3 rounded-lg hover:bg-slate-700/50 transition-colors duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <FcGoogle className="mr-2" size={20} />
              Continue with Google
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