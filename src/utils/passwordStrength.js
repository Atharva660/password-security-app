// src/utils/passwordStrength.js
import sha1 from 'crypto-js/sha1';

let leakedPasswordsSet = new Set();

// Load leaked passwords from file
export const loadLeakedPasswords = async () => {
  try {
    const response = await fetch('/leaked-passwords.txt');
    const text = await response.text();
    leakedPasswordsSet = new Set(
      text.split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0)
    );
    console.log(`Loaded ${leakedPasswordsSet.size} leaked passwords`);
  } catch (error) {
    console.error('Failed to load leaked passwords:', error);
    // Fallback to essential passwords
    leakedPasswordsSet = new Set([
      'password', '123456', '123456789', '12345', 
      '12345678', 'qwerty', 'abc123', 'password1',
      'admin', 'letmein', 'welcome', 'monkey'
    ]);
  }
};

// Check password against BreachDirectory API
export const checkPasswordLeak = async (password) => {
  if (!password || password.length < 8) {
    return {
      isCompromised: false,
      message: "Password too short for breach check",
      details: null
    };
  }

  // First check against our local leaked passwords
  if (leakedPasswordsSet.has(password)) {
    return {
      isCompromised: true,
      message: "⚠️ Found in local leaked passwords database!",
      details: null
    };
  }

  // Then check against breach API if not found locally
  const hashedPassword = sha1(password).toString().toUpperCase();
  const prefix = hashedPassword.substring(0, 5);
  const suffix = hashedPassword.substring(5);

  try {
    const response = await fetch(`https://breachdirectory.p.rapidapi.com/?hash=${prefix}`, {
      method: 'GET',
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_BREACH_API_KEY || "your-default-api-key",
        "X-RapidAPI-Host": "breachdirectory.p.rapidapi.com"
      }
    });

    const data = await response.json();
    
    if (data.result) {
      const found = data.result.some(entry => 
        entry.sha1 && entry.sha1.toUpperCase().includes(suffix)
      );
      return {
        isCompromised: found,
        message: found ? "⚠️ Found in online breach database!" : "✅ Not found in breaches",
        details: found ? data.result.find(e => e.sha1.includes(suffix)) : null
      };
    }
    return {
      isCompromised: false,
      message: "✅ No breach data found",
      details: null
    };
  } catch (error) {
    console.error("Breach check error:", error);
    return {
      isCompromised: false,
      message: "⚠️ Error checking breach database",
      details: null
    };
  }
};

// Main password strength calculator
export const calculatePasswordStrength = (password) => {
  if (!password) return null;

  let score = 0;
  const warnings = [];
  let isCompromised = false;

  // 1. Basic checks
  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;
  else warnings.push("Password should be at least 8 characters");

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (hasUpper) score += 1;
  if (hasLower) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecial) score += 2;

  if (!hasUpper) warnings.push("Add uppercase letters");
  if (!hasLower) warnings.push("Add lowercase letters");
  if (!hasNumber) warnings.push("Add numbers");
  if (!hasSpecial) warnings.push("Add special characters");

  // 2. Pattern checks
  const commonPatterns = [
    '1234', 'abcd', 'qwerty', 'password', 
    '1111', 'admin', 'welcome', 'letmein'
  ];
  
  if (commonPatterns.some(p => password.toLowerCase().includes(p))) {
    score -= 2;
    warnings.push("Avoid common patterns");
  }

  // 3. Check against local leaked passwords
  if (leakedPasswordsSet.has(password)) {
    isCompromised = true;
    warnings.push("DO NOT USE - Found in leaked passwords database");
  }

  // Determine final strength
  let strength, message;
  if (isCompromised) {
    strength = "Compromised";
    message = "🚨 This password appears in breaches!";
    score = 0;
  } else if (score <= 2) {
    strength = "Very Weak";
    message = "❌ Extremely vulnerable";
  } else if (score <= 4) {
    strength = "Weak";
    message = "⚠️ Easy to crack";
  } else if (score <= 6) {
    strength = "Medium"; 
    message = "🟡 Could be stronger";
  } else if (score <= 8) {
    strength = "Strong";
    message = "✅ Good password";
  } else {
    strength = "Very Strong";
    message = "🔒 Excellent security";
  }

  return {
    strength,
    score,
    message,
    warnings,
    isCompromised,
    details: {
      length: password.length,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial
    }
  };
};