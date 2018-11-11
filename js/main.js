'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var action = new Action();

/**
 * Главный объект
 */
function Controller() {
	var _this = this;

	var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

	this.el = undefined;
	this.init(el);

	this.el.addEventListener('click', function (e) {
		if (!action.isBlock(e.target)) {
			action.clear();
		}
	});

	this.el.addEventListener('dblclick', function (e) {
		if (e.target != _this.el) {
			action.init(e.target);
		}
	});
};

Controller.prototype = {
	init: function init(el) {
		this.el = el ? (typeof el === 'undefined' ? 'undefined' : _typeof(el)) == Object ? el : document.querySelector(el) : this.el ? this.el : document.querySelector('body');
	}
};