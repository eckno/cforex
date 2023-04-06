const IndexController = require("../controllers/index");
const express = require('express');
const router = express.Router();
const {ROUTE_INDEX, ROUTE_ABOUT, ROUTE_CONTACT} = require('../lib/home-routes');
const indexController = new IndexController();


router.get(ROUTE_INDEX, async (req, res) => {
    return indexController.indexAction(req, res);
});

router.get(ROUTE_ABOUT, async (req, res) => {
    return indexController.aboutAction(req, res);
});

router.get(ROUTE_CONTACT, async (req, res) => {
    return indexController.contactAction(req, res);
});


module.exports = router;