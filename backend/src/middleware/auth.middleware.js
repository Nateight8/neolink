import jwt from "jsonwebtoken";
import User from "./../models/User.js";

export async function authMiddleware(req, res, next) {
  try {
    console.log('=== Auth Middleware ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Request method:', req.method);
    console.log('Cookies:', req.cookies);
    console.log('Headers:', {
      authorization: req.headers.authorization ? 'present' : 'missing',
      cookie: req.headers.cookie ? 'present' : 'missing',
      origin: req.headers.origin,
      referer: req.headers.referer
    });

    // Get token from cookie or Authorization header
    let token = req.cookies?.jwt;
    
    // If no token in cookies, check Authorization header
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Using token from Authorization header');
    } else if (token) {
      console.log('Using token from cookie');
    }

    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, no token provided' 
      });
    }

    // Verify token
    let decoded;
    try {
      console.log('Verifying token...');
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified successfully');
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token verification failed',
        error: error.message
      });
    }

    if (!decoded?.id) {
      console.log('Invalid token payload:', decoded);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, invalid token' 
      });
    }

    console.log('Looking up user with ID:', decoded.id);
    // Find user by ID
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('User not found for ID:', decoded.id);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, user not found' 
      });
    }
    
    console.log('User found:', { id: user._id, email: user.email });

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
