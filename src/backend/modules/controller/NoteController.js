
import { Make } from '../../modules/make.js';
import Controller from '../../prototypes/Controller.js';
import Storage from '../../modules/Storage.js';

let NoteController = Make({
    route : '/api/v1/user/:userId/note/:noteId?',

    name : 'NoteController',

    collection : 'notes',

    post : function(request, response){
        let { userId } = request.params;

        if (request.authenticated && request.userId == userId){
            let { body: model } = request;

            model.user = userId;

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
        let { userId, noteId } = request.params;

        if (request.authenticated && userId == request.userId){
            let { body : model } = request;

            model._id = noteId;
            model.user = userId;

            if (noteId !== 'all') {
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
        let { userId, noteId } = request.params;

        this.logger.log(typeof userId, typeof request.userId.toString(), request.authenticated);

        if (request.authenticated && userId == request.userId) {
            let { categories } = request.query;

            let query = {
                user : userId,
            };

            if (categories) {
                categories = categories.split(',');

                query.categories = { $all : categories };
            }

            if (noteId === 'all') {
                Storage.findItems({ collection : this.collection, find : query, forceList : true })
                .then(list => {
                    response.send(list);
                });
            } else if (noteId) {
                Storage.getItem(this.collection, noteId)
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
        let { userId, noteId } = request.params;

        if (request.authenticated && userId == request.userId){
            if (noteId) {
                Storage.deleteItem(this.collection, { _id : noteId }).then(() => {
                    response.send({
                        status : true
                    });
                }, status => {
                    response.status(404).send({
                        error : 404,
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
