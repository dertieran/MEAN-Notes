
/**
 * @param {Object} object
 */
let stripHashKey = function(object){
	if (Array.isArray(object)) {
		object = object.map(stripHashKey);

	} else {
		object = JSON.parse(JSON.stringify(object));

		Object.keys(object).forEach(function(key){
			if (key == '$$hashKey') {
				delete object[key];
			}else if (typeof object[key] === 'object' ) {
				object[key] = stripHashKey(object[key]);
			}
		});
	}

	return object;
}

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
	_headers : null,

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
     * @type {function[]}
     */
    _listeners : null,

	/**
	 * The constructor for the NetworkRequest. It simply sets up the properties.
	 *
	 * @constructs
	 * @param {string} url
	 * @param {Object} config
	 * @return {NetworkRequest}
	 */
	_make : function(url, { method='POST', type='json' }){
		this.type = type;
		this.method = method;
        this._headers = {};
		this.url = url;
        this._listeners = [];
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
     * @param {function} fn
     */
    onReady : function(fn){
        this._listeners.push(fn);
    },

	/**
	 * This will actually create the network connection and initiate the request.
	 *
	 * @return {Promise}
	 */
	send : function(){
		let self = this;
		let xhr = new XMLHttpRequest();

		if (this.method === 'GET' && this._body) {
			this.url += '?' + Object.keys(this._body).map(function(key){
				return `${key}=${self._body[key]}`;
			}).join('&');
		}

		xhr.open(this.method, this.url, true);

		let promise = new Promise((success, failure) => {
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						let response = xhr.response;

						if (xhr.getResponseHeader('Content-Type').indexOf('application/json') > -1 && typeof response  === 'string') {
                            response = JSON.parse(response);
						}

                        this._listeners.forEach(fn => fn(xhr));

						success(response);
					} else {
						failure(xhr);
					}
				}
			}
		})

		Object.keys(this._headers).forEach(function(key){
			xhr.setRequestHeader(key, self._headers[key]);
		});

		if (this.type === 'json') {
            let body = this._body;

			xhr.setRequestHeader('Content-Type', 'application/json');

            if (body){
                body = stripHashKey(body);
                body = JSON.stringify(body);
            }

			xhr.send(body);
		} else {
			xhr.send(this._body);
		}

		return promise;
	}
};

export default NetworkRequest;
