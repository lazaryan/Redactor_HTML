/**
  * Класс управления страницей
  */

class Action {
	constructor (main) {
		this.main = main;
		this.block = undefined;

		this._redactor = false;
		this.redactorText = undefined;
	}

	choseBlock (el) {
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

	disactiveBlock () {
		if (this.block) {
			this.block.classList.remove('redactorHTML__action-block');

			this.block = undefined;

			if (this.redactorText) {
				this.redactorText.innerHTML = this.redactorTemplate;
			}
		}
	}

	redactor (nav) {
		this._redactor = true;

		this.redactorText = document.createElement('div');
		this.redactorText.classList = 'redactorHTML__redactor';
		this.redactorText.id = 'redactorText';

		this.redactorText.innerHTML = this.redactorTemplate;
		nav.appendChild(this.redactorText);

		this.addEventTextarea();
		this.addEventButton();
	}

	addEventTextarea () {
		let textarea = this.redactorText.querySelector('textarea');
		if (textarea){
			this.addStyleForINput();

			textarea.addEventListener('keyup', () => this.changeTextBlock());
			textarea.addEventListener('input', () => this.changeTextBlock());
		}
	}

	addEventButton () {
		let buttons  = this.redactorText.querySelectorAll('button');
		if (!buttons) return;

		for(let i = 0; i < buttons.length; i++) {
			buttons[i].addEventListener('click', (e) => this.changeStyleForButton(e.target))
		}
	}

	changeStyleForButton (el) {
		el.classList.toggle('redactorHTML__button_action-style');

		if (el.classList.contains('redactorHTML__button_action-style')) {
			this.block.style[el.dataset.style] = el.dataset.value;
		} else {
			this.block.style[el.dataset.style] = '';
		}
	}

	changeTextBlock () {
		let textarea = this.redactorText.querySelector('textarea');

		this.block.innerHTML = textarea.value;
	}

	getTextBlock () {
		return this.block ? this.block.innerHTML :  'undefined'
	}

	disactiveRedactor () {
		this.activeStyle();
		this._redactor = false;

		this.redactorText.parentNode.removeChild(this.redactorText);
		this.redactorText = undefined;
	}

	activeStyle () {
		if (!this._redactor) return;

		let inputs = this.redactorText.querySelectorAll('input');

		for (let i = 0; i < inputs.length; i++) {
			if (inputs[i].value && inputs[i].value != window.getComputedStyle(this.block)[inputs[i].dataset.style]) {
				this.block.style[inputs[i].dataset.style] = inputs[i].value;
			}
		}
	}

	save () {
		this.activeStyle();

		let path = window.location.pathname;
		if(path == '\/') path = 'index.html';

		let text = this.getTextFiles();

		let xhr = new XMLHttpRequest();

 		xhr.open('POST', '../main.php', true);
 		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    	xhr.send("path="+path+"&&"+"html=" + encodeURIComponent(text));

 		xhr.onreadystatechange = function() {
  			if (xhr.readyState != 4) return;

  			if (xhr.status != 200) {
    			console.warn(xhr.status + ': ' + xhr.statusText);
  			} else {}
		}
	}

	getTextFiles () {
		let block = document.querySelector('html').cloneNode(true);

		block.querySelector('#redactorHTML').parentNode.removeChild(block.querySelector('#redactorHTML'));

		let redactor_link = block.querySelectorAll('.RedactorHTML_link');
		for (let i = 0; i < redactor_link.length; i++) {
			block.querySelector('body').removeChild(redactor_link[i]);
		}

		let block_action = block.querySelector('.redactorHTML__action-block');
		if (block_action) {
			block_action.classList.remove('redactorHTML__action-block');
		}

		return block.innerHTML;
	}

	addStyleForINput () {
		let inputs = this.redactorText.querySelectorAll('input');

		for (let i = 0; i < inputs.length; i++) {
			inputs[i].value = window.getComputedStyle(this.block)[inputs[i].dataset.style]
		}
	}

	get redactorTemplate () {
		return `${this.getTextBlock() == `undefined`?
					'Блок не подходит или не выбран для редактирования текста!':
					`<nav>${this.redactorNav}</nav>
					${this.block.children.length == 0 ? `<textarea id="redactorTextarea">${this.getTextBlock()}</textarea>`: ''}`}
		`
	}

	get redactorNav () {
		return this.redactorElements.reduce((list, el) => {
			if (el.type == 'input') {
				list += `<div>
						<label>${el.title}: </label>
						${el.type == 'input' ? `<input type="text" data-style="${el.style}" />` : ''}
					</div>`;
			} else if (el.type == 'button')	{
				list += `<div>
							<button data-style="${el.style}" data-value="${el.value}">${el.title}</button>
						</div>`
			}

			return list;		
		}, '');
	}

	get redactorElements () {
		return [
			{
				title: 'colorText',
				style: 'color',
				type: 'input'
			},
			{
				title: 'backgroundColor',
				style: 'backgroundColor',
				type: 'input',
			},
			{
				title: 'font-size',
				style: 'fontSize',
				type: 'input'
			},
			{
				title: 'Жирный',
				style: 'fontWeight',
				value: 'bold',
				type: 'button'
			},
			{
				title: 'Курсив',
				style: 'fontStyle',
				value: 'italic',
				type: 'button'
			}
		]
	}
}