let setting = new Setting();
let action = new Action();
/**
 * Главный объект
 */
function Controller(el = undefined) {
	this.el = undefined;
	this.init(el);

	this.el.addEventListener('click', (e) => {
		if(!action.isBlock(e.target)) {
			action.clear();
		}
	});

	this.el.addEventListener('dblclick', (e) => {
		if (e.target != this.el) {
			action.init(e.target);
		}
	});
};

Controller.prototype = {
	init (el) {
		this.el = el ? typeof el == Object ? el : document.querySelector(el) : this.el ? this.el : document.querySelector('body');
	}
}