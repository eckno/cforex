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

	async processDeposit(req){
		try{
			if(!empty(req) && !empty(req.body)){
				const post = BaseService.sanitizeRequestData(req.body);
				
				if(!empty(post)){
					let errors = {}, response = {};
					const required_fields = ['amount'];
					const number_fields = [''];
					errors = this.validateFields(post, required_fields, [], [],number_fields, [], []);
					if(!empty(errors)){
						return BaseService.sendFailedResponse(errors);
					}
					const redirect_url = `/secure/deposit_type?amount=${post['amount']}`;
					response['redirect_url'] = redirect_url;
					response['msg'] = "Kindly proceed on deposit methods & procedures";
					//
					return BaseService.sendSuccessResponse(response);
				}
				else{
					return BaseService.sendFailedResponse('Error! Invalid Request');
				}
			}
		}
		catch (e) {
			console.log(e.message);
			return SecureService.sendFailedResponse('An error occurred. Please check your request and try again');
		}
	}

	async submitDeposit(req){
		try{
			if(!empty(req) && !empty(req.body)){
				const post = BaseService.sanitizeRequestData(req.body);
				
				if(!empty(post)){
					let errors = {}, response = {}, data = {};

					data['method'] = post['method'];
					data['amount'] = post['amount'];
					data['id'] = uniqid();
					data['type'] = "Deposit";
					data['status'] = "Pending";
					data['uid'] = req.session.user.uid;

					const deps = await this.db.collection('transactions').doc(data['id']).set(data);
					if(!empty(deps._writeTime)){

						let stat = {};
						const date = new Date();
						stat['type'] = 'Deposit';
						stat['amount'] = post['amount'];
						stat['id'] = data['id'];
						stat['status'] = data['status'];
						stat['_id'] = uniqid();
						stat['uid'] = data['uid'];
						stat['date'] = `${date.getDate()} / ${date.getMonth()} / ${date.getFullYear()}`;

						this.db.collection('history').doc(stat['_id']).set(stat);

						let redirect_url;
						if(data['method'] === "peer"){
							redirect_url = `/secure/p2ps?token=${data['id']}`;
						}
						else if(data['method'] === "crypto"){
							redirect_url = `/secure/crypto?token=${data['id']}`;
						}

						response['redirect_url'] = redirect_url;
						response['msg'] = "Your deposit has been submited. Kindly complete your deposit from the next page.";
						//
						return BaseService.sendSuccessResponse(response);
					}
					else{
						return BaseService.sendFailedResponse('Oops!! We had problem submiting your deposit. Try again');
					}
				}
				else{
					return BaseService.sendFailedResponse('Oops! Something went wrong, please try again');
				}
			}
			else{
					return BaseService.sendFailedResponse('Error! Invalid Request');
				}
		}
		catch (e) {
			console.log(e.message);
			return SecureService.sendFailedResponse('An error occurred. Please check your request and try again');
		}
	}

	async get_p2ps(){
		try{
			let errors = {};
			const p2ps = await this.db.collection("p2ps").get();
			if(p2ps._size > 0){
				return BaseService.sendSuccessResponse(p2ps);
			}
			else{
				return BaseService.sendFailedResponse("Unfortunately no record was found")
			}
		}
		catch (e) {
			console.log(e.message);
			return SecureService.sendFailedResponse('An error occurred. Please check your request and try again');
		}
	}

	async get_crypto(){
		try{
			let errors = {};
			const wallets = await this.db.collection("wallets").get();
			if(wallets._size > 0){
				return BaseService.sendSuccessResponse(wallets);
			}
			else{
				return BaseService.sendFailedResponse("Unfortunately no record was found")
			}
		}
		catch (e) {
			console.log(e.message);
			return SecureService.sendFailedResponse('An error occurred. Please check your request and try again');
		}
	}

	async get_traders(){
		try{
			const traders = await this.db.collection("traders").get();
			if(traders._size > 0){
				return BaseService.sendSuccessResponse(traders);
			}
			else{
				return BaseService.sendFailedResponse("Unfortunately no record was found")
			}
		}
		catch (e) {
			console.log(e.message);
			return SecureService.sendFailedResponse('An error occurred. Please check your request and try again');
		}
	}

	async get_histories(req){
		try{
			let uid = req.session.user.uid;
			const histories = await this.db.collection("history").where("uid", "==", uid).get();
			if(!histories.empty){
				return BaseService.sendSuccessResponse(histories);
			}
			else{
				return BaseService.sendFailedResponse("Unfortunately no record was found")
			}
		}
		catch (e) {
			console.log(e.message);
			return SecureService.sendFailedResponse('An error occurred. Please check your request and try again');
		}
	}

	async confirmDeposit(token) {
        try{
            const doc_id = (!empty(token)) ? token : null;
			const found = await this.db.collection('transactions').doc(doc_id).get();
            if(!found.exists){
                return SecureService.sendFailedResponse({error: 'user_not_found'});
            }
            return SecureService.sendSuccessResponse(found.data());
		}
		catch(e){
			console.log(e.message);
			return SecureService.sendFailedResponse('An error occurred. Please check your request and try again');
		}
    }

}

module.exports = SecureService;