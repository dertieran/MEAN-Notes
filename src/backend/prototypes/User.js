import bcrypt from 'bcrypt-nodejs';

/**
* @lends User.prototype
*/
let User = {
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
        bcrypt.genSalt(5, function(error, salt) {
            if (error){
                return error;
            }

            bcrypt.hash(this.password, salt, null, function(error, hash) {
                if (error){
                    return error;
                }

                this.password = hash;
            });
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


};

export default User;
