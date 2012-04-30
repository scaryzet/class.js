/**
 * Author: Ivan Zhidkov
 * Info: https://github.com/scaryzet/class.js
 *
 * Released under the MIT License.
 *
 * Based on:
 *
 *   "Simple JavaScript Inheritance" by John Resig (MIT Licensed).
 *   http://ejohn.org/blog/simple-javascript-inheritance/
 *
 *   "Simple Class Instantiation" by John Resig (MIT Licensed).
 *   http://ejohn.org/blog/simple-class-instantiation/
 */
module.exports = (function() {
	var initializing = false;

	/**
	 * @example
	 *
	 * var A = makeSmartClass();
	 * A.prototype.init = function(x) { this.x = x; };
	 *
	 * // Both ways are valid:
	 * var instance1 = new A(2);
	 * var instance2 = A(2);
	 */
	function makeSmartClass() {
		function SmartClass(args) {
			// Was the keyword "new" used?
			if (this instanceof SmartClass) {
				if (!initializing && typeof this.init == 'function')
					this.init.apply(this, args && args.callee ? args : arguments);
			} else {
				return new SmartClass(arguments);
			}
		};

		return SmartClass;
	}

	function Base() {
	};

	// NOTE: Function source code is always accessible in nodejs.
	var parentFnRegex = /\b_parent\b/;

	Base.extend = function(properties) {
		var _parent = this.prototype;

		// Instantiate a base class (but only create the instance, don't run the init constructor).

		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype.

		for (var name in properties) {
			var property = properties[name];

			// We want to have a special property "_parent" in our methods, which acts itself
			// as the corresponding parent method called in context of our object.
			//
			// So that this._parent(...) calls the method of the same name of the parent class.

			if (typeof property == 'function' && parentFnRegex.test(property)) {
				prototype[name] = (function(name, fn) {
					var parentFunction = typeof _parent[name] == 'function'
//						? function() {
//							return _parent[name].apply(this, arguments);
//						}
						? _parent[name]
						: function() {
							throw new Error('Bad _parent() call: ' + name + '() doesn\'t exist in parent class.');
						};

					return function() {
						var tmp = this._parent;

						// Add a new ._parent().

						this._parent = parentFunction;

						// The method only need to be bound temporarily,
						// so we remove it when we're done executing.

						var ret = fn.apply(this, arguments);
						this._parent = tmp;

						return ret;
					};
				})(name, property);
			} else {
				prototype[name] = property;
			}
		}

		var Class = makeSmartClass();

		// Populate our constructed prototype object, enforce the constructor to be what we expect,
		// and make this class extendable.

		Class.prototype = prototype;
		Class.prototype.constructor = Class;
		Class.extend = arguments.callee;

		return Class;
	};

	return function(properties) {
		return Base.extend(properties);
	};
}());
