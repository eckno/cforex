const IndexController = require("../controllers/index");
const express = require('express');
const router = express.Router();

const indexController = new IndexController();


router.get("/", async (req, res) => {
    return indexController.indexAction(req, res);
});


module.exports = router;