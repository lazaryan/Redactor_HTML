'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
  * Главный класс
  */

var Redactor = function () {
	function Redactor(el) {
		_classCallCheck(this, Redactor);

		this.data = {};

		this.initBody(el);
		this.getData();
		this.createLink('Redactor/special.css');

		this.action = new Action(this);
		this.nav = new Nav(this, this.el);
	}

	_createClass(Redactor, [{
		key: 'initBody',
		value: function initBody(el) {
			this.el = el ? (typeof el === 'undefined' ? 'undefined' : _typeof(el)) == Object ? el : document.querySelector(el) : this.el ? this.el : document.querySelector('body');
		}
	}, {
		key: 'createLink',
		value: function createLink(src) {
			var link = document.createElement('link');
			link.classList = 'RedactorHTML_link';
			link.rel = 'stylesheet';
			link.href = src;

			document.querySelector('body').appendChild(link);
		}
	}, {
		key: 'getData',
		value: function getData() {
			var xhr = new XMLHttpRequest();
			xhr.overrideMimeType("application/json");

			xhr.open('GET', 'js/data.json', true);

			xhr.onreadystatechange = function () {
				if (xhr.readyState != 4) return;

				if (xhr.status != 200) {
					console.warn(xhr.status + ': ' + xhr.statusText);
				} else {
					var data = JSON.parse(xhr.responseText);
					this.data = data;
				}
			}.bind(this);

			xhr.send();
		}
	}]);

	return Redactor;
}();

var redactor = new Redactor();