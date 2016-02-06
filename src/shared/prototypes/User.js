import bcrypt from 'bcrypt-nodejs';
import { Make } from '../modules/make.js';
import Logger from './Logger.js';
import Model from './Model.js';

let logger = Make(Logger)('User Constructor');

/**
* @lends User.prototype
*/
let User = Make({
    /**
    * @type {string}
    */
    email : null,

    /**
    * @type {string}
    */
    password : null,

    /**
    * @constructs
    */
    _make : function(){
        bcrypt.genSalt(5, (error, salt) => {
            if (error){
                logger.error(error);
            } else {
                bcrypt.hash(this.password, salt, null, (error, hash) => {
                    if (error){
                        logger.error(error);
                    } else {
                        this.password = hash;
                    }
                });
            }
        });
    },

    verifyPassword : function(password, callback) {
        bcrypt.compare(password, this.password, function(error, isMatch) {
            if (error){
                return callback(error);
            }
            callback(null, isMatch);
        });
    }

}, Model).get();

export default User;
