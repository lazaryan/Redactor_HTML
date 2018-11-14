'use strict';

/**
 * Объект для настроек
 */

function Setting() {
	this.el = undefined;
	this.nav = undefined;

	this.buttons = {
		changeText: {
			message: 'Редактировать текст',
			label: './img/edit.svg',
			action: this.changeText.bind(this)
		},
		changeStyleText: {
			message: 'Изменить стили текста',
			label: './img/paint-brush.svg',
			action: this.changeStyleText.bind(this)
		},
		saveChange: {
			message: 'Сохранить',
			label: './img/paint-brush.svg',
			action: this.saveChange.bind(this)
		}
	};
}

Setting.prototype = {
	_changeStyle: false,
	_settingText: ['font-size', 'color'],
	init: function init(el) {
		this.el = el ? el : this.el;

		this.addMenu();

		return this.el;
	},
	addMenu: function addMenu() {
		this.nav = this.createBlock();
		this.el.insertBefore(this.nav, this.el.firstChild);
	},
	removeMenu: function removeMenu() {
		this.el.removeChild(this.el.firstChild);
		this.nav = undefined;
	},
	createBlock: function createBlock() {
		var block = document.createElement('div');
		block.classList = 'el__action-setting';
		block.id = 'settingId';

		for (var key in this.buttons) {
			block.appendChild(this.createButtons(key, this.buttons[key].action));
		}

		return block;
	},
	createButtons: function createButtons(name, action) {
		var block = document.createElement('div');
		block.classList.add('bth_button');
		block.dataset.name = name;
		block.addEventListener('click', function (e) {
			return action(e);
		});

		var img = document.createElement('img');
		img.src = this.buttons[name].label;
		img.classList.add('bth_button_img');

		block.appendChild(img);

		return block;
	},
	changeText: function changeText() {
		var edit = this.el.getAttribute('contentEditable');
		if (edit == 'null') {
			this.el.setAttribute('contentEditable', 'true');
		} else {
			this.el.setAttribute('contentEditable', edit == 'true' ? 'false' : 'true');
		}
	},
	changeStyleText: function changeStyleText() {
		this._changeStyle = !this._changeStyle;

		if (this._changeStyle) {
			var template = document.createElement('div');
			template.classList = 'setting_style-text';
			template.innerHTML = '\n\t\t\t\t<div>\n\t\t\t\t\t' + this._settingText.reduce(function (s, e) {
				s += '<p><label>' + e + ': </label><input type="text" /></p>';

				return s;
			}, '') + '\n\t\t\t\t</div>\n\t\t\t';

			this.nav.appendChild(template);
		} else {
			var style = this.nav.querySelectorAll('input[type="text"]');

			for (var i = 0; i < style.length; i++) {
				if (style[i].value) {
					this.el.style[this._settingText[i]] = style[i].value;
				}
			}
			this.nav.removeChild(this.nav.lastChild);
		}
	},
	saveChange: function saveChange() {
		var doc = document.createElement('html');
		doc.innerHTML = document.querySelector('html').innerHTML;
		doc.querySelector('.el_action').classList.remove('el_action');
		doc.querySelector('.el__action-relative').classList.remove('el__action-relative');
		doc.querySelector('#settingId').parentNode.removeChild(doc.querySelector('#settingId'));
		doc.querySelector('#specialStyle').parentNode.removeChild(doc.querySelector('#specialStyle'));

		ajax.save(doc.innerHTML);
	}
};