/**
 * Загрузка на страницу всех необходимых стилей 
 */
;!function() {
	const style = 
	`
		.el_action {border: 3px solid #DAF449;}
		.el__action-setting {background-color: #DAF449; position: absolute; right: 0; z-index: 999;}
		.el__action-relative {position: relative}
		.bth_button {display: inline-block;font-size: 20px; max-height: 100%;}
	`;

	let style_block = document.createElement('style');
	style_block.innerHTML = style;
	document.querySelector('body').appendChild(style_block);
}();