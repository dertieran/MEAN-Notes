import Logger from './Logger.js';
import { Make } from '../modules/make.js';

/**
 * @lends Controller.prototype
 */
let Controller = {
    /**
     * @type {string}
     */
	name : 'Unnamend Controller',

    /**
     * @type {string}
     */
	route : null,

    /**
     * @type {string}
     */
	logger : null,

    /**
     * @constructs
     */
	_make : function(){
		this.logger = Make(Logger)(this.name);
		this.logger.log(`REGISTERED ROUTE FOR ${this.route}`);
	},

	request : function(){},

    /**
     * @param {Request} request
     * @param {ResponseHandler} response
     */
	options : function(request, response){
		response.send();
	}
};

export default Controller;
