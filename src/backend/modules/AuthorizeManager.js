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
                Storage.findItems({ collection : 'tokens', find : {token : token}}).then(item => {

                    if (Object.keys(item).length !== 0){
                            request.authenticated = true;
                            request.userId = item.userID;


                            logger.log('Authenticated')

                            item.lastModifiedDate = new Date();
                            Storage.saveItem('tokens', item);
                    }

            }).then(() => next());
        } else {
            logger.log('Not Authenticated')
            next();
        }
    }
}

export default AuthorizeManager;
