const express = require('express');
const actions = require('../methods/actions');
const router = express.Router();

router.get('/', (req, res) => {
	res.send('SIH  backend');
});

router.get('/dashboard', (req, res) => {
	res.send('Dashboard');
});

//@desc Adding new user
//@route POST /adduser
router.post('/adduser', actions.addNew);

//@desc Authenticate a user
//@route POST /authenticate
router.post('/authenticate', actions.authenticate);
router.post('/authenticate2', actions.authenticate2);

//@desc Get info on a user
//@route GET /getinfo
router.get('/getinfo', actions.getinfo);

module.exports = router;
