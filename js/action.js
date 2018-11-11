'use strict';

/**
 * Объект управление активным элементом
 */
function Action() {
	this.el = undefined;
}

Action.prototype = {
	init: function init(el) {
		if (!this.el) {
			this.el = el;
			this.action();
		} else {
			this.clear();

			this.el = el;
			this.action();
		}
	},
	addStyle: function addStyle() {
		this.el.classList.add('el_action');
	},
	removeStyle: function removeStyle() {
		this.el.classList.remove('el_action');
	},
	action: function action() {
		this.addStyle();
		this.el.setAttribute('contentEditable', 'true');
	},
	clear: function clear() {
		this.removeStyle();
		this.el.removeAttribute('contentEditable');

		this.el = undefined;
	},
	isBlock: function isBlock(el) {
		return this.el == el ? true : this.el ? false : true;
	}
};