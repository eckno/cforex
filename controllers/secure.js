const BaseController = require("./base");
const SecureService = require('../services/secure');
const { empty, isString, isObject, in_array} = require("../lib/utils");

const secureService = new SecureService();

class DashboardController extends BaseController
{
    constructor(){
        super();
    }

    async indexAction(req, res){
        try{
            if(empty(req.session) || empty(req.session.user)){
                    return res.redirect('/account');
                }
            if(req.method === "POST"){
                //
            }else{
                let user = {};
                let firstname = !empty(req.session.user.firstname) ? req.session.user.firstname : "Null"; 
                let lastname = !empty(req.session.user.lastname) ? req.session.user.lastname : "Null";
                const {data, success} = await secureService.fetchUserData(req);
                if (success) {user = data;}
                res.render('secure/index',  this.setTemplateParameters(req, {user, firstname, lastname,}));
            }
        }
        catch(e){
            console.log(e.message);
        }
    }

     async profileAction(req, res){
        res.render('secure/profile');
    }

    async profile_editAction(req, res){
        res.render('secure/edit_profile');
    }

    async depositAction(req, res){
        let firstname = !empty(req.session.user.firstname) ? req.session.user.firstname : "Null"; 
        let lastname = !empty(req.session.user.lastname) ? req.session.user.lastname : "Null";
        res.render('secure/deposit', this.setTemplateParameters(req, {firstname, lastname,}));
    }

    async deposit_typeAction(req, res){
        let firstname = !empty(req.session.user.firstname) ? req.session.user.firstname : "Null"; 
        let lastname = !empty(req.session.user.lastname) ? req.session.user.lastname : "Null";
        res.render('secure/deposit_type', this.setTemplateParameters(req, {firstname, lastname,}));
    }

    async withdrawalAction(req, res){
        res.render('secure/withdrawal');
    }

    async profileAction(req, res){
        res.render('secure/trade');
    }
}


module.exports = DashboardController;