const BaseController = require("./base");


class IndexController extends BaseController{
    constructor(props){
        super(props);
    }


    async indexAction(req, res){
        res.render('index');
    }
}

module.exports = IndexController;