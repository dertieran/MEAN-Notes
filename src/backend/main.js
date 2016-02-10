import Server from './modules/Server.js';

let ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
let port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3030;

Server.mount('client');

Server.start(port, ip);
