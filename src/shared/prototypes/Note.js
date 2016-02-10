import { Make } from '../modules/make.js';
import Model from './Model.js';

let Note = Make({
    user : 0,
    title : '',
    content : '',
    categories : null,
    startdate : 0,
    enddate : 0,
    creationdate : 0,

    _make : function(){
        this.categories = [];
        this.startdate = Date.now();
        this.enddate = Date.now();
    }
}, Model).get();

export default Note;
