const router = require('express').Router();

const authService = require('../services/authService');
const { getErrorMessage } = require('../utils/errorUtils');
const { isAuth, isGuest } = require('../middlewares/authMiddleware');

// REGISTER
router.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

router.post('/register', isGuest, async (req, res) => {
    const userData = req.body;

    try {
        const token = await authService.register(userData);
        
        res.cookie('auth', token);
        res.redirect('/');
    } catch(err) {
        res.render('auth/register', {...userData, error: getErrorMessage(err)});
    }
});

// LOGIN
router.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isGuest, async (req, res) => {
    // const loginData = req.body
    const { email, password } = req.body;

    try {
        const token = await authService.login(email, password); // can also put loginData in login()
    
        res.cookie('auth', token);
        res.redirect('/');

    } catch(err) {
        res.render('auth/login', {email, password, error: getErrorMessage(err)}); // ...loginData -> instead
        // of email, password, 
    };

});

// LOGOUT
router.get('/logout', isAuth, (req, res) => {
    res.clearCookie('auth');
    res.redirect('/');
});

module.exports = router;