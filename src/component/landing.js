import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
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
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";

// Earth Model Component
function EarthModelComponent() {
  const { scene } = useGLTF("/earth.glb");
  return (
    <primitive 
      object={scene} 
      scale={0.5}
      position={[0, 0, 0]}
    />
  );
}

function EarthModel() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <EarthModelComponent />
        <OrbitControls 
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 3}
        />
        <Environment preset="dawn" />
      </Canvas>
    </div>
  );
}

const Landing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

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

  const companyInfo = {
    name: "Secure Cyber Future",
    mission: "To democratize enterprise-grade cybersecurity tools for everyone",
    description:
      "Founded in 2018 by cybersecurity veterans, we provide accessible security solutions that combine cutting-edge technology with intuitive design.",
    values: [
      "Security First in everything we build",
      "Transparency in our operations",
      "Education as empowerment",
      "Continuous innovation",
    ],
    team: "Our team consists of security researchers, cryptographers, and ethical hackers dedicated to making the internet safer.",
    location: "San Francisco, CA | Remote First",
  };

  const securityFeatures = [
    {
      title: "Password Strength Analyzer",
      description:
        "Get instant feedback on your password's vulnerability to brute force and dictionary attacks with our military-grade analysis engine.",
      icon: <ShieldCheck size={40} className="text-emerald-500" />,
      action: "Test Your Password",
      link: "/password-strength",
      securityTip:
        "Tip: The strongest passwords combine length (16+ chars), randomness, and special characters.",
    },
    {
      title: "Secure Password Generator",
      description:
        "Create cryptographically strong passwords with customizable complexity requirements using our FIPS 140-2 validated generator.",
      icon: <Key size={40} className="text-emerald-500" />,
      action: "Generate Password",
      link: "/password-suggester",
      securityTip:
        "Tip: Always use a password manager to store your generated passwords securely.",
    },
    {
      title: "Password Manager",
      description:
        "Securely store, generate, and autofill complex passwords across all your devices with end-to-end encryption.",
      icon: <Key size={40} className="text-emerald-500" />,
      action: "Manage Passwords",
      link: "/password-manager",
      securityTip:
        "Tip: Use the built-in password generator to create unique 16+ character passwords for each account.",
    },
    {
      title: "Security Education",
      description:
        "Interactive learning modules to understand modern cyber threats and defense strategies.",
      icon: <Users size={40} className="text-emerald-500" />,
      action: "Learn Security",
      link: "/security-education",
      securityTip:
        "Tip: Regular security awareness training reduces breach risk by 70%.",
    },
  ];

  const stats = [
    {
      value: "450M+",
      label: "Passwords analyzed",
      icon: <BarChart2 className="text-emerald-400" />,
    },
    {
      value: "15B+",
      label: "Breach records checked",
      icon: <Database className="text-emerald-400" />,
    },
    {
      value: "98%",
      label: "Customer satisfaction",
      icon: <Users className="text-emerald-400" />,
    },
    {
      value: "24/7",
      label: "Security monitoring",
      icon: <Shield className="text-emerald-400" />,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delay: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const floatingBits = [...Array(30)].map((_, i) => (
    <motion.div
      key={i}
      initial={{
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: 0,
        rotate: Math.random() * 360,
      }}
      animate={{
        y: [0, Math.random() * 50 - 25, 0],
        opacity: [0, 0.2, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: Math.random() * 15 + 15,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
      }}
      className="absolute text-emerald-400/20 font-mono text-xs"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    >
      {Math.floor(Math.random() * 10000).toString(2)}
    </motion.div>
  ));

  const cyberPattern = () => (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      transition={{ duration: 2 }}
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <pattern
        id="hexagons"
        width="50"
        height="43.4"
        patternUnits="userSpaceOnUse"
        patternTransform="scale(2)"
      >
        <polygon
          points="25,0 50,14.7 50,44.1 25,58.8 0,44.1 0,14.7"
          fill="none"
          stroke="#10b981"
          strokeWidth="0.5"
        />
      </pattern>
      <rect width="100%" height="100%" fill="url(#hexagons)" />
    </motion.svg>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      {cyberPattern()}
      {floatingBits}

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
        className="bg-slate-800/80 backdrop-blur-sm border-b border-emerald-500/20"
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
                {companyInfo.name}
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

      {/* Hero Section with 3D Earth */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="pt-16 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
              <motion.div
                className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="sm:text-center lg:text-left">
                  <motion.div
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 mb-4"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "mirror",
                      }}
                    >
                      <Zap className="mr-2" size={16} />
                    </motion.span>
                    Enterprise-Grade Security
                  </motion.div>
                  <motion.h1
                    className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl"
                    variants={itemVariants}
                  >
                    <motion.span className="block" whileHover={{ x: 5 }}>
                      Fortify Your
                    </motion.span>
                    <motion.span
                      className="block text-emerald-400 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      Digital Defenses
                    </motion.span>
                  </motion.h1>
                  <motion.p
                    className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                    variants={itemVariants}
                  >
                    {companyInfo.mission}. Our platform helps you identify
                    vulnerabilities and strengthen your online security posture
                    with professional tools made accessible.
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* 3D Earth Model - Right Side */}
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full">
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full w-full"
          >
            <EarthModel />
          </motion.div>
        </div>
      </div>

      {/* Company Info Section */}
      <div className="py-16 bg-slate-800/30 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className="text-base text-emerald-500 font-semibold tracking-wide uppercase"
              whileHover={{ letterSpacing: "0.15em" }}
            >
              About Secure Cyber Future
            </motion.h2>
            <motion.p
              className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl"
              whileHover={{ scale: 1.02 }}
            >
              Our Cybersecurity Mission
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={itemVariants}
              className="bg-slate-800/50 rounded-xl p-8 border border-emerald-500/20"
              whileHover={{
                y: -5,
                borderColor: "rgba(16, 185, 129, 0.4)",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              }}
            >
              <motion.h3
                className="text-2xl font-bold text-emerald-400 mb-4"
                whileHover={{ x: 5 }}
              >
                Who We Are
              </motion.h3>
              <motion.p className="text-gray-300 mb-6" whileHover={{ x: 2 }}>
                {companyInfo.description}
              </motion.p>
              <motion.p className="text-gray-300 mb-6" whileHover={{ x: 2 }}>
                {companyInfo.team}
              </motion.p>
              <motion.div
                className="flex items-center text-emerald-400"
                whileHover={{ x: 5 }}
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                >
                  <Globe className="mr-2" />
                </motion.span>
                <span>{companyInfo.location}</span>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-slate-800/50 rounded-xl p-8 border border-emerald-500/20"
              whileHover={{
                y: -5,
                borderColor: "rgba(16, 185, 129, 0.4)",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              }}
            >
              <motion.h3
                className="text-2xl font-bold text-emerald-400 mb-4"
                whileHover={{ x: 5 }}
              >
                Our Values
              </motion.h3>
              <ul className="space-y-4">
                {companyInfo.values.map((value, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: index * 0.1 },
                    }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className="flex-shrink-0 mt-1.5"
                      animate={{
                        scale: [1, 1.2, 1],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        },
                      }}
                    >
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    </motion.div>
                    <p className="ml-3 text-gray-300">{value}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Security Stats Section */}
      <div className="py-12 bg-gradient-to-b from-slate-800/50 to-slate-900/80 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-slate-800/40 border border-emerald-500/20 rounded-xl p-6 text-center backdrop-blur-sm"
                whileHover={{
                  y: -10,
                  scale: 1.03,
                  borderColor: "rgba(16, 185, 129, 0.4)",
                  transition: {
                    type: "spring",
                    stiffness: 200,
                  },
                }}
              >
                <motion.div
                  className="flex justify-center"
                  whileHover={{ scale: 1.2 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div
                  className="mt-2 text-3xl font-bold text-emerald-400"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="mt-2 text-sm text-gray-300">{stat.label}</div>
                <motion.div
                  className="mt-3 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Security Tools Section */}
      <div className="py-16 bg-slate-900/80 relative overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className="text-base text-emerald-500 font-semibold tracking-wide uppercase"
              whileHover={{ letterSpacing: "0.2em" }}
              transition={{ duration: 0.3 }}
            >
              Security Tools
            </motion.h2>
            <motion.p
              className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl"
              whileHover={{ scale: 1.02 }}
            >
              Protect Against Modern Threats
            </motion.p>
            <motion.p
              className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto"
              whileHover={{ scale: 1.01 }}
            >
              Comprehensive solutions to safeguard your digital identity
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-6 shadow-lg overflow-hidden relative group"
                whileHover={{
                  y: -10,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                  transition: {
                    type: "spring",
                    stiffness: 200,
                  },
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.2 }}
                  transition={{ duration: 0.4 }}
                />

                <div className="flex items-start relative z-10">
                  <motion.div
                    className="flex-shrink-0 bg-slate-700/50 rounded-md p-3"
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      transition: { type: "spring" },
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div className="ml-5 flex-1">
                    <motion.h3
                      className="text-lg font-bold text-emerald-300"
                      whileHover={{ x: 5 }}
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p
                      className="mt-2 text-gray-300"
                      whileHover={{ x: 2 }}
                    >
                      {feature.description}
                    </motion.p>
                    <motion.div
                      className="mt-4 p-3 bg-slate-900/50 rounded-md border border-emerald-500/10"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <p className="text-xs text-emerald-400 font-mono">
                        {feature.securityTip}
                      </p>
                    </motion.div>
                  </div>
                </div>
                <div className="mt-6 relative z-10">
                  <motion.button
                    onClick={() => navigate(feature.link)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 5px 15px rgba(16, 185, 129, 0.4)",
                      transition: {
                        type: "spring",
                        stiffness: 300,
                      },
                    }}
                    whileTap={{
                      scale: 0.97,
                      transition: { duration: 0.1 },
                    }}
                  >
                    {feature.action}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Minimal Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-8 bg-slate-800/80 border-t border-emerald-500/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            className="text-center text-sm text-gray-400"
            whileHover={{ scale: 1.02 }}
          >
            &copy; {new Date().getFullYear()} {companyInfo.name}. All rights
            reserved.
          </motion.p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Landing;

// Preload the model
useGLTF.preload("/earth.glb");