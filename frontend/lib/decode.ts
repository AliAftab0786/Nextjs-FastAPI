const jwt = require('jsonwebtoken');

export function decodeJWT(token: string) {
  try {
    // Decode without verification
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded) {
      throw new Error('Invalid token');
    }

    return {
      header: decoded.header,
      payload: decoded.payload,
      signature: decoded.signature
    };
  } catch (error: any) {
    throw new Error(`Failed to decode token: ${error.message}`);
  }
}