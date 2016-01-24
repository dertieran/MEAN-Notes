import { Make } from './make.js';
import { ConfigLoader } from './ConfigLoader.js'
import Logger from '../prototypes/Logger.js';


Object.prototype.allKeys = function(object) {
    let list = [];

    for (let key in object) {
        list.push(key);
    }

    return list;
}

/**
 * @param {string} str
 * @see http://stackoverflow.com/a/6969486
 * @author CoolAJ86
 */
let escapeRegExp = function(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/** @type {Logger} */
let logger = Make(Logger)('Config');

let config = ConfigLoader().then(values => {
        let config = {};

        values.forEach(item => {
            config = Make(item, config).get();
        });

        return config;
    });

let Config = {
    getServerUrl : function(){
        return this.get('server').then(config => {
            return `${config.host}:${config.port}`;
        })
    },

    getDbUrl : function(){
        return this.get('db').then(config => {
            return `mongodb://${config.host}:${config.port}/${config.name}`;
        })
    },

    /**
     * @param {string|string[]} keys
     * @return {Promise<*>}
     */
    get : function(...keys){
        return config.then(config => {
            let list = [];

            keys.forEach(key => {
                if (config[key]) {
                    list.push(config[key]);
                } else {
                    key = (key[key.length-1] !== '.') ? key + '.' : key;
                    let value = {};

                    Object.allKeys(config).filter(item => {
                        return item.search(`^(${escapeRegExp(key)})`) > -1;
                    }).forEach(item => {
                        value[item.replace(key, '')] = config[item];
                    });

                    value = (Object.keys(value).length > 1) ? value : value[Object.keys(value)[0]];

                    list.push(value);
                }
            });

            return (list.length === 1) ? list[0] : list;
        });
    }
}

export default Config;
