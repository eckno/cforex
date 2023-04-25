/**
 * All home services
 */
const BaseService = require("./base");
const { empty, filter_var, isString, isObject, in_array, uniqid, get_ip_address} = require("../lib/utils");


class SecureService extends BaseService {
	constructor() {
		super();
	}

    async fetchUserData(req) {
        try{
            const doc_id = (!empty(req) && !empty(req.session) && !empty(req.session.user.uid)) ? req.session.user.uid : null;
			const user = await this.db.collection('users').doc(doc_id).get();
            if(!user.exists){
                return SecureService.sendFailedResponse({error: 'user_not_found'});
            }
            return SecureService.sendSuccessResponse(user.data());
		}
		catch(e){
			console.log(e.message);
			return SecureService.sendFailedResponse('An error occurred. Please check your request and try again');
		}
    }

}

module.exports = SecureService;