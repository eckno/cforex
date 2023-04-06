const express = require('express');
const router = express.Router();
const IndexController = require("../../controllers");
const {ROUTE_FORGOT_PASSWORD, ROUTE_LOGIN, ROUTE_REGISTRATION} = require('../../lib/home-routes');
const indexController = new IndexController();

router.get(ROUTE_LOGIN, async (req, res) => {
    return indexController.loginAction(req, res);
});

router.get(ROUTE_REGISTRATION, async (req, res) => {
    return indexController.registerAction(req, res);
});

router.get(ROUTE_FORGOT_PASSWORD, async (req, res) => {
    return indexController.resetAction(req, res);
});


module.exports = router;