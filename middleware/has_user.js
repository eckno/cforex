const { empty, isString } = require('../lib/utils');

const hasUser = async (req, res, next) => {

    try {
		if (empty(req.session) || empty(req.session.user) || req.session.user === undefined) {
			return res.redirect('/account');
		}
        next();
    }
    catch(ex){
        console.log(ex.message);
    }
}

module.exports = hasUser;