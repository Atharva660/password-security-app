import React, { useState, useEffect } from "react";
import { generateDevnagriPassword } from "../utils/passwordGenerator";
import { savePasswordToDB } from "../utils/passwordUtils";
import { convertToDevnagri } from "../utils/devnagriEncoder";
import {
  ShieldCheck,
  Lock,
  Activity,
  Fingerprint,
  Code,
  Copy,
  Check,
} from "lucide-react";

const DevanagriPasswordSuggester = () => {
  const [passwords, setPasswords] = useState([]);
  const [selectedPassword, setSelectedPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [savedPassword, setSavedPassword] = useState(false);

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

  const handleSuggestPasswords = () => {
    setIsLoading(true);
    setSavedPassword(false);

    // Simulate a bit of loading for better UX
    setTimeout(() => {
      const generatedPasswords = Array.from(
        { length: 5 },
        generateDevnagriPassword
      );
      setPasswords(generatedPasswords);
      setIsLoading(false);
    }, 1000);
  };

  const handleSavePassword = async () => {
    if (!selectedPassword) {
      alert("Please select a password!");
      return;
    }

    setIsLoading(true);

    try {
      await savePasswordToDB(selectedPassword);
      setSavedPassword(true);
    } catch (error) {
      alert("Error saving password!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-green-400 overflow-hidden relative">
      {/* Terminal-like Background */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.9)_0%,rgba(0,20,0,0.95)_100%)] opacity-90 pointer-events-none"></div>

      {/* Animated Circuit Border */}
      <div
        className="absolute inset-1 border-4 border-transparent bg-origin-border 
        bg-gradient-to-r from-green-500/30 via-blue-500/30 to-purple-500/30 
        animate-border-gradient"
      ></div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
          <div className="w-64 bg-gray-900 border border-green-500/30 rounded-lg p-6">
            <div className="mb-4 flex justify-center">
              <Lock className="text-green-500" size={60} />
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
              <div
                className="bg-green-500 h-2.5 rounded-full transition-all duration-200"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-green-300">
              {savedPassword ? "Saving Password..." : "Generating Passwords..."}
            </p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md m-auto bg-black/60 backdrop-blur-sm border border-green-500/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-8 text-center">
          <div className="absolute top-4 left-4">
            <Fingerprint className="text-green-500" size={30} />
          </div>
          <div className="absolute top-4 right-4">
            <Code className="text-green-500" size={30} />
          </div>

          <ShieldCheck
            className="mx-auto mb-4 text-green-500 animate-pulse"
            size={80}
            strokeWidth={1.5}
          />

          <h2 className="text-3xl font-bold mb-2 text-green-300">
            Devnagri Passwords
          </h2>
          <p className="text-green-500">Generate & Secure Your Passwords</p>
        </div>

        {/* Password Generation */}
        <div className="px-8 pb-8 space-y-4">
          <button
            onClick={handleSuggestPasswords}
            disabled={isLoading}
            className="w-full bg-green-800/50 border border-green-500/30 text-green-300 py-3 rounded-lg hover:bg-green-900/50 transition-colors duration-300 flex items-center justify-center"
          >
            <Activity className="mr-2" size={20} />
            Generate Secure Passwords
          </button>

          {/* Password List */}
          {passwords.length > 0 && (
            <div className="bg-black/50 border border-green-500/30 rounded-lg">
              {passwords.map((pwd, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-3 border-b border-green-500/20 last:border-b-0 
                    ${selectedPassword === pwd ? "bg-green-500/20" : ""}`}
                >
                  <div className="flex-grow">
                    <p className="text-green-300 text-sm">
                      {pwd} → {convertToDevnagri(pwd)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPassword(pwd)}
                    className="ml-2 text-green-500 hover:text-green-300 transition-colors"
                  >
                    {selectedPassword === pwd ? (
                      <Check size={20} />
                    ) : (
                      <Copy size={20} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Save Password */}
          {selectedPassword && (
            <div className="bg-black/50 border border-green-500/30 p-4 rounded-lg text-center">
              <p className="text-green-300 mb-3">
                Selected Password:{" "}
                <span className="font-bold">{selectedPassword}</span>
              </p>
              <button
                onClick={handleSavePassword}
                disabled={isLoading}
                className="w-full bg-green-800/50 border border-green-500/30 text-green-300 py-3 rounded-lg hover:bg-green-900/50 transition-colors duration-300"
              >
                Save Securely
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] bg-[size:16px_16px]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5 animate-pulse bg-[linear-gradient(0deg,transparent_24%,rgba(0,255,0,0.1)_25%,rgba(0,255,0,0.1)_26%,transparent_27%,transparent_74%,rgba(0,255,0,0.1)_75%,rgba(0,255,0,0.1)_76%,transparent_77%,transparent)]"></div>
      </div>
    </div>
  );
};

export default DevanagriPasswordSuggester;
