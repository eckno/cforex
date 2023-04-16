

class BaseController {

    constructor(){
        //
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
}

module.exports = BaseController;