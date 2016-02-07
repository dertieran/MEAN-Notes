
import { Make } from '../../modules/make.js';
import Controller from '../../prototypes/Controller.js';
import User from '../../prototypes/User.js';
import Token from '../../prototypes/Token.js';
import Storage from '../../modules/Storage.js';


let UserController = Make({
    route : '/api/v1/user/login/:id?',

    name : 'TokenController',

    collection : 'tokens',

    post : function(request, response){
        let { body: model } = request;

        Storage.findItems({ collection : 'users', find : {email : model.email }})
        .then(item => {
            if (Object.keys(item).length === 0){
                response.status(401).send({
                    error : 401,
                    status : 'Unauthorized'
                });
            } else {
                let user = Make({
                    email : item.email,
                    password : item.password
                }, User).get();

                user.verifyPassword(model.password, function(error, isMatch){
                    if (error){
                        this.logger.error(error);
                    } else {
                        if (isMatch){
                            let token = Make({userID : item._id}, Token)();

                            Storage.saveItem('tokens', token)
                            .then(() => {
                                response.send(token);
                            }, error => console.error(error));

                        } else {
                            response.status(401).send({
                                error : 401,
                                status : 'Unauthorized'
                            });
                        }
                    }
                });
            }
        })
    },

}, Controller).get();

export default UserController;
