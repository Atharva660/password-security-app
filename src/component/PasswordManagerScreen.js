import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Key, Lock, Eye, EyeOff, Trash2, Copy, Check, 
  Loader2, Search, ChevronDown, ShieldCheck, X 
} from "lucide-react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { decryptPassword } from "../utils/passwordUtils";

const PasswordManager = () => {
  const [user, setUser] = useState(null);
  const [passwords, setPasswords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState({});
  const [copied, setCopied] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categories = ["All", "Social", "Work", "Shopping", "Finance", "Other"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          setIsLoading(true);
          const passwordsRef = collection(db, "users", currentUser.email, "savedPasswords");
          const q = query(passwordsRef);
          const querySnapshot = await getDocs(q);
          
          // Decrypt all passwords immediately after fetching
          const loadedPasswords = await Promise.all(
            querySnapshot.docs.map(async doc => {
              const data = doc.data();
              const decrypted = decryptPassword(data.encryptedPassword, data.iv);
              
              return {
                id: doc.id,
                website: data.title,
                username: data.username || "",
                password: decrypted || "Decryption failed",
                notes: data.notes || "",
                category: data.category || "Other",
                lastUpdated: data.lastUpdated || new Date().toISOString()
              };
            })
          );
          
          setPasswords(loadedPasswords);
        } catch (error) {
          console.error("Error fetching passwords:", error);
          setError("Failed to load passwords");
        } finally {
          setIsLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDeletePassword = async (passwordId) => {
    try {
      setIsLoading(true);
      const passwordRef = doc(db, "users", user.email, "savedPasswords", passwordId);
      await deleteDoc(passwordRef);
      setPasswords(passwords.filter(p => p.id !== passwordId));
    } catch (error) {
      console.error("Error deleting password:", error);
      setError("Failed to delete password");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = password.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || password.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-4 py-2 bg-red-900/50 text-red-300 rounded-lg m-4"
          >
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)}>
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main className="flex-grow relative z-10 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 text-emerald-500" size={20} />
            <input
              type="text"
              placeholder="Search passwords..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-slate-800/50 border border-emerald-500/30 text-white py-2 pl-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-emerald-400" size={18} />
          </div>
        </div>

        {/* Password List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="text-emerald-500 animate-spin" size={48} />
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 gap-4" variants={containerVariants}>
            {filteredPasswords.map(password => (
              <motion.div 
                key={password.id} 
                variants={itemVariants}
                className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-4 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-900/30 p-2 rounded-lg">
                      <ShieldCheck className="text-emerald-400" size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-emerald-300">{password.website}</h3>
                      <p className="text-sm text-gray-400">{password.username}</p>
                      <div className="flex items-center mt-2 gap-2">
                        <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded">
                          {password.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          Updated: {new Date(password.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setShowPassword(prev => ({
                          ...prev,
                          [password.id]: !prev[password.id]
                        }));
                      }}
                      className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-slate-700/50 rounded"
                    >
                      {showPassword[password.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(password.password);
                        setCopied(password.id);
                        setTimeout(() => setCopied(null), 2000);
                      }}
                      className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-slate-700/50 rounded"
                    >
                      {copied === password.id ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                    <button 
                      onClick={() => handleDeletePassword(password.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-700/50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                {showPassword[password.id] && (
                  <div className="mt-3 bg-slate-900/30 rounded-lg p-3 font-mono text-sm">
                    {password.password}
                  </div>
                )}
                
                {password.notes && (
                  <div className="mt-2 text-xs text-gray-400">
                    <span className="font-medium">Notes:</span> {password.notes}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.main>
    </div>
  );
};

export default PasswordManager;