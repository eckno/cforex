const express = require('express');
const router = express.Router();
const DashboardController = require("../../controllers/secure");
const {ROUTE_INDEX} = require('../../lib/secure-routes');
const dashboardController = new DashboardController();

router.get(ROUTE_INDEX, async (req, res) => {
    return dashboardController.indexAction(req, res);
});

module.exports = router;