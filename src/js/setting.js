/**
 * Объект для настроек
 */

function Setting () {
	this.el = undefined;
	this.nav = undefined;
	this.buttons = {
		changeText: {
			message: 'Редактировать текст',
			action: this.changeText.bind(this)
		}
	}
}

Setting.prototype = {
	init(el) {
		this.el = el ? el : this.el;

		this.addMenu();

		return this.el;
	},
	addMenu() {
		this.nav = this.createBlock();
		this.el.insertBefore(this.nav, this.el.firstChild);
	},
	removeMenu() {
		this.el.removeChild(this.el.firstChild);
		this.nav = undefined;
	},
	createBlock() {
		let block = document.createElement('div');
		block.classList = 'el__action-setting';
		
		for(let key in this.buttons) {
			block.appendChild(this.createButtons(key, this.buttons[key].action));
		}

		return block;
	},
	createButtons(name, action) {
		let block = document.createElement('div');
		block.classList.add('bth_button');
		block.style.display = 'inline-block';
		block.innerHTML = 'Изменить';
		block.dataset.name = name;
		block.dataset.typeName = 'setting';
		block.addEventListener('click', (e) => action(e));

		return block;
	},
	changeText () {
		let edit = this.el.getAttribute('contentEditable');
		if (edit == 'null') {
			this.el.setAttribute('contentEditable', 'true');
		} else {
			this.el.setAttribute('contentEditable', edit == 'true' ? 'false' : 'true');
		}
	}
}