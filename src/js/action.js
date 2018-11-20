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
			this.addValueForSelect();

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

	changeTag () {
		let select = this.redactorText ? this.redactorText.querySelector('select') : false;

		if (!select || select.value == this.block.localname) return;

		let newNode = document.createElement(select.value);

		this.block.parentNode.insertBefore(newNode, this.block);

		for(let i = 0, attrs = this.block.attributes, count = attrs.length; i < count; i++) {
			newNode.setAttribute(attrs[i].name, attrs[i].value);
		}

		newNode.innerHTML = this.block.innerHTML;

		this.block.parentNode.removeChild(this.block);

		this.block = newNode;
	}

	getTextBlock () {
		return this.block ? this.block.innerHTML :  'undefined'
	}

	disactiveRedactor () {
		this.activeStyle();
		this.changeTag();
		this._redactor = false;

		this.redactorText.parentNode.removeChild(this.redactorText);
		this.redactorText = undefined;
	}

	activeStyle () {
		if (!this._redactor) return;

		let inputs = this.redactorText.querySelectorAll('input');

		for (let i = 0; i < inputs.length; i++) {
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

	save () {
		this.activeStyle();
		this.changeTag();

		let path = window.location.pathname;
		if(path == '\/') path = this.main.data['defaul_index_file'];

		let text = this.getTextFiles();

		let xhr = new XMLHttpRequest();

 		xhr.open('POST', this.main.data.path + this.main.data["name_file"], true);
 		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    	xhr.send("path="+path+"&&html="+text+"&&key="+this.main.data.key.toString());

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
			if (!inputs[i].dataset.for) {
				inputs[i].value = window.getComputedStyle(this.block)[inputs[i].dataset.style]
			} else {
				inputs[i].value = this.block[inputs[i].dataset.tag]
			}
		}
	}

	addValueForSelect () {
		let select = this.redactorText.querySelector('select');

		for (let i = 0; i < select.options.length; i++) {
			if (select.options[i].value == this.block.localName) {
				select.options[i].selected = true;
				return;
			}
		}

		let op = document.createElement('option');
		op.innerHTML = this.block.localName;
		op.selected = true;

		select.appendChild(op);
	}

	get redactorTemplate () {
		return `${this.getTextBlock() == `undefined`?
					'Блок не подходит или не выбран для редактирования текста!':
					`<nav>${this.redactorNav}</nav>
					${this.block.children.length == 0 && this.block.localName != 'img' ? `<textarea id="redactorTextarea">${this.getTextBlock()}</textarea>`: ''}`}
		`
	}

	get redactorNav () {
		return this.redactorElements.reduce((list, el) => {
			if (el.type == 'input') {
				list += `<div>
						${el.for ? 
							`${el.for == this.block.localName ? 
								`<label>${el.title}: </label>
								${el.type == 'input' ? `<input type="text" data-style="${el.style}" data-for="${el.for}" data-tag="${el.tag}"/>` : ''}`: ''}`:
							`<label>${el.title}: </label>
							${el.type == 'input' ? `<input type="text" data-style="${el.style}"/>` : ''}`
						}
					</div>`
			} else if (el.type == 'button')	{
				list += `<div>
							<button data-style="${el.style}" data-value="${el.value}">${el.title}</button>
						</div>`
			} else if (el.type == 'select' && this.block.children.length == 0 && this.block.localName != 'img') {
				list += `<div>
							<span>${el.title}: </span>
							<select>
								${el.options.reduce((op, el) => {
									op += `<option>${el}</option>`;

									return op;
								}, '')}
							</select>
						</div>`
			}

			return list;		
		}, '');
	}

	get redactorElements () {
		return [
			{
				title: 'цвет текста',
				style: 'color',
				type: 'input'
			},
			{
				title: 'фон',
				style: 'background',
				type: 'input',
			},
			{
				title: 'размер шрифта',
				style: 'fontSize',
				type: 'input'
			},
			{
				title: 'путь картинки',
				for: 'img',
				tag: 'src',
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
			},
			{
				title: 'тэг',
				type: 'select',
				options: [
					'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
				]
			}
		]
	}
}
