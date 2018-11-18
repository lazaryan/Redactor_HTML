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
				this.redactorText.innerHTML = this.redactorTemplate;

				this.addEventTextarea();
				this.addEventButton();
			}
		}
	}, {
		key: 'disactiveBlock',
		value: function disactiveBlock() {
			if (this.block) {
				this.block.classList.remove('redactorHTML__action-block');

				this.block = undefined;

				if (this.redactorText) {
					this.redactorText.innerHTML = this.redactorTemplate;
				}
			}
		}
	}, {
		key: 'redactor',
		value: function redactor(nav) {
			this._redactor = true;

			this.redactorText = document.createElement('div');
			this.redactorText.classList = 'redactorHTML__redactor';
			this.redactorText.id = 'redactorText';

			this.redactorText.innerHTML = this.redactorTemplate;
			nav.appendChild(this.redactorText);

			this.addEventTextarea();
			this.addEventButton();
		}
	}, {
		key: 'addEventTextarea',
		value: function addEventTextarea() {
			var _this = this;

			var textarea = this.redactorText.querySelector('textarea');
			if (textarea) {
				this.addStyleForINput();

				textarea.addEventListener('keyup', function () {
					return _this.changeTextBlock();
				});
				textarea.addEventListener('input', function () {
					return _this.changeTextBlock();
				});
			}
		}
	}, {
		key: 'addEventButton',
		value: function addEventButton() {
			var _this2 = this;

			var buttons = this.redactorText.querySelectorAll('button');
			if (!buttons) return;

			for (var i = 0; i < buttons.length; i++) {
				buttons[i].addEventListener('click', function (e) {
					return _this2.changeStyleForButton(e.target);
				});
			}
		}
	}, {
		key: 'changeStyleForButton',
		value: function changeStyleForButton(el) {
			el.classList.toggle('redactorHTML__button_action-style');

			if (el.classList.contains('redactorHTML__button_action-style')) {
				this.block.style[el.dataset.style] = el.dataset.value;
			} else {
				this.block.style[el.dataset.style] = '';
			}
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
			return this.block ? this.block.innerHTML : 'undefined';
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
			if (!this._redactor) return;

			var inputs = this.redactorText.querySelectorAll('input');

			for (var i = 0; i < inputs.length; i++) {
				if (inputs[i].value && inputs[i].value != window.getComputedStyle(this.block)[inputs[i].dataset.style]) {
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
				inputs[i].value = window.getComputedStyle(this.block)[inputs[i].dataset.style];
			}
		}
	}, {
		key: 'redactorTemplate',
		get: function get() {
			return (this.getTextBlock() == 'undefined' ? 'Блок не подходит или не выбран для редактирования текста!' : '<nav>' + this.redactorNav + '</nav>\n\t\t\t\t\t' + (this.block.children.length == 0 ? '<textarea id="redactorTextarea">' + this.getTextBlock() + '</textarea>' : '')) + '\n\t\t';
		}
	}, {
		key: 'redactorNav',
		get: function get() {
			return this.redactorElements.reduce(function (list, el) {
				if (el.type == 'input') {
					list += '<div>\n\t\t\t\t\t\t<label>' + el.title + ': </label>\n\t\t\t\t\t\t' + (el.type == 'input' ? '<input type="text" data-style="' + el.style + '" />' : '') + '\n\t\t\t\t\t</div>';
				} else if (el.type == 'button') {
					list += '<div>\n\t\t\t\t\t\t\t<button data-style="' + el.style + '" data-value="' + el.value + '">' + el.title + '</button>\n\t\t\t\t\t\t</div>';
				}

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
				title: 'backgroundColor',
				style: 'backgroundColor',
				type: 'input'
			}, {
				title: 'font-size',
				style: 'fontSize',
				type: 'input'
			}, {
				title: 'Жирный',
				style: 'fontWeight',
				value: 'bold',
				type: 'button'
			}, {
				title: 'Курсив',
				style: 'fontStyle',
				value: 'italic',
				type: 'button'
			}];
		}
	}]);

	return Action;
}();