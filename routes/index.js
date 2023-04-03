const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
    console.log("hi");
    //return indexController.loginAction(req, res);
});


module.exports = router;