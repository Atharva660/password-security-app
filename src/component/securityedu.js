import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
    Zap,
    Shield,
    Key,
    AlertTriangle,
    Lock,
    EyeOff,
    ArrowRight,
    User,
    LogOut,
} from "lucide-react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const SecurityEducation = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [flippedCards, setFlippedCards] = useState([]);
    const controls = useAnimation();
    const cardRefs = useRef([]);

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
    };

    const toggleCard = (index) => {
        setFlippedCards((prevFlipped) =>
            prevFlipped.includes(index)
                ? prevFlipped.filter((i) => i !== index)
                : [...prevFlipped, index]
        );
    };

    const cards = [
        {
            attackTitle: "Brute Force Attacks",
            attackIcon: "💥",
            attackContent: [
                "Automated tools test millions of combinations per second",
                "8-character passwords can be cracked in under 1 hour",
                "Common patterns (qwerty, 123456) are tried first",
                "GPU clusters accelerate cracking exponentially",
            ],
            defenseTitle: "Defense Strategies",
            defenseIcon: "🛡",
            defenseContent: [
                "Use 14+ character passwords with mixed character types",
                "Implement account lockouts after 5 failed attempts",
                "Enable rate limiting on authentication endpoints",
                "Consider passwordless authentication methods",
            ],
        },
        {
            attackTitle: "Phishing Threats",
            attackIcon: "🎣",
            attackContent: [
                "Fake login pages mimic legitimate sites perfectly",
                "Urgent 'security alert' emails create panic",
                "SMS phishing (smishing) targets mobile users",
                "Social media scams impersonate trusted contacts",
            ],
            defenseTitle: "Defense Strategies",
            defenseIcon: "🔍",
            defenseContent: [
                "Always check URLs before entering credentials",
                "Use bookmarklets for important sites (don't click links)",
                "Enable U2F security keys for critical accounts",
                "Train staff to recognize phishing indicators",
            ],
        },
        {
            attackTitle: "Credential Reuse",
            attackIcon: "🔄",
            attackContent: [
                "60% of users reuse passwords across sites",
                "Breached credentials are sold on dark web",
                "Automated tools test credentials across hundreds of sites",
                "Successful takeovers often go undetected for months",
            ],
            defenseTitle: "Defense Strategies",
            defenseIcon: "🗝",
            defenseContent: [
                "Use a password manager to generate/store unique passwords",
                "Monitor for credential leaks with HaveIBeenPwned",
                "Implement breached password detection systems",
                "Enforce regular password rotations for critical systems",
            ],
        },
    ];

    // Optimized mouse move effect using requestAnimationFrame
    useEffect(() => {
        let animationFrameId;
        const cardElements = cardRefs.current;

        const handleMouseMove = (e, card, index) => {
            if (!card) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;

            const cardInner = card.querySelector(".card-inner");

            if (!flippedCards.includes(index)) {
                cardInner.style.transform = `perspective(1200px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            } else {
                cardInner.style.transform = `perspective(1200px) rotateX(${angleX}deg) rotateY(${
                    180 + angleY
                }deg)`;
            }
        };

        const handleMouseLeave = (card) => {
            const cardInner = card.querySelector(".card-inner");
            if (flippedCards.includes(parseInt(card.dataset.index))) {
                cardInner.style.transform = "perspective(1200px) rotateY(180deg)";
            } else {
                cardInner.style.transform = "perspective(1200px) rotateY(0deg)";
            }
        };

        const optimizedMouseMove = (e, card, index) => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            animationFrameId = requestAnimationFrame(() =>
                handleMouseMove(e, card, index)
            );
        };

        cardElements.forEach((card, index) => {
            if (card) {
                card.dataset.index = index;
                card.addEventListener("mousemove", (e) =>
                    optimizedMouseMove(e, card, index)
                );
                card.addEventListener("mouseleave", () => handleMouseLeave(card));
            }
        });

        return () => {
            cardElements.forEach((card, index) => {
                if (card) {
                    card.removeEventListener("mousemove", (e) =>
                        optimizedMouseMove(e, card, index)
                    );
                    card.removeEventListener("mouseleave", () => handleMouseLeave(card));
                }
            });
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [flippedCards]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.15,
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
                stiffness: 120,
                damping: 12,
                mass: 0.5,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
            },
        },
        hover: {
            scale: 1.03,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
            },
        },
        tap: {
            scale: 0.97,
        },
    };

    // Optimized floating bits animation
    const FloatingBits = () => {
        const bits = [];
        for (let i = 0; i < 20; i++) {
            bits.push(
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
                        opacity: [0, 0.15, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: Math.random() * 15 + 15,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "linear",
                    }}
                    className="absolute text-emerald-400/20 font-mono text-xs pointer-events-none"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                >
                    0101{Math.floor(Math.random() * 10000).toString(2)}
                </motion.div>
            );
        }
        return <>{bits}</>;
    };

    const CyberPattern = () => (
        <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 w-full h-full pointer-events-none"
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
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <CyberPattern />
                <FloatingBits />
            </div>

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

            {/* Main Content */}
            <motion.main
                className="flex-grow relative z-10 pt-12 pb-16 px-4 sm:px-6 lg:px-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div
                    className="text-center mb-12 w-full max-w-4xl mx-auto"
                    variants={itemVariants}
                >
                    <motion.div
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 mb-4"
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
                        Interactive Learning
                    </motion.div>
                    <motion.h1
                        className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-emerald-500 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.02 }}
                    >
                        Security Education Matrix
                    </motion.h1>
                    <motion.p
                        className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto"
                        whileHover={{ scale: 1.01 }}
                    >
                        Interactive exploration of cyber threats and their defensive
                        countermeasures
                    </motion.p>
                </motion.div>

                {/* Cards Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                    variants={containerVariants}
                >
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            ref={(el) => (cardRefs.current[index] = el)}
                            className="card relative h-80 cursor-pointer"
                            onClick={() => toggleCard(index)}
                            variants={cardVariants}
                            whileHover="hover"
                            whileTap="tap"
                            custom={index}
                        >
                            <div
                                className="card-inner"
                                style={{
                                    transform: flippedCards.includes(index)
                                        ? "rotateY(180deg)"
                                        : "rotateY(0deg)"
                                }}
                            >
                                {/* Attack Side (Front) */}
                                <motion.div
                                    className="card-front rounded-xl p-6 flex flex-col backdrop-blur-lg border border-gray-800 bg-gray-900 bg-opacity-70 shadow-lg"
                                    style={{
                                        boxShadow: "0 0 15px rgba(255, 74, 74, 0.6), 0 10px 30px rgba(0, 0, 0, 0.5)"
                                    }}
                                >
                                    <div className="card-title text-xl font-semibold mb-4 pb-3 border-b border-gray-700 flex items-center text-red-500">
                                        <span className="text-2xl mr-3">{card.attackIcon}</span>
                                        {card.attackTitle}
                                    </div>
                                    <ul className="card-content space-y-3 text-gray-300 flex-grow">
                                        {card.attackContent.map((item, i) => (
                                            <li key={i} className="flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>

                                {/* Defense Side (Back) */}
                                <motion.div
                                    className="card-back rounded-xl p-6 flex flex-col backdrop-blur-lg border border-gray-800 bg-gray-900 bg-opacity-70 shadow-lg"
                                    style={{
                                        boxShadow: "0 0 15px rgba(16, 185, 129, 0.6), 0 10px 30px rgba(0, 0, 0, 0.5)"
                                    }}
                                >
                                    <div className="card-title text-xl font-semibold mb-4 pb-3 border-b border-gray-700 flex items-center text-emerald-500">
                                        <span className="text-2xl mr-3">{card.defenseIcon}</span>
                                        {card.defenseTitle}
                                    </div>
                                    <ul className="card-content space-y-3 text-gray-300 flex-grow">
                                        {card.defenseContent.map((item, i) => (
                                            <li key={i} className="flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.main>

            {/* Footer - always at bottom */}
            <motion.footer
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="py-8 bg-slate-800/80 border-t border-emerald-500/20 relative z-10"
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
            <style jsx>{`
                .card {
                    perspective: 1200px;
                }
                .card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
                    transform-style: preserve-3d;
                }
                .card-front,
                .card-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .card-back {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
};

export default SecurityEducation;