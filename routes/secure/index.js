const express = require('express');
const router = express.Router();
const DashboardController = require("../../controllers/secure");
const {ROUTE_INDEX, ROUTE_PROFILE, ROUTE_PROFILE_EDIT, ROUTE_DEPOSIT, ROUTE_WITHDRAWAL, ROUTE_TRADE} = require('../../lib/secure-routes');
const dashboardController = new DashboardController();

router.get(ROUTE_INDEX, async (req, res) => {
    return dashboardController.indexAction(req, res);
});

router.get(ROUTE_PROFILE, async (req, res) => {
    return dashboardController.profileAction(req, res);
});

router.get(ROUTE_PROFILE_EDIT, async (req, res) => {
    return dashboardController.profile_editAction(req, res);
});

router.get(ROUTE_DEPOSIT, async (req, res) => {
    return dashboardController.depositAction(req, res);
});

router.get(ROUTE_WITHDRAWAL, async (req, res) => {
    return dashboardController.withdrawalAction(req, res);
});

router.get(ROUTE_TRADE, async (req, res) => {
    return dashboardController.tradeAction(req, res);
});

module.exports = router;