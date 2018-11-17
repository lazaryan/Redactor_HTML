'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
  * класс меню управления страницей
  */

var Nav = function () {
	function Nav(main, el) {
		_classCallCheck(this, Nav);

		this.main = main;
		this.initBody(el);
		this.initState();

		this.createNav();
		this.createEventsClick();

		this.action = new Action();
	}

	_createClass(Nav, [{
		key: 'initBody',
		value: function initBody(el) {
			this.el = el;
		}
	}, {
		key: 'initState',
		value: function initState() {
			this.state = {};
			this.block = undefined;

			for (var key in this.buttons) {
				this.state[key] = false;
			}
		}
	}, {
		key: 'createNav',
		value: function createNav() {
			var _this = this;

			this.nav = document.createElement('div');
			this.nav.classList = 'redactorHTML__nav';
			this.nav.id = 'redactorHTML';

			this.appendButtons(this.nav);

			this.nav.addEventListener('click', function (e) {
				if (e.target.classList.contains('redactorHTML__button')) {
					var el = e.target;

					if (el.dataset.name != 'save') {
						el.classList.toggle('redactorHTML__button_action');
						_this.state[el.dataset.name] = !_this.state[el.dataset.name];
					} else {
						_this.state[el.dataset.name] = true;
					}

					if (el.dataset.name == 'action') {
						if (!_this.state[el.dataset.name] && _this.buttons[el.dataset.name].disactive) {
							_this.buttons[el.dataset.name].disactive();
						}
					} else {
						if (_this.state[el.dataset.name]) {
							_this.buttons[el.dataset.name].action();
						} else if (_this.buttons[el.dataset.name].disactive) {
							_this.buttons[el.dataset.name].disactive();
						}
					}
				}
			});

			document.querySelector('body').appendChild(this.nav);
		}
	}, {
		key: 'createEventsClick',
		value: function createEventsClick() {
			var _this2 = this;

			this.el.addEventListener('dblclick', function (e) {
				if (_this2.isElement(e.target)) {
					if (_this2.state['action']) _this2.buttons['action'].action(e.target);
				}
			});
		}
	}, {
		key: 'appendButtons',
		value: function appendButtons(el) {
			for (var key in this.buttons) {
				var button = document.createElement('button');
				button.classList = 'redactorHTML__button';
				button.dataset.name = this.buttons[key].name;
				button.innerHTML = this.buttons[key].title;

				el.appendChild(button);
			}
		}
	}, {
		key: 'isElement',
		value: function isElement(el) {
			return el != this.el && el != this.nav && !this.nav.contains(el);
		}
	}, {
		key: 'State',
		get: function get() {
			for (var state in this.state) {
				if (this.state[state]) return state;
			}

			return false;
		}
	}, {
		key: 'buttons',
		get: function get() {
			var _this3 = this;

			return {
				action: {
					name: 'action',
					title: 'Выбрать',
					description: 'Выбрать блок',
					event: 'dblclick',
					action: function action(el) {
						return _this3.main.action.choseBlock(el);
					},
					disactive: function disactive() {
						return _this3.main.action.disactiveBlock();
					}
				},
				redactor: {
					name: 'redactor',
					title: 'Изменить',
					description: 'изменить текст',
					event: 'click',
					action: function action() {
						return _this3.main.action.redactor(_this3.nav);
					},
					disactive: function disactive() {
						return _this3.main.action.disactiveRedactor();
					}
				},
				save: {
					name: 'save',
					title: 'Сохранить',
					description: 'Сохранить изменения',
					event: 'click',
					action: function action() {
						return _this3.main.action.save();
					}
				}
			};
		}
	}]);

	return Nav;
}();