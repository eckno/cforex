const express = require('express');
const router = express.Router();
const DashboardController = require("../../controllers/secure");
const hasUser = require('../../middleware/has_user');
const {ROUTE_INDEX, ROUTE_PROFILE, ROUTE_PROFILE_EDIT, ROUTE_DEPOSIT, ROUTE_WITHDRAWAL, ROUTE_TRADE, ROUTE_DEPOSIT_TYPE} = require('../../lib/secure-routes');
const dashboardController = new DashboardController();

router.get(ROUTE_INDEX, hasUser, async (req, res) => {
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

router.get(ROUTE_DEPOSIT_TYPE, async (req, res) => {
    return dashboardController.deposit_typeAction(req, res);
});

router.get(ROUTE_WITHDRAWAL, async (req, res) => {
    return dashboardController.withdrawalAction(req, res);
});

router.get(ROUTE_TRADE, async (req, res) => {
    return dashboardController.tradeAction(req, res);
});

module.exports = router;