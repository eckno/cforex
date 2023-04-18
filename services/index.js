/**
 * All home services
 */

const _ = require("lodash");
const BaseService = require("./base");
const { empty, filter_var, isString, isObject, in_array} = require("../lib/utils");
const { ROUTE_INDEX } = require("../lib/home-routes");


class IndexService extends BaseService {
	constructor() {
		super();
	}

    async registrationService(req) {
        //
    }

	async loginService(req) {}

}

module.exports = IndexService;