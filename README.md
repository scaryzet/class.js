[![build status](https://secure.travis-ci.org/scaryzet/class.js.png)](http://travis-ci.org/scaryzet/class.js)
[class.js](https://github.com/scaryzet/class.js)
================================================

Simple and efficient class inheritance based on John Resig's code ("Simple JavaScript Inheritance" and "Simple Class Instantiation").

Written for being used with node.js.

Installation
------------

```
npm install class.js
```

Example
-------

```javascript
var Class = require('class.js');

// Create a class.

var A = Class({
	// Contructor's code should be put into init().
	init: function(x) {
		this.x = x;
	},
    f: function() {
    	this.x += 2;
    }
});

// Instantiate.

var a = new A(7); // init(7) is called.

// This way is valid too, in case you accidentally forgot to write "new":

var a2 = A(7);

// Also, you have the magic "_parent()" method which allows you
// to call a method of the same name from the parent class.

// Let's create a child class.

var B = A.extend({
	init: function(x) {
		// Call the parent constructor:
		this._parent(x / 2);
	},
	f: function() {
		// Call the f() from "A":
		this._parent();

		// Do something specific to "B" here...
        this.x += 3;
	},
	g: function(a, b) {
		// Some code here...
	}
});

// The keyword "instanceof" works.

var X = Class({ /* ... */ });
var Y = X.extend({ /* ... */ });

var b = new B(11);
var x = new X();
var y = new Y();

a instanceof A; // true
b instanceof B; // true
b instanceof A; // true
x instanceof X; // true
y instanceof Y; // true
y instanceof X; // true

a instanceof B; // false
x instanceof Y; // false

x instanceof A; // false
b instanceof Y; // false

// If you have the urge to call an arbitrary parent's method
// from a child class, the way to do it (as of now) is the following:

var C = B.extend({
	init: function() { /* ... */ }
    x: function() {
    	A.prototype.f.call(this);
    }
});
```

Useful JsDoc for your IDE
-------------------------

```javascript
/** @class */
var A = Class(/** @lends A */ {
	/** @constructor */
	init: function() { /* ... */ }
	f: function() { /* ... */ }
});

/**
 * @class
 * @extends A
 */
var B = A.extend(/** @lends B */ {
	/** @constructor */
	init: function() { /* ... */ }
	g: function() { /* ... */ }
});
```

About
-----
 * Copyright 2012, Ivan Zhidkov.
 * Released under the MIT License.
 * Based on [Simple JavaScript Inheritance](http://ejohn.org/blog/simple-javascript-inheritance/) and [Simple Class Instantiation](http://ejohn.org/blog/simple-class-instantiation/) by John Resig (MIT Licensed).
