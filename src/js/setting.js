/**
 * Объект для настроек
 */

function Setting () {
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
		}
	}
}

Setting.prototype = {
	_changeStyle: false,
	_settingText: [
		'font-size',
		'color'
	],
	init (el) {
		this.el = el ? el : this.el;

		this.addMenu();

		return this.el;
	},
	addMenu () {
		this.nav = this.createBlock();
		this.el.insertBefore(this.nav, this.el.firstChild);
	},
	removeMenu () {
		this.el.removeChild(this.el.firstChild);
		this.nav = undefined;
	},
	createBlock () {
		let block = document.createElement('div');
		block.classList = 'el__action-setting';
		
		for(let key in this.buttons) {
			block.appendChild(this.createButtons(key, this.buttons[key].action));
		}

		return block;
	},
	createButtons (name, action) {
		let block = document.createElement('div');
		block.classList.add('bth_button');
		block.dataset.name = name;
		block.addEventListener('click', (e) => action(e));

		let img = document.createElement('img');
		img.src = this.buttons[name].label;
		img.classList.add('bth_button_img');

		block.appendChild(img);

		return block;
	},
	changeText () {
		let edit = this.el.getAttribute('contentEditable');
		if (edit == 'null') {
			this.el.setAttribute('contentEditable', 'true');
		} else {
			this.el.setAttribute('contentEditable', edit == 'true' ? 'false' : 'true');
		}
	},
	changeStyleText () {
		this._changeStyle = !this._changeStyle;

		if(this._changeStyle) {
			let template = document.createElement('div');
			template.classList = 'setting_style-text';
			template.innerHTML = 
			`
				<div>
					${this._settingText.reduce((s, e) => {
						s += `<p><label>${e}: </label><input type="text" /></p>`;

						return s;
					}, '')}
				</div>
			`;

			this.nav.appendChild(template);
		} else {
			let style = this.nav.querySelectorAll('input[type="text"]');

			for(let i = 0; i < style.length; i++) {
				if(style[i].value) {
					this.el.style[this._settingText[i]] = style[i].value;
				}
			}
			this.nav.removeChild(this.nav.lastChild);
		}
	}
}