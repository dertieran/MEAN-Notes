import NetworkRequest from '../prototypes/NetworkRequest.js';
import { Make } from './make.js';

export var ConfigLoader = function(){
    return Promise.all([
        load('./config/config.default.json'),
        load('./config/config.json')
    ]);
}

let load = function(url){
    return Make(NetworkRequest)(url, {method:'GET'}).send();
}
