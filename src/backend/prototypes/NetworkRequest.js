import Http from 'http';
import Https from 'https';
import Url from 'url';
import Logger from './Logger.js';
import { Make } from '../modules/make.js';

/**
 * @lends NetworkRequest.prototype
 */
let NetworkRequest = {
    /**
     * @private
     * @type {Object}
     */
    _body : {},

    /**
     * @private
     * @type {Object}
     */
	_headers : {},

    /**
     * @type {string}
     */
	type : '',

    /**
     * @type {string}
     */
	method : '',

    /**
     * @type {string}
     */
	url : '',

    /**
     * @type {Logger}
     */
    logger : null,

	/**
	 * The constructor for the NetworkRequest. It simply sets up the properties.
	 *
	 * @constructs
	 * @param {string} url
	 * @param {Object} config
	 * @return {NetworkRequest}
	 */
	_make : function(url, { method='POST', type='json', ssl=false }){
        this.logger = Make(Logger)('NetworkRequest');
		this.type = type;
		this.method = method;
		this.url = url;
        this.ssl = ssl;

        this.logger.log('New network request for', url);
	},

	/**
	 * this method will set the given object as the request body.
	 *
	 * @param {Object} data
	 * @return {NetworkRequest}
	 */
	body : function(data){
		this._body = data;

		return this;
	},

	/**
	 * This method will set the request headers, in case custom headers are required.
	 *
	 * @param {Object} headers
	 * @return {NetworkRequest}
	 */
	headers : function(headers) {
		this._headers = headers;

		return this;
	},

    /**
     * Sets a single header for this request.
     *
     * @param {string} key
     * @param {string} value
     * @return {NetworkRequest}
     */
    setHeader : function(key, value) {
        this._headers[key] = value;

        return this;
    },

	/**
	 * This will actually create the network connection and initiate the request.
	 *
	 * @return {Promise}
	 */
	send : function(){

        let queryString = Object.keys(this._body).map(key => {
            return `${key}=${this._body[key]}`;
        }).join('&');

        queryString = encodeURI(queryString);

		if (this.method === 'GET' && queryString.length > 0) {
			this.url += '?' + queryString;
		}


		let promise = new Promise((success, failure) => {

            let callback = response => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    this.logger.log(`got everything for ${this.url}`);
                    this.logger.log(response.statusCode, data);
                    if (response.statusCode > 399) {
                        return failure(data);
                    }

                    if (this.type === 'json') {
                        data = JSON.parse(data);
                    }

                    success(data);
                });
            };

            let url = Url.parse(this.url);

            if (this.type == 'json' && this.method !== 'GET') {
                this._headers['Content-Type'] = 'application/json';
            } else if (this.type == 'queryString' && this.method !== 'GET') {
                this._headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }

            let options = {
                protocol : (this.ssl ? 'https:' : 'http:'),
                host : url.host,
                path : url.path,
                headers : this._headers,
                method : this.method
            };

            this.logger.log(options);

            let request = null;

            if (this.ssl) {
                request = Https.request(options, callback);
            } else {
                request = Http.request(options, callback);
            }

            this.logger.log(this._body);

            if (this.type === 'json') {
                let body = JSON.stringify(this._body);

                request.end(body);
            } else if (this.type === 'queryString' && this.method !== 'GET') {
                request.end(queryString);
            } else {
                request.end();
            }

		});

		return promise;
	}
};

export default NetworkRequest;
