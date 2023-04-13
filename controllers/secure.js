const BaseController = require("./base");

class DashboardController extends BaseController
{
    constructor(){
        super();
    }

    async indexAction(req, res){
        res.render('secure/index');
    }

     async profileAction(req, res){
        res.render('secure/profile');
    }

    async profile_editAction(req, res){
        res.render('secure/edit_profile');
    }

    async depositAction(req, res){
        res.render('secure/deposit');
    }

    async withdrawalAction(req, res){
        res.render('secure/withdrawal');
    }

    async profileAction(req, res){
        res.render('secure/trade');
    }
}


module.exports = DashboardController;