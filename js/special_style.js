'use strict';

/**
 * Загрузка на страницу всех необходимых стилей 
 */
;!function () {
	var style = '\n\t\t.el_action {border: 3px solid #DAF449}\n\t';

	var style_block = document.createElement('style');
	style_block.innerHTML = style;
	document.querySelector('body').appendChild(style_block);
}();