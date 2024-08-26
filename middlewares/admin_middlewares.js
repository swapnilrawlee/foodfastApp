const jwt = require('jsonwebtoken');
require('dotenv').config();

async function validateAdmin(req, res, next) {
  try {
    // Retrieve the token from cookies
    let token = req.cookies.token;

    // If no token is provided, return an error
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify the token
    let data = jwt.verify(token, process.env.JWT_KEY);

    // Attach user data to the request object
    req.user = data;

    // Check if user role is admin
    if (req.user.role === 'Admin') {
      next(); // Proceed if user role is Admin
    } else {
      res.status(403).json({ error: 'Access denied. You are not an admin.' });
    }
  } catch (error) {
    console.log('Error:', error.message);
    res.status(401).json({ error: 'Invalid token.' });
  }
}

async function userIsLoggedIn(req,res,next){
  if(req.isAuthenticated())
    return next()
}

module.exports = {validateAdmin,userIsLoggedIn};
