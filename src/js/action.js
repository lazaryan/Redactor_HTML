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
			let textarea = this.redactorText.querySelector('textarea');
			textarea.innerHTML = this.getTextBlock();

			if (textarea.innerHTML == 'блок имеет дочерние элементы!!!' ||
				textarea.innerHTML == 'блок не выбран') {
				textarea.disabled = 'disabled';
			} else {
				textarea.removeAttribute('disabled');
			}
		}
	}

	disactiveBlock () {
		if (this.block) this.block.classList.remove('redactorHTML__action-block');

		this.block = undefined;
	}

	redactor (nav) {
		this._redactor = true;

		this.redactorText = document.createElement('div');
		this.redactorText.classList = 'redactorHTML__redactor';
		this.redactorText.id = 'redactorText';

		this.redactorText.innerHTML = this.redactorTemplate;
		nav.appendChild(this.redactorText);

		let textarea = this.redactorText.querySelector('textarea');

		if (textarea.innerHTML == 'блок имеет дочерние элементы!!!' ||
			textarea.innerHTML == 'блок не выбран') {
			textarea.disabled = 'disabled';
			return;
		}

		this.addStyleForINput();

		textarea.addEventListener('keyup', () => this.changeTextBlock());
		textarea.addEventListener('input', () => this.changeTextBlock());
	}

	changeTextBlock () {
		let textarea = this.redactorText.querySelector('textarea');

		this.block.innerHTML = textarea.value;
	}

	getTextBlock () {
		if (this.block) {
			return this.block.children.length == 0 ? 
						this.block.innerHTML :
						`блок имеет дочерние элементы!!!`
		} else {
			return `блок не выбран`
		}
	}

	disactiveRedactor () {
		this.activeStyle();
		this._redactor = false;

		this.redactorText.parentNode.removeChild(this.redactorText);
		this.redactorText = undefined;
	}

	activeStyle () {
		let inputs = this.redactorText.querySelectorAll('input');

		for (let i = 0; i < inputs.length; i++) {
			if (inputs[i].value) {
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
			if (this.block.style[inputs[i].dataset.style]) {
				inputs[i].value = this.block.style[inputs[i].dataset.style]
			}
		}
	}

	get redactorTemplate () {
		return `
			<nav>${this.redactorNav}</nav>
			<textarea id="redactorTextarea">${this.getTextBlock()}</textarea>
		`
	}

	get redactorNav () {
		return this.redactorElements.reduce((list, el) => {
			list += `<div>
						<label>${el.title}: </label>
						${el.type == 'input' ? `<input type="text" data-style="${el.style}" />` : ''}
					</div>`;

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
				title: 'bgc',
				style: 'backgroundColor',
				type: 'input'
			},
			{
				title: 'fsz',
				style: 'font-size',
				type: 'input'
			}
		]
	}
}