const creatorModel = require('../models/Creator.model');
const promoterModel = require('../models/Promoter.model');
const jwt = require('jsonwebtoken');

// ===============================
// PROMOTER AUTH MIDDLEWARE
// ===============================
async function authPromoterMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const promoter = await promoterModel.findById(decoded.id).select('-password');

    if (!promoter) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.promoter = promoter; // attach promoter to request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

// ===============================
// CREATOR / BRAND AUTH MIDDLEWARE
// ===============================
async function authCreatorMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const creator = await creatorModel.findById(decoded.id).select('-password');

    if (!creator) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.creator = creator; // attach creator to request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = { authPromoterMiddleware, authCreatorMiddleware };
