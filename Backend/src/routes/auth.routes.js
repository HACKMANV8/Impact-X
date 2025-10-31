const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

//user auth APIs
router.post('/creator/register', authController.registerCreator);
router.post('/creator/login', authController.loginCreator);
router.get('/creator/logout', authController.logoutCreator);


//food partner auth APIs
router.post('/Promoter/register', authController.registerPromoter);
router.post('/Promoter/login', authController.loginPromoter);
router.get('/Promoter/logout', authController.logoutPromoter);
module.exports = router;