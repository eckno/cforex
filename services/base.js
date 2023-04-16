const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { SERVICE_ACCOUNT_PATH } = require("../config");

class BaseService {
    ///
    constructor(){
        //
        this.serviceAccount = SERVICE_ACCOUNT_PATH;

        initializeApp({
          credential: cert(this.serviceAccount)
        });

        this.db = getFirestore();
    };

    async database(){ return this.db; }

   /**
	 *
	 * @param {*} data
	 * @returns
	 */
	static sanitizeRequestData(data) {
		if (!empty(data)) {
			_.forEach(data, (d, key) => {
				data[key] = this.recursivelySanitize(d);
			});
		}
		return data;
	}

  /**
	 * uniform expectation of failed response data
	 * @param data
	 * @return mixed
	 */
	static sendFailedResponse(data) {
		const returnData = { success: false };
		if (!empty(data) || data === "0" || data === 0 || data === "") {
			returnData['data'] = data;
		}
		return returnData;
	}

  /**
	 * uniform expectation of successful response data
	 * @param data
	 * @return mixed
	 */
	static sendSuccessResponse(data) {
		const returnData = { success: true };
		if (!empty(data) || data === 0 || data === "0" || data === "") {
			returnData['data'] = data;
		}
		return returnData;
	}

  /**
	 * check if attendee pass validation before submitting to api
	 * @param post
	 * @param required_fields
	 * @param name_fields
	 * @param vaildate_fields
	 * @param number_fields
	 * @param url_fields
	 * @return {array}
	 */
	 validateFields(post = {}, required_fields = [], name_fields = [], vaildate_fields = [], number_fields = [], url_fields = [], non_english_name_fields = []) {
		let errors = {};
		const name_regex = /^(?=.*[\p{L}])([\p{L} .,'‘’´′‘’-]+)$/gu;
		const field_regex = /^(?=.*[\p{L}\p{N}])([\p{L}\p{N} &.,'‘’´′‘’-]+)$/gu;
		const number_regex = /^\d+$/;
		const non_english_regex = /^[^0-9]+$/;

		if (!empty(post) && (_.isObject(post) || _.isArray(post))) {
			_.forEach(post, (value, field) => {
				if (!empty(post[field])) {
					// format date fields value
					if ((_.includes(field, '_date') !== false) && date('m/d/Y', strtotime(post[field]))) {
						post[field] = date('m/d/Y', strtotime(post[field]));
					}

					let not_accepted = "";
					if (!empty(name_fields)) {
						if (_.includes(name_fields, field)) {
							const last_character = post[field].slice(-1);
							if (!preg_match(name_regex, post[field])) {
								if (preg_match(/^(?=.*[\p{L}]).+/gu, post[field])) {
									not_accepted = _.replace(post[field], /[\p{L} .,'‘’´′‘’-]/gui, '');
									not_accepted = _.trim(_.join(_.uniq(_.split(not_accepted, '')), ' '));

									errors[field] = `Sorry, ${not_accepted} ${(not_accepted.length > 1 ? " are not valid characters" : " is not a valid character")} for the ${humanize(field)} field.`;
								} else {
									errors[field] = `Sorry, the ${humanize(field)} field must contain at least one alphabetic character.`;
								}
							} else if (!preg_match(/^(?=.*[\p{L}]).+/gui, last_character)) {
								errors[field] = `Sorry, the ${humanize(field)} field must end with an alphabetic character.`;
							}
						}
					}

					if (!empty(vaildate_fields)) {
						if (_.includes(vaildate_fields, field) && !preg_match(field_regex, post[field])) {
							if (preg_match(/^(?=.*[\p{L}\p{N}]).+/gu, post[field])) {
								not_accepted = _.replace(post[field], /[\p{L}\p{N} .,'‘’´′‘’-]/gui, '');
								not_accepted = _.trim(_.join(_.uniq(_.split(not_accepted, '')), ' '));

								errors[field] = `Sorry, ${not_accepted} ${(not_accepted.length > 1 ? " are not valid characters" : " is not a valid character")} for the ${humanize(field)} field.`;
							} else {
								errors[field] = `Sorry, the ${humanize(field)} field must contain at least one alphabetic character.`;
							}
						}
					}

					if (!empty(number_fields) && _.includes(number_fields, field)) {
						/***** Validating Phone Number Field ****/
						if (!(post[field].length >= 10 && post[field].length <= 15) && preg_match(/^[+]?[0-9]+$/, post[field])) {
							errors[field] = `Please enter a valid ${humanize(field)} (10 to 15 numerical numbers with or without a leading "+". e.g. 12301234567 or +447911123456)`;
						} else if (post[field].length === 10 && post[field].slice(0, 1) === "+") {
							errors[field] = `Please enter a valid ${humanize(field)} (10 to 15 numerical numbers with or without a leading "+". e.g. 12301234567 or +447911123456)`;
						}
					}

					if (!empty(url_fields)) {
						if (_.includes(url_fields, field)) {
							if (!filter_var(_.trim(post[field]), "FILTER_VALIDATE_URL")) {
								errors[field] = "Please enter a valid URL Address e.g http://example.com/";
							}
						}
					}

					if (!empty(non_english_name_fields)) {
						if (_.includes(non_english_name_fields, field)) {
							if (!preg_match(non_english_regex, post[field])) {
								errors[field] = `Sorry the ${humanize(field)} field cannot contain numbers.`;
							}
						}
					}

					if (_.includes(['phone_number', 'phone', 'cell_phone'], field)) {
						if (!(post[field].length >= 10 && post[field].length <= 15 && preg_match(/^[+]?[0-9]+$/, post[field]))) {
							errors[field] = 'Please enter a Valid Phone Number (10 to 15 numerical numbers with or without a leading "+". e.g. 12301234567 or +447911123456)';
						} else if (post[field].length === 10 && post[field].slice(0, 1) === "+") {
							errors[field] = 'Please enter a Valid Phone Number (10 to 15 numerical numbers with or without a leading "+". e.g. 12301234567 or +447911123456). If Phone Number starts with +, it must be followed by at least 10 numerical numbers.';
						}
					}

					if (_.includes(['email', 'cc_email'], field)) {
						if (!filter_var(_.trim(post[field]), "FILTER_VALIDATE_EMAIL")) {
							errors[field] = "Please enter a valid Email Address e.g john@example.com";
						}
					}
				}
			});

			if (!empty(required_fields)) {
				_.forEach(required_fields, field => {
					if (empty(post[field])) {
						if (field === 'g-recaptcha-response') {
							errors['g-recaptcha-response'] = "Please verify you are human";
						} else {
							errors[field] = `The ${humanize(field)} field is required`;
						}
					}
				});
			}
		} else {
			errors['server_error'] = "Something went wrong please try again later";
		}

		return errors;
	}

};


module.exports = BaseService;