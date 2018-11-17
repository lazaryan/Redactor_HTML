/**
  * Главный класс
  */

class Redactor {
	constructor (el) {
		this.initBody(el);
		this.createLink('css/special.css');

		this.action = new Action(this);
		this.nav = new Nav(this, this.el);
	}

	initBody (el) {
		this.el = el ? typeof el == Object ? el : document.querySelector(el) : this.el ? this.el : document.querySelector('body');
	}

	createLink (src) {
		let link = document.createElement('link');
		link.classList = 'RedactorHTML_link';
		link.rel = 'stylesheet';
		link.href = src;

		document.querySelector('body').appendChild(link);
	}
}

let redactor = new Redactor();