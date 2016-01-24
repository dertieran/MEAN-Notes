import fs from 'fs';
import Path from 'path';

export let ConfigLoader = function() {
    return Promise.all([
        load('./config/config.default.json'),
        load('./config/config.json'),
        load('./config/config.server.json')
    ]);
}

let load = function(url){
    return new Promise((success) => {
        url = Path.resolve(__dirname, '..', url);

        fs.readFile(url, 'utf8', (err, data) => {
            if (err) success({});
            else success(JSON.parse(data));
        });
    });
}
