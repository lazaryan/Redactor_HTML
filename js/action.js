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
		} else if (!setting.el.contains(el)) {
			this.clear();

			this.el = el;
			this.action();
		}
	},
	addStyle: function addStyle() {
		this.el.classList.add('el_action');

		if (this.getStyle(this.el).position == 'static') {
			this.el.classList.add('el__action-relative');
		}
	},
	removeStyle: function removeStyle() {
		this.el.classList.remove('el_action');
		this.el.classList.remove('el__action-relative');
	},
	action: function action() {
		this.addStyle();
		setting.init(this.el);
	},
	clear: function clear() {
		this.removeStyle();
		setting.removeMenu();
		this.el.removeAttribute('contentEditable');

		this.el = undefined;
	},
	isBlock: function isBlock(el) {
		return this.el == el ? true : this.el && !setting.nav.contains(el) ? false : true;
	},
	getStyle: function getStyle(el) {
		return window.getComputedStyle(el, null);
	}
};