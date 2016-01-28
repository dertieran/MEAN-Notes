import MongoDB from 'mongodb';

import { Make } from './make.js';
import Logger from '../prototypes/Logger.js';
import Config from './Config.js'

let url = Config.getDbUrl();
let logger = Make(Logger)('Storage');
let { MongoClient, ObjectId } = MongoDB;

let db = url.then(url => {
    logger.log(url);
    return new Promise((success, failure) => {
        MongoClient.connect(url, function(error, db){
            if (error) {
                failure(error);
                return;
            }

            logger.log("connected correctly to MongoDB server.");
            success(db);
        });
	});
});

db.catch(function(e){
	logger.error(e)
})

let Interface =  {

    /**
     * @param {string} collection
     * @param {Object} item
     * @param {string|Object} [key]
     * @return {Promise<Object>}
     */
	saveItem : function(collection, item, key){
		return db.then(db => {
			return new Promise((success, failure) => {
                let query = null;

                if (item._id) {
                    item._id = ObjectId(item._id);
                }

                if (key) {

                    if (typeof key === 'object') {
                        query = key;
                    } else {
                        query = {};
                        query[key] = item[key];
                    }
                } else {
                    query = item._id ? { _id : item._id } : item;
                }

                logger.log('save query', collection, item);

				db.collection(collection).updateOne(query, item, {
					upsert : true
				}, (error, status) => {
					if (error) {
						failure(error);
					} else {
						console.log(collection, status.result);
						success(status.result);
					}
				});
			});
		});
	},

    /**
     * @param {string} collection
     * @param {Object} item
     * @return {Promise<Object>}
     */
    deleteItem : function(collection, query) {
        return db.then(db => {
			return new Promise((success, failure) => {
                logger.log('delete query', collection, query);
				db.collection(collection).remove(query, (error, status) => {
					if (error) {
						failure(error);
					} else {
						logger.log(collection, status.result);
						success(status.result);
					}
				});
			});
		});
    },

    /**
     * @param {string} collection
     * @param {Object} find
     * @param {Object} sort
     * @param {boolean} [forceList]
     * @return {Promise<Array|Object>}
     */
	findItems : function({ collection, find, sort={}, forceList=false }) {
		return db.then(db => {
			let p = new Promise((success, failure) => {
				let list = [];
				let cursor = db.collection(collection).find(find).sort(sort);

                logger.log('looking for', find, 'orderd by', sort);

				cursor.each((error, doc) => {
					if (error) {
                        logger.error(error);
						failure(error);
					} else if(doc === null) {
						let result = ((list.length > 1 || forceList) ? list : list[0]);

						success(result);
					} else {
						list.push(doc);
					}
				});
			});

			p.catch(e => {
				logger.error(e);
			});

			return p;
		});
	},

    /**
     * @param {string} collection
     * @param {string} objectId
     * @return {Promise<Object>}
     */
	getItem : function(collection, objectId) {
		let query = { _id : ObjectId(objectId) };

		return Interface.findItems({ collection : collection, find : query });
	},

    /**
     * @param {string} collection
     * @return {Promise<Array>}
     */
	getCollection : function(collection) {
		logger.log('fetching collection:', collection);
		return Interface.queryItems(collection, null, true);
	},

    /**
     * @param {string} collection
     * @param {string[]} keys
     * @param {Object} [config]
     * @return {Promise}
     */
    setIndex : function(collection, keys, config={ unique : true }){
        return db.then(db => {
            let index = {};

            keys.forEach(item => {
                index[item] = 1;
            });

            db.collection(collection).createIndex(index, config);
        });
    },

    ObjectId : ObjectId
}

export default Interface;
