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
				this.addValueForSelect();

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
		key: 'changeTag',
		value: function changeTag() {
			var select = this.redactorText ? this.redactorText.querySelector('select') : false;

			if (!select || select.value == this.block.localname) return;

			var newNode = document.createElement(select.value);

			this.block.parentNode.insertBefore(newNode, this.block);

			for (var i = 0, attrs = this.block.attributes, count = attrs.length; i < count; i++) {
				newNode.setAttribute(attrs[i].name, attrs[i].value);
			}

			newNode.innerHTML = this.block.innerHTML;

			this.block.parentNode.removeChild(this.block);

			this.block = newNode;
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
			this.changeTag();
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
				if (!inputs[i].dataset.for) {
					if (inputs[i].value && inputs[i].value != window.getComputedStyle(this.block)[inputs[i].dataset.style]) {
						this.block.style[inputs[i].dataset.style] = inputs[i].value;
					}
				} else {
					if (inputs[i].value && inputs[i].value != this.block[inputs[i].dataset.tag]) {
						this.block[inputs[i].dataset.tag] = inputs[i].value;
					}
				}
			}
		}
	}, {
		key: 'save',
		value: function save() {
			this.activeStyle();
			this.changeTag();

			var path = window.location.pathname;
			if (path == '\/') path = this.main.data['defaul_index_file'];

			var text = this.getTextFiles();

			var xhr = new XMLHttpRequest();

			xhr.open('POST', this.main.data.path + this.main.data["name_file"], true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.send("path=" + path + "&&html=" + text + "&&key=" + this.main.data.key.toString());

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
				if (!inputs[i].dataset.for) {
					inputs[i].value = window.getComputedStyle(this.block)[inputs[i].dataset.style];
				} else {
					inputs[i].value = this.block[inputs[i].dataset.tag];
				}
			}
		}
	}, {
		key: 'addValueForSelect',
		value: function addValueForSelect() {
			var select = this.redactorText.querySelector('select');

			for (var i = 0; i < select.options.length; i++) {
				if (select.options[i].value == this.block.localName) {
					select.options[i].selected = true;
					return;
				}
			}

			var op = document.createElement('option');
			op.innerHTML = this.block.localName;
			op.selected = true;

			select.appendChild(op);
		}
	}, {
		key: 'redactorTemplate',
		get: function get() {
			return (this.getTextBlock() == 'undefined' ? 'Блок не подходит или не выбран для редактирования текста!' : '<nav>' + this.redactorNav + '</nav>\n\t\t\t\t\t' + (this.block.children.length == 0 ? '<textarea id="redactorTextarea">' + this.getTextBlock() + '</textarea>' : '')) + '\n\t\t';
		}
	}, {
		key: 'redactorNav',
		get: function get() {
			var _this3 = this;

			return this.redactorElements.reduce(function (list, el) {
				if (el.type == 'input') {
					list += '<div>\n\t\t\t\t\t\t' + (el.for ? '' + (el.for == _this3.block.localName ? '<label>' + el.title + ': </label>\n\t\t\t\t\t\t\t\t' + (el.type == 'input' ? '<input type="text" data-style="' + el.style + '" data-for="' + el.for + '" data-tag="' + el.tag + '"/>' : '') : '') : '<label>' + el.title + ': </label>\n\t\t\t\t\t\t\t' + (el.type == 'input' ? '<input type="text" data-style="' + el.style + '"/>' : '')) + '\n\t\t\t\t\t</div>';
				} else if (el.type == 'button') {
					list += '<div>\n\t\t\t\t\t\t\t<button data-style="' + el.style + '" data-value="' + el.value + '">' + el.title + '</button>\n\t\t\t\t\t\t</div>';
				} else if (el.type == 'select' && _this3.block.children.length == 0) {
					list += '<div>\n\t\t\t\t\t\t\t<span>' + el.title + '</span>\n\t\t\t\t\t\t\t<select>\n\t\t\t\t\t\t\t\t' + el.options.reduce(function (op, el) {
						op += '<option>' + el + '</option>';

						return op;
					}, '') + '\n\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t</div>';
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
			}, {
				title: 'src',
				for: 'img',
				tag: 'src',
				type: 'input'
			}, {
				title: 'Тэг',
				type: 'select',
				options: ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
			}];
		}
	}]);

	return Action;
}();