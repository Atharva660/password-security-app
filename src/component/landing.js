import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, Key, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Password Strength Checker",
      description: "Analyze your password security with our advanced strength meter and get instant feedback.",
      icon: <ShieldCheck size={40} className="text-emerald-500" />,
      action: "Check Now",
      link: "/password-strength"
    },
    {
      title: "Password Generator",
      description: "Create strong, unique passwords with our secure generator to protect your accounts.",
      icon: <Key size={40} className="text-emerald-500" />,
      action: "Generate Now",
      link: "/password-generator"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <nav className="bg-slate-800/80 backdrop-blur-sm border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Lock className="h-8 w-8 text-emerald-500" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Secure Cyber Future
              </span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-300 flex items-center"
            >
              Login <ArrowRight className="ml-2" size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
              <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                    <span className="block">Secure Your</span>
                    <span className="block text-emerald-400">Digital Future</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Advanced security tools to protect your online identity and data. 
                    Our solutions help you create and manage strong passwords effortlessly.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <button
                        onClick={() => navigate('/password-strength')}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-emerald-500 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
              Powerful tools for your security
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
              Everything you need to protect your online accounts
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-6 shadow-lg overflow-hidden"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-slate-700/50 rounded-md p-3">
                      {feature.icon}
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-bold">{feature.title}</h3>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate(feature.link)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300"
                    >
                      {feature.action}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-emerald-500 font-semibold tracking-wide uppercase">About Us</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
              Secure Cyber Future
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
              Your trusted partner in digital security
            </p>
          </div>
          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="bg-slate-800/50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-emerald-400">Our Mission</h3>
                <p className="mt-2 text-gray-300">
                  To empower individuals and businesses with tools to protect their digital identities and secure their online presence.
                </p>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-emerald-400">Our Vision</h3>
                <p className="mt-2 text-gray-300">
                  A future where everyone can navigate the digital world safely without fear of compromise.
                </p>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-emerald-400">Our Values</h3>
                <p className="mt-2 text-gray-300">
                  Security, Privacy, Innovation, and Accessibility - the pillars of everything we build.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800/80 border-t border-emerald-500/20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} Secure Cyber Future. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;