'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
  * Класс управления страницей
  */

var Action = function () {
	function Action(main) {
		_classCallCheck(this, Action);

		this.main = main;
		this.block = undefined;

		this._redactor = false;
		this.redactorText = undefined;
	}

	_createClass(Action, [{
		key: 'choseBlock',
		value: function choseBlock(el) {
			if (this.block) {
				if (this.block != el) {
					this.block.classList.remove('redactorHTML__action-block');

					this.block = el;
					this.block.classList.add('redactorHTML__action-block');
				}
			} else {
				this.block = el;
				this.block.classList.add('redactorHTML__action-block');
			}

			if (this._redactor) {
				var textarea = this.redactorText.querySelector('textarea');
				textarea.innerHTML = this.getTextBlock();

				if (textarea.innerHTML == 'блок имеет дочерние элементы!!!' || textarea.innerHTML == 'блок не выбран') {
					textarea.disabled = 'disabled';
				} else {
					textarea.removeAttribute('disabled');
				}
			}
		}
	}, {
		key: 'disactiveBlock',
		value: function disactiveBlock() {
			if (this.block) this.block.classList.remove('redactorHTML__action-block');

			this.block = undefined;
		}
	}, {
		key: 'redactor',
		value: function redactor(nav) {
			var _this = this;

			this._redactor = true;

			this.redactorText = document.createElement('div');
			this.redactorText.classList = 'redactorHTML__redactor';
			this.redactorText.id = 'redactorText';

			this.redactorText.innerHTML = this.redactorTemplate;
			nav.appendChild(this.redactorText);

			var textarea = this.redactorText.querySelector('textarea');

			if (textarea.innerHTML == 'блок имеет дочерние элементы!!!' || textarea.innerHTML == 'блок не выбран') {
				textarea.disabled = 'disabled';
				return;
			}

			this.addStyleForINput();

			textarea.addEventListener('keyup', function () {
				return _this.changeTextBlock();
			});
			textarea.addEventListener('input', function () {
				return _this.changeTextBlock();
			});
		}
	}, {
		key: 'changeTextBlock',
		value: function changeTextBlock() {
			var textarea = this.redactorText.querySelector('textarea');

			this.block.innerHTML = textarea.value;
		}
	}, {
		key: 'getTextBlock',
		value: function getTextBlock() {
			if (this.block) {
				return this.block.children.length == 0 ? this.block.innerHTML : '\u0431\u043B\u043E\u043A \u0438\u043C\u0435\u0435\u0442 \u0434\u043E\u0447\u0435\u0440\u043D\u0438\u0435 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B!!!';
			} else {
				return '\u0431\u043B\u043E\u043A \u043D\u0435 \u0432\u044B\u0431\u0440\u0430\u043D';
			}
		}
	}, {
		key: 'disactiveRedactor',
		value: function disactiveRedactor() {
			this.activeStyle();
			this._redactor = false;

			this.redactorText.parentNode.removeChild(this.redactorText);
			this.redactorText = undefined;
		}
	}, {
		key: 'activeStyle',
		value: function activeStyle() {
			var inputs = this.redactorText.querySelectorAll('input');

			for (var i = 0; i < inputs.length; i++) {
				if (inputs[i].value) {
					this.block.style[inputs[i].dataset.style] = inputs[i].value;
				}
			}
		}
	}, {
		key: 'save',
		value: function save() {
			this.activeStyle();

			var path = window.location.pathname;
			if (path == '\/') path = 'index.html';

			var text = this.getTextFiles();

			var xhr = new XMLHttpRequest();

			xhr.open('POST', '../main.php', true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.send("path=" + path + "&&" + "html=" + encodeURIComponent(text));

			xhr.onreadystatechange = function () {
				if (xhr.readyState != 4) return;

				if (xhr.status != 200) {
					console.warn(xhr.status + ': ' + xhr.statusText);
				} else {}
			};
		}
	}, {
		key: 'getTextFiles',
		value: function getTextFiles() {
			var block = document.querySelector('html').cloneNode(true);

			block.querySelector('#redactorHTML').parentNode.removeChild(block.querySelector('#redactorHTML'));

			var redactor_link = block.querySelectorAll('.RedactorHTML_link');
			for (var i = 0; i < redactor_link.length; i++) {
				block.querySelector('body').removeChild(redactor_link[i]);
			}

			var block_action = block.querySelector('.redactorHTML__action-block');
			if (block_action) {
				block_action.classList.remove('redactorHTML__action-block');
			}

			return block.innerHTML;
		}
	}, {
		key: 'addStyleForINput',
		value: function addStyleForINput() {
			var inputs = this.redactorText.querySelectorAll('input');

			for (var i = 0; i < inputs.length; i++) {
				if (this.block.style[inputs[i].dataset.style]) {
					inputs[i].value = this.block.style[inputs[i].dataset.style];
				}
			}
		}
	}, {
		key: 'redactorTemplate',
		get: function get() {
			return '\n\t\t\t<nav>' + this.redactorNav + '</nav>\n\t\t\t<textarea id="redactorTextarea">' + this.getTextBlock() + '</textarea>\n\t\t';
		}
	}, {
		key: 'redactorNav',
		get: function get() {
			return this.redactorElements.reduce(function (list, el) {
				list += '<div>\n\t\t\t\t\t\t<label>' + el.title + ': </label>\n\t\t\t\t\t\t' + (el.type == 'input' ? '<input type="text" data-style="' + el.style + '" />' : '') + '\n\t\t\t\t\t</div>';

				return list;
			}, '');
		}
	}, {
		key: 'redactorElements',
		get: function get() {
			return [{
				title: 'colorText',
				style: 'color',
				type: 'input'
			}, {
				title: 'bgc',
				style: 'backgroundColor',
				type: 'input'
			}, {
				title: 'fsz',
				style: 'font-size',
				type: 'input'
			}];
		}
	}]);

	return Action;
}();