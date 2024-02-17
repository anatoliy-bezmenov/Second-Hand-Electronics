const router = require('express').Router();

// const { isAuth } = require('../middlewares/authMiddleware');
const electronicsService = require('../services/electronicsService');
// const Electronics = require('../models/Electronics');

router.get('/', async (req, res) => {
    res.render('home');
    
});

router.get('/search', async (req, res) => {
    const {name, type} = req.query;
    const electronics = await electronicsService.search(name, type).lean();

    res.render('search', { electronics, name, type });
})


module.exports = router;