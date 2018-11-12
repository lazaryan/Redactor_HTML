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
			action: this.changeText.bind(this)
		}
	};
}

Setting.prototype = {
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

		for (var key in this.buttons) {
			block.appendChild(this.createButtons(key, this.buttons[key].action));
		}

		return block;
	},
	createButtons: function createButtons(name, action) {
		var block = document.createElement('div');
		block.classList.add('bth_button');
		block.style.display = 'inline-block';
		block.innerHTML = 'Изменить';
		block.dataset.name = name;
		block.dataset.typeName = 'setting';
		block.addEventListener('click', function (e) {
			return action(e);
		});

		return block;
	},
	changeText: function changeText() {
		var edit = this.el.getAttribute('contentEditable');
		if (edit == 'null') {
			this.el.setAttribute('contentEditable', 'true');
		} else {
			this.el.setAttribute('contentEditable', edit == 'true' ? 'false' : 'true');
		}
	}
};