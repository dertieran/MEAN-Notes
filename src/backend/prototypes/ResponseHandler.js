import Config from '../modules/Config.js';
import { Make } from '../modules/make.js';
// import StaticTemplate from './StaticTemplate.js';
import Fs from 'fs';
import Path from 'path';

/**
 * @lends Response.prototype
 */
let ResponseHandler = {

    /**
     * @type {Response}
     */
	_response : null,

    /**
     * @type {Logger}
     */
	logger : null,

    _headers : null,

	/**
	 * The ResponseHandler takes care of sending the controlers response object properly.
	 *
	 * @constructs
	 * @param {ExpressResponse} response
	 */
	_make : function(response, logger) {
		this._response = response;
		this.logger = logger;
        this._headers = {};

		//default headers
		this.setHeaders({
			'Access-Control-Allow-Origin' : '*',
			'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
			'Access-Control-Allow-Headers' : 'origin, content-type'
		});
	},

	/**
	 * this will set the given headers for the response
	 *
	 * @param {Object} headers
	 */
	setHeaders : function(headers){
        Object.keys(headers).forEach(key => {
            this._headers[key] = headers[key];
        });
	},

	/**
	 * @param {Object} response
	 * @return {boolean}
	 */
	send : function(response) {
		let data = JSON.stringify(response);

        this._response.set(this._headers);
        this._response.type('json');
		this._response.end(data);
	},

	/**
	 * redirects a request.
	 *
	 * @param {string} path
	 */
	redirect : function(path) {
		this.logger.log('redirecting from', this._response.req.url, 'to', path);

		this._response.redirect(path);
		this._response.end();
	},

    /**
     * @param {function} fnc
     * @param {*} [param1]
     * @param {*} [param2]
     * @param {*} [param3]
     */
    sendFunction : function(fnc, param1, param2, param3){
        Config.get('serverResponse.functionTemplate').then(templateString => {
            return new Promise((success, failure) => {
                Fs.readFile(Path.resolve(__dirname, templateString), 'utf8', (error, data) => {
                    if (error) {
                        failure(error);
                    } else {
                        success(data);
                    }
                });
            });
        }).then(template => {
            /** @type {StaticTemplate} */
            template = Make(StaticTemplate)(template);

            template.setField('function', fnc);
            template.setField('param1', param1);
            template.setField('param2', param2);
            template.setField('param3', param3);


            this._response.type('html');
            this._response.end(template.bake());
        }, error => this.logger.error(error));
    },

    /**
     * @param {number} statusCode
     */
    status : function(statusCode){
        this._response.status(statusCode);

        return this;
    }
}

export default ResponseHandler;
