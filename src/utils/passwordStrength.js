import sha1 from 'crypto-js/sha1';

// Instead of loading from file system, we'll use a smaller preset of common leaked passwords
const leakedPasswords = new Set([
    'password', '123456', 'qwerty', 'admin', '12345678', 
    'abc123', '1234567', 'letmein', '111111', 'welcome'
]);

const calculatePasswordStrength = (password) => {
    let score = 0;

    // Length check
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;

    // Character variety check
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 2; // Special characters add more strength

    // Detecting sequential/repeated characters
    if (/1234|abcd|qwerty|password|1111/.test(password.toLowerCase())) score -= 2;

    // Checking for dictionary words
    if (leakedPasswords.has(password)) return { 
        strength: "Very Weak", 
        score: 0, 
        message: "🚨 This password is commonly used!" 
    };

    // Final score mapping
    if (score <= 2) return { 
        strength: "Very Weak", 
        score, 
        message: "❌ Too easy to guess!" 
    };
    if (score <= 4) return { 
        strength: "Weak", 
        score, 
        message: "⚠️ Consider adding more variety!" 
    };
    if (score <= 6) return { 
        strength: "Medium", 
        score, 
        message: "✅ Decent but could be stronger!" 
    };
    return { 
        strength: "Very Strong", 
        score, 
        message: "💪 Excellent password security!" 
    };
};

// Function to check against dark web leaks (BreachDirectory API)
const checkPasswordLeak = async (password) => {
    const hashedPassword = sha1(password).toString().toUpperCase();
    const prefix = hashedPassword.substring(0, 5);
    const suffix = hashedPassword.substring(5);

    try {
        const response = await fetch(`https://breachdirectory.p.rapidapi.com/?password=${prefix}`, {
            method: 'GET',
            headers: {
                "X-RapidAPI-Key": process.env.REACT_APP_BREACH_API_KEY || "e09f7e78f4msh9d67d00362aaac7p1af7c1jsn0e4b6b96422",
                "X-RapidAPI-Host": "breachdirectory.p.rapidapi.com"
            }
        });

        const data = await response.text();

        return data.includes(suffix) 
            ? "⚠️ Password found in leaks!" 
            : "✅ Password is not found in leaks.";
    } catch (error) {
        console.error(error);
        return "⚠️ Error checking password leak database.";
    }
};

// Combine both checks into a single function
const checkPasswordSecurity = async (password) => {
    // Local strength check
    const strengthResult = calculatePasswordStrength(password);
    
    try {
        // Check for leaks
        const leakResult = await checkPasswordLeak(password);
        
        return {
            ...strengthResult,
            leakStatus: leakResult
        };
    } catch (error) {
        return {
            ...strengthResult,
            leakStatus: "⚠️ Unable to check leaks"
        };
    }
};

export { 
    calculatePasswordStrength, 
    checkPasswordLeak,
    checkPasswordSecurity 
};