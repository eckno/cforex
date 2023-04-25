const _ = require("lodash");

class BaseController {

    constructor(){
        this.footer_script = '';
		this.footer_scripts = [];
		this.header_stylesheets = [];
		this.header_stylesheet = "";
    }

    /**
	 * standard fail response object
	 * @param res
	 * @param data
	 */
	static sendFailResponse(res, errors) {
		res.status(400).send({success: false, errors});
	}

    /**
	 * standard success response object
	 * @param res
	 * @param data
	 */
	static sendSuccessResponse(res, data) {
		res.status(201).send({success: true, data});
	}

	static setUserSession(req, session_data) {
		if (req && req.session && session_data) {
			req.session.attendee_data = session_data;
			req.session.save();
		}
	}

	/**
	 * merges data with utils render function
	 * set template data, merge local data with global data
	 * Note: global variable names should start with "_" to avoid duplicate names
	 * @param req
	 * @param localData
	 * @return {{}}
	 */
	setTemplateParameters(req, localData) {
		if (typeof localData === 'undefined') {
			localData = {};
		}

		// template version cache update e.g. ?style.css?v={{TEMPLATE_VERSION}}
		if (process.env.TEMPLATE_VERSION) {
			localData.TEMPLATE_VERSION = process.env.TEMPLATE_VERSION;
		} else {
			localData.TEMPLATE_VERSION = new Date().getTime();
		}
		// add a single js script in /js/libs e.g. index for /js/libs/index.js?v={{ADMIN_TEMPLATE_VERSION}}
		if (this.footer_script !== '') {
			localData.footer_script = this.footer_script;
		}
		// add a multiple js scripts with their full url with .js e.g. ["/js/libs/index"] for /js/libs/index.js?v={{ADMIN_TEMPLATE_VERSION}}
		if (this.footer_scripts.length > 0) {
			localData.footer_scripts = this.footer_scripts;
		}
		if (this.header_stylesheets.length > 0) {
			localData.header_stylesheets = this.header_stylesheets;
		}
		if (this.header_stylesheet.length > 0) {
			localData.header_stylesheet = this.header_stylesheet;
		}

		// if there is no local template data to merge with global data
		if (typeof localData === 'undefined') {
			localData = {};
		}

		localData._ga_tag = process.env.GA_TAG || '';

		return this.render(req, localData);;
	}

	render(req, _obj) {
		const obj = {}
		// Handles flash messages
		// Adds flash messages to object variables
		if (req && _.has(req, 'session') && req.session.flash) {
			let msgObj
			while (msgObj = req.session.flash.shift()) {
				if (!_.has(obj, '_flash')) {
					obj._flash = {};
				}
				obj._flash[msgObj.type] = msgObj.message
			}
		}
		// leaving to ensure no breaking issues with old config
		for (const attr in _obj) {
			if (_obj[attr]) obj[attr] = _obj[attr]
		}

		obj['_server_date'] = new Date();
		return obj
	}
}

module.exports = BaseController;