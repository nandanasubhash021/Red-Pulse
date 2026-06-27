const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Extract the token from the incoming Authorization header
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token found, authorization denied.' });
  }

  // Handle both raw tokens or "Bearer <token>" formats smoothly
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  try {
    // 2. Verify token authenticity against secret configuration keys
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    /* 3. FORCE ASSIGNMENT DUPLICATION:
       This ensures that no matter how your login route structured the token payload 
       (nested under .user, .id, or flat), we map it cleanly to req.user for the controller.
    */
    if (decoded.user) {
      req.user = decoded.user;
    } else {
      req.user = decoded; // Fallback if payload was signed flat
    }

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.status(401).json({ msg: 'Token validation signatures expired or invalid.' });
  }
};