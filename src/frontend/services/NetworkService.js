import { Make } from '../modules/make.js';
import NetworkRequest from '../prototypes/NetworkRequest.js';
import Logger from '../prototypes/Logger.js';
import UserService from './UserService.js'

/**
* @type {Logger}
*/
let logger = Make(Logger)('NetworkService');

let NetworkService = {

    _pending : {},

    host : new Promise(success => success(require('../modules/Config.js').default.getServerUrl())),

    /**
    * Creates a new network request to load the given url.
    * If an data object is provided, it will be sent as the POST body.
    *
    * @param {string} url
    * @param {Object} data
    * @return {Promise}
    */
    fetch : function(url, data, config={}) {
        if (!data && this._pending[url]) {
            return this._pending[url];
        }

        let request = Make(NetworkRequest)(url, config);

        let token = UserService.getToken();

        if (config.authenticate && !token) {
            return new Promise((success, failure) => {
                UserService.on('tokenReady', () => {
                    NetworkService.fetch(url, data, config).then(success, failure);
                });
            });
        }

        if(token){
            request.setHeader('Auth-Token', token);
        }

        if (data) {
            request.body(data);
        }

        let promise = request.send();

        promise.then(() => {
            delete this._pending[url];
        }, () => {
            delete this._pending[url];
        });

        this._pending[url] = promise;

        return promise;
    },

    /**
    * Will build the right url to fetch an API resource.
    *
    * @param {number} version
    * @param {string} resource
    * @return {string}
    */
    _buildApiUrl : function(version, resource){
        return this.host.then(host => {
            return `${location.protocol}//${host}/api/v${version}/${resource}`;
        })

    },

    /**
    * apiCall will fetch a resource from the api version 1.
    *
    * @param {string} resource
    * @param {Object} data
    * @return {Promise}
    * @deprecated
    */
    apiCall : function(resource, data) {
        return this._buildApiUrl(1, resource).then(url => {
            url += '.json';

            let p = this.fetch(url, data);

            logger.log('API call to ->', url);

            p.catch(e => {
                logger.error(e);
            });

            return p.then(function(data){
                return new Promise((success, failure) => {
                    if (data.error) {
                        failure(data);
                    } else {
                        success(data);
                    }
                });
            });
        });
    },

    /**
    * Fetches an resouce from our REST API. Similar to apiCall but also accepts the method for the request.
    *
    * @param {string} resouce
    * @param {string} method
    * @param {Object} data
    * @return {Promise<Object>}
    */
    resource : function({ resource, method='GET', data=null, authenticate=false }){


        let p = this._buildApiUrl(1, resource).then(url => {
            logger.log('fetching REST resource from -> ', method, url);

            return this.fetch(url, data, { method : method, authenticate : authenticate });
        });

        p.catch(error => logger.error(error));

        return p.then(resource => {
            return new Promise((success, failure) => {
                if (resource.error) {
                    failure(resource);
                } else {
                    success(resource);
                }
            });
        });
    },

    oauth2Request : function(url, token, data, config={}) {
        let request = Make(NetworkRequest)(url, config);

        logger.log(url, token, data);

        request.body(data);
        // AuthenticationService.authenticate(request, AuthenticationService.OAUTH2, token);

        logger.log('fetching external resource from -> ', config.method, url, request);

        let p = request.send();

        p.catch(error => logger.log(error));

        return p;
    }
};

export default NetworkService;
