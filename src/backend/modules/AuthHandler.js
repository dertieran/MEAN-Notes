import passport from 'passport';
import {BasicStrategy} from 'passport-http';

passport.use(new BasicStrategy(
    function(email, password, callback) {
        Storage.queryItems('users', { email : email }).then(user => {

            // No user found with that username
            if (!user) {
                return callback(null, false);
            }

            // Make sure the password is correct
            user.verifyPassword(password, function(error, isMatch) {
                if (error) {
                    return callback(error);
                }

                // Password did not match
                if (!isMatch) {
                    return callback(null, false);
                }

                // Success
                return callback(null, user);
            });
        });
    }
));

exports.isAuthenticated = passport.authenticate('basic');
