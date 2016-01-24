import NetworkService from 'services/NetworkService.js';

export var ConfigLoader = function(){
    return Promise.all([
        load('./config/config.default.json'),
        load('./config/config.json')
    ]);
}

let load = function(url){
    return NetworkService.fetch(url, null, {method:'GET'});
}
