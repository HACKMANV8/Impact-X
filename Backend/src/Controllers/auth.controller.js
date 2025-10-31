const creatorModel = require('../models/Creator.model');
const promoterModel = require('../models/Promoter.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ===============================
// CREATOR / BRAND REGISTRATION
// ===============================
async function registerCreator(req, res) {
  try {
    const { fullName, email, password, brandName, websiteOrInstagram, industryOrNiche } = req.body;

    const isCreatorAlreadyExists = await creatorModel.findOne({ email });
    if (isCreatorAlreadyExists) {
      return res.status(400).json({ message: 'Creator already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const creator = await creatorModel.create({
      fullName,
      email,
      password: hashedPassword,
      brandName,
      websiteOrInstagram,
      industryOrNiche,
    });

    const token = jwt.sign({ id: creator._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });

    return res.status(201).json({
      message: 'Creator registered successfully',
      creator: {
        id: creator._id,
        fullName: creator.fullName,
        email: creator.email,
        brandName: creator.brandName,
      }
    });

  } catch (error) {
    console.error("❌ Creator Register Error:", error);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ===============================
// CREATOR / BRAND LOGIN
// ===============================
async function loginCreator(req, res) {
  try {
    const { email, password } = req.body;

    const creator = await creatorModel.findOne({ email });
    if (!creator) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, creator.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: creator._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({
      message: 'Login successful',
      creator: {
        id: creator._id,
        fullName: creator.fullName,
        email: creator.email,
        brandName: creator.brandName,
      }
    });

  } catch (error) {
    console.error("❌ Creator Login Error:", error);
    return res.status(500).json({ message: 'Server error' });
  }
}

function logoutCreator(req, res) {
  res.clearCookie("token");
  return res.status(200).json({ message: 'Logout successful' });
}

// ===============================
// PROMOTER REGISTRATION
// ===============================
async function registerPromoter(req, res) {
  try {
    const {
      fullName,
      email,
      password,
      instagramHandle,
      portfolioUrl,
      followerCount,
      averageViews,
      totalInteractions,
      newFollowersGained,
      accountsReached,
      niche
    } = req.body;

    const isPromoterAlreadyExists = await promoterModel.findOne({ email });
    if (isPromoterAlreadyExists) {
      return res.status(400).json({ message: 'Promoter already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const promoter = await promoterModel.create({
      fullName,
      email,
      password: hashedPassword,
      instagramHandle,
      portfolioUrl,
      followerCount,
      averageViews,
      totalInteractions,
      newFollowersGained,
      accountsReached,
      niche,
    });

    const token = jwt.sign({ id: promoter._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });

    return res.status(201).json({
      message: 'Promoter registered successfully',
      promoter: {
        id: promoter._id,
        fullName: promoter.fullName,
        email: promoter.email,
        instagramHandle: promoter.instagramHandle,
      }
    });

  } catch (error) {
    console.error("❌ Promoter Register Error:", error);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ===============================
// PROMOTER LOGIN
// ===============================
async function loginPromoter(req, res) {
  try {
    const { email, password } = req.body;

    const promoter = await promoterModel.findOne({ email });
    if (!promoter) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, promoter.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: promoter._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({
      message: 'Login successful',
      promoter: {
        id: promoter._id,
        fullName: promoter.fullName,
        email: promoter.email,
        instagramHandle: promoter.instagramHandle,
      }
    });

  } catch (error) {
    console.error("❌ Promoter Login Error:", error);
    return res.status(500).json({ message: 'Server error' });
  }
}

function logoutPromoter(req, res) {
  res.clearCookie("token");
  return res.status(200).json({ message: 'Logout successful' });
}

module.exports = {
  registerCreator,
  loginCreator,
  logoutCreator,
  registerPromoter,
  loginPromoter,
  logoutPromoter
};
