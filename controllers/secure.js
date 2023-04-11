const BaseController = require("./base");

class DashboardController extends BaseController
{
    constructor(){
        super();
    }

    async indexAction(req, res){
        res.render('secure/index');
    }
}


module.exports = DashboardController;