
import { Make } from '../../modules/make.js';
import Controller from '../../prototypes/Controller.js';
import Storage from '../../modules/Storage.js';

let NoteController = Make({
    route : '/api/v1/note/:id?',

    name : 'NoteController',

    collection : 'notes',

    post : function(request, response){
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
    },

    put : function(request, response){
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
    },

    get : function(request, response) {
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
    }

}, Controller).get();

export default NoteController;