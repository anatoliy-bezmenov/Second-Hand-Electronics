const router = require('express').Router();

const electronicsService = require('../services/electronicsService');
const { getErrorMessage } = require('../utils/errorUtils');
const { isAuth } = require('../middlewares/authMiddleware');

// Access Catalog with electronics
router.get('/', async (req, res) => {
    const electronics = await electronicsService.getAll().lean();
    res.render('electronics/catalog', { electronics })
});

// Create electronics
router.get('/create', isAuth, (req, res) => {
    res.render('electronics/create');
});

router.post('/create', isAuth, async (req, res) => {
    const electronicsData = req.body;
    // console.log(electronicsData);
    try {
        await electronicsService.create(req.user._id, electronicsData);
        res.redirect('/electronics');
    } catch(err) {
        res.render('electronics/create', { ...electronicsData, error: getErrorMessage(err) })
    }
});

// Electronics Details
router.get('/:electronicsId/details', async (req, res) => {
    const electronics = await electronicsService.getOneDetailed(req.params.electronicsId).lean();

    // const boughtUsers = electronics.buyingList.map(user => user.username).join(', ');
    const isOwner = electronics.owner && electronics.owner._id == req.user?._id; // use double "=". not triple
    const isBought = electronics.buyingList.some(user => user._id == req.user?._id);

    res.render('electronics/details', { ...electronics, isOwner, isBought });
});

// Electronics Buy
router.get('/:electronicsId/buy', async (req, res) => {
        await electronicsService.buy(req.params.electronicsId, req.user._id);
        res.redirect(`/electronics/${req.params.electronicsId}/details`);
});

// Electronics Edit
router.get('/:electronicsId/edit', isElectronicsOwner, async (req, res) => {
    const electronics = await electronicsService.getOne(req.params.electronicsId).lean();
    res.render('electronics/edit', { ...electronics })
});

router.post('/:electronicsId/edit', isElectronicsOwner, async (req, res) => {
    const electronicsData = req.body;

    try {
        await electronicsService.edit(req.params.electronicsId, electronicsData);
        res.redirect(`/electronics/${req.params.electronicsId}/details`);
    } catch(err) {
        res.render('electronics/edit', {... electronicsData, error: getErrorMessage(err) });
    };
});

// Electronics Delete
router.get('/:electronicsId/delete', isElectronicsOwner, async (req, res) => {
    await electronicsService.delete(req.params.electronicsId);
    res.redirect('/electronics');
})


// Function that checks if current user is owner of the currently viewed electronics
async function isElectronicsOwner(req, res, next) {
    const electronics = await electronicsService.getOne(req.params.electronicsId).lean();

    if (electronics.owner != req.user?._id) {
        return res.redirect(`/electronics/${req.params.electronicsId}/details`);
    };
    next();
};

module.exports = router;