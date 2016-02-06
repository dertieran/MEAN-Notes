
import { Make } from '../../modules/make.js';
import Controller from '../../prototypes/Controller.js';
import User from '../../prototypes/User.js';
import Storage from '../../modules/Storage.js';


let UserController = Make({
    route : '/api/v1/user/create/:id?',

    name : 'UserController',

    collection : 'users',

    post : function(request, response){
        let { body: model } = request;

        if (!model._id) {

            let user = Make({
                email : model.email,
                password : model.password
            }, User)();

            Storage.saveItem(this.collection, user)
                .then(result => {
                    if (result.upserted) {
                        let { _id } = result.upserted[0];

                        return Storage.getItem(this.collection, _id);
                    } else {
                        return Promise.reject('User already exists!');
                    }
                }, error => {
                    response.status(409).send({
                        error : 409,
                        status : 'resource already exists'
                    });
                    this.logger.error(error);
                })

                .then(model => {
                    response.send(model);
                }, () => {
                    response.status(409).send({
                        error : 409,
                        status : 'resource already exists'
                    });
                });
        } else {
            response.status(400).send({
                error : 400,
                status : 'resource can\'t contain field "_id"',
            });
        }
    },

    /**
    * @constructs
    */
    _make : function(){
        Controller._make.apply(this);
        this.logger.log("setting index to email!");
        Storage.setIndex(this.collection, ['email']);
    },

}, Controller).get();

export default UserController;
