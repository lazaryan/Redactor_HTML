/**
  * Главный класс
  */

class Redactor {
	constructor (el) {
		this.data = {};

		this.initBody(el);
		this.getData();
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

	getData () {
		let xhr = new XMLHttpRequest();
		xhr.overrideMimeType("application/json");

		xhr.open('GET', 'js/data.json', true);

		xhr.onreadystatechange = (function () {
			if (xhr.readyState != 4) return;

			if (xhr.status != 200) {
				console.warn(xhr.status + ': ' + xhr.statusText);
			} else {
				let data = JSON.parse(xhr.responseText);
				this.data = data;
			}
		}).bind(this);

		xhr.send();
	}
}

let redactor = new Redactor();