/**
 * @module server
 */

import Express from 'express';
import Path from 'path';
import Glob from 'glob';
import bodyParser from 'body-parser';
import passport from 'passport';
import {BasicStrategy} from 'passport-http';

import { Make, hasPrototype } from './make.js';
import Controller from '../prototypes/Controller.js';
import ResponseHandler from '../prototypes/ResponseHandler.js';
// import AuthorizeManager from './AuthorizeManager.js';

let app = Express();

app.use(bodyParser.json());
// app.use(AuthorizeManager.request.bind(AuthorizeManager, true));


let server = null;

/**
 * constructs and registers a controller in the server.
 *
 * @param {Controller} controller
 */
let controller = function(controller){
	if (hasPrototype(controller, Controller)) {
		controller = Make(controller)();

		let route = app.route(controller.route);

		var handlePostGet = (request, response, next) => {
			console.log('incomming request for', controller.route);
			controller.request(request, Make(ResponseHandler)(response, controller.logger));

            next();
		};

		route.post(handlePostGet);
		route.get(handlePostGet);

        ['get', 'post', 'put', 'delete'].forEach(method => {
            if (controller[method]) {
                console.log(controller.name, 'handles', method);

                route[method]((request, response) => {
                    console.log(`incomming ${method} request for`, controller.route);
                    controller[method](request, Make(ResponseHandler)(response, controller.logger));
                });
            }
        });

		route.options((request, response) => {
			console.log('incomming options request for', controller.route);
			controller.options(request, Make(ResponseHandler)(response));
		});
	} else {
		throw 'you can\'t register a non Controller object as a controller!';
	}
};

/**
 * Loads all the controllers and starts listening on the given port.
 *
 * @param {string} port
 * @return {Promise}
 */
let start = function(port, ip){
	if (!server) {
		let controlerList = Glob.sync('./dist/**/controller/**/*.js');

		controlerList = (controlerList.length > 0) ? controlerList : Glob.sync('./**/controller/**/*.js');

		controlerList.forEach(file => {
			console.log('LOADING CONTROLLER: ', file);
			controller(require(Path.resolve(file)).default);
		});

		server = new Promise(success => {
			let server = app.listen(port, ip, () => {
				console.log(`SERVER UP AND RUNNING LISTENING ON ${port}!!`);
				success(server)
			});
		});
	}

	return server;
}

/**
 * @param {string} dir
 * @param {string} path
 */
let staticDir = function(dir, path) {
	if (!path) {
		path = dir;
	}

	path = '/' + path;
	dir = Path.resolve(__dirname, '..', dir) + '/';

	console.log('mounting', dir, 'on', path);

	return app.use(path, Express.static(dir));
}

export default {
	start : start,
	controller : controller,
	mount : staticDir,
	use : app.use,
};
