const BaseController = require("./base");
const IndexService = require('../services');
const { empty, isObject, isString, uniqid } = require('../lib/utils');

const indexService = new IndexService();


class IndexController extends BaseController{
    constructor(props){
        super(props);
    }


    async indexAction(req, res){
        res.render('index');
    }

    async loginAction(req, res){
        try{
            if(req.method === "POST"){
                const {data, success} = await indexService.loginService(req);
                    if(empty(success) || success === false){
                        return  IndexController.sendFailResponse(res, !empty(data) ? data : {errors: 'An error occurred processing your request. Please check your request and try again'});
                    }
                return IndexController.sendSuccessResponse(res, data);
            }
            else{
                res.render('login');
            }
        }
        catch(e){
            console.log("cl: ", e.message);
            IndexController.sendFailResponse(res, {errors: 'Invalid Server Request'});
        }
    }

    async registerAction(req, res){
            try{
                if(req.method === "POST"){
                    const {data, success} = await indexService.registrationService(req);
                   
                    if(empty(success) || success === false){
                        return  IndexController.sendFailResponse(res, !empty(data) ? data : {errors: 'An error occurred processing your request. Please check your request and try again'})
                    }
                    return IndexController.sendSuccessResponse(res, data);
                }
                else{
                    res.render('register');
                }
            }
            catch(e){
                console.log(e.message);
                IndexController.sendFailResponse(res, {errors: 'Invalid Server Request'});
            }
    }

    async resetAction(req, res){
        try{
                if(req.method === "POST"){
                    req.body.reset_password = (!empty(req) && !empty(req.body)) ? true : "";
                    const {data, success} = await indexService.loginService(req);
                   
                    if(empty(success) || success === false){
                        return  IndexController.sendFailResponse(res, !empty(data) ? data : {errors: 'An error occurred processing your request. Please check your request and try again'})
                    }
                    return IndexController.sendSuccessResponse(res, data);
                }
                else{
                    res.render('reset');
                }
            }
            catch(e){
                console.log(e.message);
                IndexController.sendFailResponse(res, {errors: 'Invalid Server Request'});
            }
    }

    async contactAction(req, res){
        res.render('pages/contact');
    }

    async aboutAction(req, res){
        res.render('pages/about');
    }
}

module.exports = IndexController;