
import { Make } from '../modules/make.js';

let Model = {

    clone : function(){
        return Make(this, Object.getPrototypeOf(this)).get();
    }

};

export default Model;
