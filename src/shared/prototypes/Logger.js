/**
 * @lends Logger.prototype
 */
let Logger = {
	prefix : '',

	log : function(...args) {
		console.log(this.prefix, ...args);
	},

	warn : function(...args) {
		console.warn(this.prefix, ...args);
	},

	error : function(...args) {
		console.error(this.prefix, ...args);
	},

	_make : function(prefix) {
		this.prefix = prefix + ':';
	}
}

export default Logger;
