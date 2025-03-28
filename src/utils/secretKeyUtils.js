// src/utils/secretKeyUtils.js
export function getSecretKeyBuffer() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    console.log('Loaded secret key:', process.env.REACT_APP_SECRET_KEY);

    if (!secretKey) {
      console.error('SECRET_KEY is not set in environment variables');
      return null;
    }
  
    try {
      // Ensure the key is a valid hex string
      if (!/^[0-9A-Fa-f]+$/.test(secretKey)) {
        console.error('Invalid hex format for SECRET_KEY');
        return null;
      }
  
      return Buffer.from(secretKey, 'hex');
    } catch (error) {
      console.error('Error converting SECRET_KEY to Buffer:', error);
      return null;
    }
  }
  
  // Validate and create buffer once
  export const SECRET_KEY_BUFFER = getSecretKeyBuffer();
  