const devnagriChars = "अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह";
const latinChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+[]{}<>?";

const getRandomChar = (set) => set[Math.floor(Math.random() * set.length)];

export const generateDevnagriPassword = () => {
    let password = "";
    
    // Ensure at least one character from each set
    password += getRandomChar(devnagriChars);
    password += getRandomChar(latinChars);
    password += getRandomChar(numbers);
    password += getRandomChar(symbols);
    
    // Fill the rest with a mix of all sets
    const allChars = devnagriChars + latinChars + numbers + symbols;
    for (let i = 0; i < 12; i++) {
        password += getRandomChar(allChars);
    }
    
    // Shuffle the password to prevent predictable patterns
    return password.split("").sort(() => Math.random() - 0.5).join("");
};
