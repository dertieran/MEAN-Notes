
import { Make } from '../modules/make.js';
import Model from './Model.js';

let Category = Make({
    name : '',
    color : '',
}, Model).get();

export default Category;
