/**
  * класс меню управления страницей
  */

class Nav {
	constructor (main, el) {
		this.main = main;
		this.initBody(el);
		this.initState();

		this.createNav();
		this.createEventsClick();
	}

	initBody (el) {
		this.el = el;
	}

	initState () {
		this.state = {};
		this.block = undefined;

		for(const key in this.buttons) {
			this.state[key] = false;
		}
	}

	createNav () {
		this.nav = document.createElement('div');
		this.nav.classList = 'redactorHTML__nav';
		this.nav.id = 'redactorHTML';

		this.appendButtons(this.nav);

		this.nav.addEventListener('click', (e) => {
			if (e.target.classList.contains('redactorHTML__button')) {
				let el = e.target;

				if (el.dataset.name != 'save') {
					el.classList.toggle('redactorHTML__button_action');
					this.state[el.dataset.name] = !this.state[el.dataset.name];
				} else {
					this.state[el.dataset.name] = true;
				}

				if (el.dataset.name == 'action') {
					if (!this.state[el.dataset.name] && this.buttons[el.dataset.name].disactive) {
						this.buttons[el.dataset.name].disactive();
					}
				} else {
					if (this.state[el.dataset.name]) {
						this.buttons[el.dataset.name].action();
					} else if (this.buttons[el.dataset.name].disactive) {
						this.buttons[el.dataset.name].disactive();
					}
				}
			}
		})

		document.querySelector('body').appendChild(this.nav);
	}

	createEventsClick () {
		this.el.addEventListener('dblclick', (e) => {
			if (this.isElement(e.target)) {
				if (this.state['action']) this.buttons['action'].action(e.target);
			}
		});
	}

	appendButtons (el) {
		for(const key in this.buttons) {
			let button = document.createElement('button');
			button.classList = 'redactorHTML__button'
			button.dataset.name = this.buttons[key].name;
			button.innerHTML = this.buttons[key].title;

			el.appendChild(button);
		}
	}

	isElement (el) {
		return el != this.el && (el != this.nav && !this.nav.contains(el))
	}

	get State () {
		for(let state in this.state) {
			if (this.state[state]) return state
		}

		return false;
	}

	get buttons () {
		return {
			action: {
				name: 'action',
				title: 'Выбрать',
				description: 'Выбрать блок',
				event: 'dblclick',
				action: (el) => this.main.action.choseBlock(el),
				disactive: () => this.main.action.disactiveBlock()
			},
			redactor: {
				name: 'redactor',
				title: 'Изменить',
				description: 'изменить текст',
				event: 'click',
				action: () => this.main.action.redactor(this.nav),
				disactive: () => this.main.action.disactiveRedactor()
			},
			save: {
				name: 'save',
				title: 'Сохранить',
				description: 'Сохранить изменения',
				event: 'click',
				action: () => this.main.action.save()
			}
		}
	}
}