const express = require('express');
const router = express.Router();

const IndexController = require("../../controllers");
const indexController = new IndexController();

router.get("/", async (req, res) => {
    return indexController.loginAction(req, res);
});

router.get("/register", async (req, res) => {
    return indexController.registerAction(req, res);
});

router.get("/reset", async (req, res) => {
    return indexController.resetAction(req, res);
});


module.exports = router;