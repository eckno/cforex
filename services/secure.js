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

	async accountUpdate(req){
		try{
			if(!empty(req) && !empty(req.body)){
				const post = BaseService.sanitizeRequestData(req.body);
				
				if(!empty(post)){
					let errors = {}, response = {};
					const required_fields = ['old_password', 'new_password', 'phone'];
					const number_fields = ['phone'];
					errors = this.validateFields(post, required_fields, [], [],number_fields, [], []);
					
					if(!empty(errors)){
						return BaseService.sendFailedResponse(errors);
					}

					const doc_id = (!empty(req) && !empty(req.session) && !empty(req.session.user.uid)) ? req.session.user.uid : null;
					const user = await this.db.collection('users').doc(doc_id).get();
            		if(!user.exists){
            		    return SecureService.sendFailedResponse({error: 'user_not_found'});
            		}
					if(user.data().password !== post['old_password']){
						errors['password'] = "Incorrect old password. (if you have forgotten your password, please logout and use the forgot password to retrieve your account password.)";
					}

					if(!empty(errors)){
						return BaseService.sendFailedResponse(errors);
					}
					const update_data = {
						phone: post['phone'],
						password: post['new_password']
					};

					const update = await this.db.collection('users').doc(doc_id).update(update_data);
					if(update){
						const redirect_url = `/secure`;
						response['redirect_url'] = redirect_url;
						response['msg'] = "Your profile has been successfully updated";
						//
						return BaseService.sendSuccessResponse(response);
					}
				}
				else{
					return BaseService.sendFailedResponse('Error! Invalid Request');
				}
			}
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

	async submitTrade(req){
		try{
			if(!empty(req) && !empty(req.body)){
				const post = BaseService.sanitizeRequestData(req.body);
				
				if(!empty(post)){
					let errors = {}, response = {}, data = {};

					const doc_id = (!empty(req) && !empty(req.session) && !empty(req.session.user.uid)) ? req.session.user.uid : null;
					const user = await this.db.collection('users').doc(doc_id).get();
					if(user.exists){
						const existing_trade = await this.db.collection('trades').where("uid", "==", doc_id).where('status', '==', 'running').get();
						if(empty(user.data().deposit) || user.data().deposit < 999){
							errors['amount'] = 'You have low investment balance. Kindly topup your account before investing.';
						}else if(!existing_trade.empty){
							errors['trade'] = 'You already have a running trade.';
						}else{
							const date = new Date();
							data = {
								trader_id: post['trader_id'],
								trade_percent: post['trade_percent'],
								trade_hour: post['trade_hour'],
								trade_period: post['trader_period'],
								trade_amount: user.data().deposit,
								trade_earning: 0,
								paid: 0,
								started_on: `${date.getFullYear()} - ${date.getMonth()} - ${date.getDate()}`,
								completing_on: BaseService.getTradeEndDate(`${date.getDate()} / ${date.getMonth()} / ${date.getFullYear()}`, post['trader_period']),
								yesterday: `${date.getFullYear()} - ${date.getMonth()} - ${date.getDate()}`,
								completed: false,
								uid: user.data().unique_id,
								status: "running",
								_id: uniqid(),
							};

							data['days_remaining'] = data['trade_period'];

							const save_trade = await this.db.collection('trades').doc(data['_id']).set(data);
							
							if(!empty(save_trade._writeTime)){

								this.db.collection('users').doc(data['uid']).update({deposit: 0});

								let stat = {};
								const date = new Date();
								stat['type'] = 'Trade';
								stat['amount'] = data['trade_amount'];
								stat['id'] = data['_id'];
								stat['status'] = data['status'];
								stat['_id'] = uniqid();
								stat['uid'] = data['uid'];
								stat['date'] = `${date.getDate()} / ${date.getMonth()} / ${date.getFullYear()}`;

								this.db.collection('history').doc(stat['_id']).set(stat);

					 			response['msg'] = "You have successfully started a new trade. Congratulations !";
					 			response['redirect_url'] = '/secure';
					 			return BaseService.sendSuccessResponse(response);
							}
						}
           			 }else{
						errors['user'] = 'Something went wrong, please try again later !';
					}

					if(!empty(errors)){
						return BaseService.sendFailedResponse(errors);
					 }
				}
			}
		}
		catch (e){
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

	async getTrade(req){
		try{
			let uid = req.session.user.uid;
			const trade = await this.db.collection('trades').where("uid", "==", uid).where('status', '==', 'running').get();
			if(!trade.empty){
				return BaseService.sendSuccessResponse(trade);
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