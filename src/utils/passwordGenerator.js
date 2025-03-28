const devnagriChars = "अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह";
const latinChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+[]{}<>?";

const getRandomChar = (set) => set[Math.floor(Math.random() * set.length)];

export const generateDevnagriPassword = (options = {}) => {
    const {
        numbers: useNumbers = true,
        letters: useLetters = true,
        specialChars: useSpecialChars = true,
        devnagri: useDevnagri = true,
        length = 12
    } = options;

    // Validate that at least one character set is selected
    if (!useNumbers && !useLetters && !useSpecialChars && !useDevnagri) {
        throw new Error("At least one character type must be selected");
    }

    let password = "";
    const requiredSets = [];
    const allChars = [];

    // Build character sets based on options
    if (useDevnagri) {
        requiredSets.push(devnagriChars);
        allChars.push(...devnagriChars);
    }
    if (useLetters) {
        requiredSets.push(latinChars);
        allChars.push(...latinChars);
    }
    if (useNumbers) {
        requiredSets.push(numbers);
        allChars.push(...numbers);
    }
    if (useSpecialChars) {
        requiredSets.push(symbols);
        allChars.push(...symbols);
    }

    // Ensure at least one character from each selected set
    requiredSets.forEach(set => {
        password += getRandomChar(set);
    });

    // Fill the rest with a mix of all selected sets
    const remainingLength = length - password.length;
    for (let i = 0; i < remainingLength; i++) {
        password += getRandomChar(allChars);
    }

    // Shuffle the password to prevent predictable patterns
    return password.split("").sort(() => Math.random() - 0.5).join("");
};