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
                const {data, success} = await secureService.accountUpdate(req);
                if(!success){
                    return DashboardController.sendFailResponse(res, data);
                }
                return DashboardController.sendSuccessResponse(res, data);
            }else{
                let user = {}, histories = null, trade = null;

                let firstname = !empty(req.session.user.firstname) ? req.session.user.firstname : "Null"; 
                let lastname = !empty(req.session.user.lastname) ? req.session.user.lastname : "Null";

                const {data, success} = await secureService.fetchUserData(req);
                if (success) {user = data;}

                if(!empty(user)){
                    const {data, success} = await secureService.get_histories(req);
                    if (success) histories = data ;
                }
                if(!empty(user) && !empty(histories)){
                    const {data, success} = await secureService.getTrade(req);
                    if (success) trade = data ;
                }
                
                res.render('secure/index',  this.setTemplateParameters(req, 
                        {
                         user, 
                         firstname, 
                         lastname,
                         histories,
                         trade
                        }
                    ));
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
        try{
            if(req.method === "POST"){
                const {data, success} = await secureService.processDeposit(req);
                if(!success){
                    return DashboardController.sendFailResponse(res, data);
                }
                return DashboardController.sendSuccessResponse(res, data);
            }

            let firstname = !empty(req.session.user.firstname) ? req.session.user.firstname : "Null"; 
            let lastname = !empty(req.session.user.lastname) ? req.session.user.lastname : "Null";
            res.render('secure/deposit', this.setTemplateParameters(req, 
                {
                 firstname, 
                 lastname,
                }
                ));
        }
        catch (e) {
            console.log(e.message);
            return DashboardController.sendFailResponse(res, {errors: 'Invalid Server Request'});
        }
    }

    async tradeAction(req, res){
        try{
            if(req.method === "POST"){
                const {data, success} = await secureService.submitTrade(req);
                if(!success){
                    return DashboardController.sendFailResponse(res, data);
                }
                return DashboardController.sendSuccessResponse(res, data);
            }

            const {data, success} = await secureService.get_traders();
            if(!success){
                return res.redirect('/secure');
            }

            let firstname = !empty(req.session.user.firstname) ? req.session.user.firstname : "Null"; 
            let lastname = !empty(req.session.user.lastname) ? req.session.user.lastname : "Null";
            res.render('secure/trader', this.setTemplateParameters(req, 
                {
                 firstname, 
                 lastname,
                 traders: data
                }
                ));
        }
        catch (e) {
            console.log(e.message);
            return DashboardController.sendFailResponse(res, {errors: 'Invalid Server Request'});
        }
    }

    async deposit_typeAction(req, res){
        try{
            if(req.method === "POST"){
                //
                 const {data, success} = await secureService.submitDeposit(req);
                if(!success){
                    return DashboardController.sendFailResponse(res, data);
                }
                return DashboardController.sendSuccessResponse(res, data);
            }
            let amount;
            if(empty(req.query) || empty(req.query.amount)){
                return res.redirect('/secure/deposit');
            }
            else{
                amount = req.query.amount;
            }
            let firstname = !empty(req.session.user.firstname) ? req.session.user.firstname : "Null"; 
            let lastname = !empty(req.session.user.lastname) ? req.session.user.lastname : "Null";
            res.render('secure/deposit_type', this.setTemplateParameters(req, {firstname, lastname, amount}));
        }
        catch (e) {
            console.log(e.message);
            return DashboardController.sendFailResponse(res, {errors: 'Invalid Server Request'});
        }
    }

    async p2pAction(req, res){
        try{
            if(!(empty(req.query) && empty(req.query.token))){
                const token = req.query.token;
                const {success} = await secureService.confirmDeposit(token);
                if(!success){
                    return res.redirect('/secure/deposit_type');
                }
            }
            else{
                return res.redirect('/secure/deposit_type');
            }

            const {data, success} = await secureService.get_p2ps();
            if(!success){
                return res.redirect('/secure/deposit_type');
            }
           
            let firstname = !empty(req.session.user.firstname) ? req.session.user.firstname : "Null"; 
            let lastname = !empty(req.session.user.lastname) ? req.session.user.lastname : "Null";
            res.render('secure/p2ps', this.setTemplateParameters(req, 
                {
                    firstname, 
                    lastname,
                    peers: data
                }));
        }
        catch (e) {
            console.log(e.message);
            return DashboardController.sendFailResponse(res, {errors: 'Invalid Server Request'});
        }
    }

    async cryptoAction(req, res){
        try{
            if(!(empty(req.query) && empty(req.query.token))){
                const token = req.query.token;
                const {success} = await secureService.confirmDeposit(token);
                if(!success){
                    return res.redirect('/secure/deposit_type');
                }
            }
            else{
                return res.redirect('/secure/deposit_type');
            }

            const {data, success} = await secureService.get_crypto();
            if(!success){
                return res.redirect('/secure/deposit_type');
            }
           
            let firstname = !empty(req.session.user.firstname) ? req.session.user.firstname : "Null"; 
            let lastname = !empty(req.session.user.lastname) ? req.session.user.lastname : "Null";
            res.render('secure/crypto', this.setTemplateParameters(req, 
                {
                    firstname, 
                    lastname,
                    peers: data
                }));
        }
        catch (e) {
            console.log(e.message);
            return DashboardController.sendFailResponse(res, {errors: 'Invalid Server Request'});
        }
    }

    async withdrawalAction(req, res){
        res.render('secure/withdrawal');
    }

    async profileAction(req, res){
        res.render('secure/trade');
    }
}


module.exports = DashboardController;