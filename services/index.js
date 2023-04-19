/**
 * All home services
 */
const BaseService = require("./base");
const { empty, filter_var, isString, isObject, in_array, uniqid, get_ip_address} = require("../lib/utils");
const { ROUTE_INDEX, ROUTE_LOGIN } = require("../lib/home-routes");


class IndexService extends BaseService {
	constructor() {
		super();
	}

    async registrationService(req) {
        try{
			let errors = {}, response = {};
			if(!empty(req) && !empty(req.body)){
				const post = IndexService.sanitizeRequestData(req.body);
				const required_fields = ['firstname', 'lastname', 'email', 'password', 'confirm_password'];

				errors = this.validateFields(post, required_fields, [], [], [], [],[]);
				if(!empty(errors)){
					return IndexService.sendFailedResponse(errors);
				}
				let user_response = await this.db.collection('users').where('email', '==', post['email']).get();
				if(!user_response.empty){
					errors['user'] = "You already have an existing account. Please login to continue";
					errors['redirect_url'] = '/account';
				}
				if(!empty(errors)){
					return IndexService.sendFailedResponse(errors);
				}

				post['unique_id'] = uniqid();
				post['ipaddress'] = get_ip_address(req);
				const create_user = await this.db.collection('users').doc(post['unique_id']).set(post);
				//console.log("user: ", );
				if(!empty(create_user._writeTime)){
					 response['msg'] = "Your account has been setup successfully. Please login to proceed.";
					 response['redirect_url'] = '/account';
					 //
					 return IndexService.sendSuccessResponse(response);
				}
			}
			else{
				return IndexService.sendFailedResponse('An error occurred. Please check your request and try again');
			}
		}
		catch(e){
			console.log(e.message);
			return IndexService.sendFailedResponse('An error occurred. Please check your request and try again');
		}
    }

	async loginService(req) {}

}

module.exports = IndexService;