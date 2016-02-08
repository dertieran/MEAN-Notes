
import { Make } from '../../modules/make.js';
import Controller from '../../prototypes/Controller.js';
import Storage from '../../modules/Storage.js';

let NoteController = Make({
    route : '/api/v1/note/:id?',

    name : 'NoteController',

    collection : 'notes',

    post : function(request, response){
        if (request.authenticated){
            let { body: model } = request;

            if (!model._id) {
                Storage.saveItem(this.collection, model)
                .then(result => {
                    if (result.upserted) {
                        let { _id } = result.upserted[0];

                        return Storage.getItem(this.collection, _id);
                    } else {
                        return Promise.reject('note already exists!');
                    }
                }, error => this.logger.error(error))

                .then(model => {
                    response.send(model);
                }, () => {
                    response.status(409).end({
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
        } else {
            response.status(401).send({
                error : 401,
                status : 'Unauthorized'
            });
        }

    },

    put : function(request, response){
        if (request.authenticated){
            let { body : model } = request;
            let { id } = request.params;

            model._id = id;

            if (id !== 'all') {
                Storage.saveItem(this.collection, model)
                .then(() => {
                    response.send(model);
                }, error => console.error(error));
            } else {
                response.status(403).send({
                    error : 403,
                    status : 'resource is read only',
                })
            }
        } else {
            response.status(401).send({
                error : 401,
                status : 'Unauthorized'
            });
        }

    },

    get : function(request, response) {
        if (request.authenticated){
            let { id } = request.params;

            if (id === 'all') {
                Storage.findItems({ collection : this.collection, find : {}, forceList : true })
                .then(list => {
                    response.send(list);
                });
            } else if (id) {
                Storage.getItem(this.collection, id)
                .then(item => {
                    response.send(item);
                }, () => response.send({ error : 404 }));
            } else {
                response.send({
                    error : 404
                });
            }
        } else {
            response.status(401).send({
                error : 401,
                status : 'Unauthorized'
            });
        }

    },

    delete : function(request, response){
        if (request.authenticated){
            let { id } = request.params;

            if (id) {
                Storage.deleteItem(this.collection, { _id : id }).then(() => {
                    response.send({
                        status : true
                    });
                }, status => {
                    response.status(500).send({
                        error : 500,
                        status : status
                    });
                });
            } else {
                response.status(404).send({
                    error : 404,
                    status : 'resource not found'
                })
            }
        } else {
            response.status(401).send({
                error : 401,
                status : 'Unauthorized'
            });
        }

    }

}, Controller).get();

export default NoteController;
