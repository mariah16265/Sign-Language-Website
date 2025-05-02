const jwt = require('jsonwebtoken'); // we need jwt to check token

// Middleware function
const authenticateUser = (req, res, next) => {
  try {
    //Take the token sent by frontend.
    const authHeader = req.header('Authorization');

    //If token is missing - reject the request.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    //This is the format how the header is sent from frontend: Authorization: Bearer eyJhbGciOiJIU...
    //remove "Bearer ", as we only need the token
    const token = authHeader.replace('Bearer ', '');

    //When the token was originally created (during login), it was signed using the secret key 
    //verify if token is signed correctly, not expired, or fake using your secret key.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //If token valid, decode token and store user info inside req.user.
    req.user = decoded;
    next();     //move to the next step (your controller)
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = {authenticateUser};
