const BaseController = require("./base");


class IndexController extends BaseController{
    constructor(props){
        super(props);
    }


    async indexAction(req, res){
        res.render('index');
    }

    async loginAction(req, res){
        res.render('login');
    }

    async registerAction(req, res){
        res.render('register');
    }

    async resetAction(req, res){
        res.render('reset');
    }

    async contactAction(req, res){
        res.render('pages/contact');
    }

    async aboutAction(req, res){
        res.render('pages/about');
    }
}

module.exports = IndexController;