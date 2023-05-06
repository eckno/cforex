const express = require('express');
const router = express.Router();
const DashboardController = require("../../controllers/secure");
const hasUser = require('../../middleware/has_user');
const {ROUTE_INDEX, ROUTE_PROFILE, ROUTE_PROFILE_EDIT, ROUTE_DEPOSIT, ROUTE_WITHDRAWAL, ROUTE_TRADE, ROUTE_DEPOSIT_TYPE, ROUTE_P2PS, ROUTE_CRYPTO} = require('../../lib/secure-routes');
const dashboardController = new DashboardController();

router.get(ROUTE_INDEX, hasUser, async (req, res) => {
    return dashboardController.indexAction(req, res);
});

router.get(ROUTE_PROFILE, hasUser, async (req, res) => {
    return dashboardController.profileAction(req, res);
});

router.get(ROUTE_PROFILE_EDIT, hasUser, async (req, res) => {
    return dashboardController.profile_editAction(req, res);
});

router.get(ROUTE_DEPOSIT, hasUser, async (req, res) => {
    return dashboardController.depositAction(req, res);
});
router.post(ROUTE_DEPOSIT, hasUser, async (req, res) => {
    return dashboardController.depositAction(req, res);
});
router.get(ROUTE_DEPOSIT_TYPE, hasUser, async (req, res) => {
    return dashboardController.deposit_typeAction(req, res);
});
router.post(ROUTE_DEPOSIT_TYPE, hasUser, async (req, res) => {
    return dashboardController.deposit_typeAction(req, res);
});
router.get(ROUTE_P2PS, hasUser, async (req, res) => {
    return dashboardController.p2pAction(req, res);
});
router.get(ROUTE_CRYPTO, hasUser, async (req, res) => {
    return dashboardController.cryptoAction(req, res);
});

router.get(ROUTE_WITHDRAWAL, hasUser, async (req, res) => {
    return dashboardController.withdrawalAction(req, res);
});

router.get(ROUTE_TRADE, hasUser, async (req, res) => {
    return dashboardController.tradeAction(req, res);
});

module.exports = router;