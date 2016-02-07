import { Make } from './make.js';
import Storage from './Storage.js';
import Logger from '../prototypes/Logger.js';

/** @type {Logger} */
let logger = Make(Logger)('AuthorizeManager');

let AuthorizeManager = {

    request : function(protect, request, response, next) {
        let token = request.header('Auth-Token');

        request.authenticated = false;

        if (token) {
                Storage.findItems('tokens', { token : token }).then(item => {

                    if (Object.keys(item).length === 0){
                        if (Date.now - item.created <= (24*60*60*1000)){
                            request.authenticated = true;

                            item.created = Date.now();
                            Storage.saveItem('tokens', item);
                        }
                    }

            }).then(() => next());
        } else {
            next();
        }
    }
}

export default AuthorizeManager;
