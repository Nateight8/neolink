import jwt from "jsonwebtoken";
import User from "./../models/User.js";

export async function authMiddleware(req, res, next) {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.jwt;
    
    // If no token in cookies, check Authorization header
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
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
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token verification failed' 
      });
    }

    if (!decoded?.id) {
      console.log('Invalid token payload:', decoded);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, invalid token' 
      });
    }

    // Find user by ID
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('User not found for ID:', decoded.id);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, user not found' 
      });
    }

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
