import { Make } from '../modules/make.js';
import Model from './Model.js';

/**
 * @typedef MemberRecord
 * @property {number} count,
 * @property {string} type,
 * @property {string[]} users
 */

let Project = Make({

    /**
     * @type {string}
     */
    title : '',

    /**
     * @type {string[]}
     */
    categories : null,

    /**
     * @type {string}
     */
    description : '',

    /**
     * @type {MemberRecord[]}
     */
    members : [],

    _make : function(){
        this.categories = [];
        this.members = [];
    },

    currentMembers : function(){
        return this.members.reduce((prev, next) => prev + next.users.length, 0);
    },

    neededMembers : function(){
        return this.members.reduce((prev, next) => prev + next.count, 0);
    },

    percentMembers : function(){
        return this.currentMembers() / this.neededMembers() * 100;
    }
}, Model).get();

export default Project;
