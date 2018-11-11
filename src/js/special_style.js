/**
 * Загрузка на страницу всех необходимых стилей 
 */
;!function() {
	const style = 
	`
		.el_action {border: 3px solid #DAF449}
	`;

	let style_block = document.createElement('style');
	style_block.innerHTML = style;
	document.querySelector('body').appendChild(style_block);
}();