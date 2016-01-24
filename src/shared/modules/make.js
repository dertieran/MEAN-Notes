/**
 * The make module consits of Make, getPrototypeOf and mixin.
 * See the documentation for each method to see what is does.
 * This module is part of the ApplicationFrame.
 * @module Make
 * @author Jovan Gerodetti
 * @copyright Jovan Gerodetti
 * @version 1.0
 */


/**
 * Internal function to apply one objects propteries to a target object.
 *
 * @param {Object} target
 * @param {Object} source
 * @inner
 */
var apply = function (target, source) {
    Object.keys(source).forEach(function(key){
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });

    return target;
};

/**
 * Creates a new object with the given prototype.
 * If two arguments are passed in, the properties of the first object will be
 * applied to the new object.
 *
 * @param {Object} object
 * @param {Object} prototype
 * @return {function}
 */
export var Make = function(object, prototype) {
    if(arguments.length < 2){
        prototype = object;
        object = null;
    }

    if (object === null) {
        object = Object.create(prototype);
    } else {
        object = apply(Object.create(prototype), object);
    }

    var m = function(...args){
        var make = object.make || object._make || function(){};

        make.apply(object, args);

        return object;
    };

    m.get = function(){ return object; };

    return m;
};

/**
 * This method checks if the given prototype is in the prototype chain of
 * the given target object.
 *
 * @param {Object} object
 * @param {Object} prototype
 * @return {boolean}
 */
export var hasPrototype = function(object, prototype){
    var p = Object.getPrototypeOf(object);

    while(p !== null && p !== undefined){
        if(typeof prototype == 'function')
            prototype = prototype.prototype;

        if(p == prototype)
            return true;
        else
            p = Object.getPrototypeOf(p);
    }

    return false;
};

/**
 * Creates a new prototype mixing all the given prototypes. Incase two or more
 * prototypes contain the same propterty, the new prototype will return
 * the propterty of the first prototype in the list which contains it.
 *
 * @param {...Object} prototypes
 * @return {Proxy}
 */
export var mixin = function(...prototypes){

    return new Proxy(prototypes, MixinTrap);

};

/**
 * Internal function to find a proptery in a list of prototypes.
 *
 * @param {Object[]} prototypes
 * @param {string} key
 * @return {Object}
 */
var findProperty = function(prototypes, key) {
    for (var i = 0; i < prototypes.length; i++) {
        var item = prototypes[i];

        if (item[key]) {
            return item;
        }
    }

    return undefined;
};

/**
 * Traps to create a mixin.
 */
var MixinTrap = {

    'get' : function(prototypes, key) {
        var object = findProperty(prototypes, key);

        return (object ? object[key] : null);
    },

    'set' : function(prototypes, key, value) {
        var object = findProperty(prototypes, key);

        if (object) {
            object[key] = value;
        } else {
            prototypes[0][key] = value;
        }
    }
};
