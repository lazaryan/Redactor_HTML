'use strict';

/**
 * Загрузка на страницу всех необходимых стилей 
 */
;!function () {
	var style = '\n\t\t.el_action {border: 3px solid #DAF449;}\n\t\t.el__action-setting {background-color: #DAF449; position: absolute; right: 0; z-index: 999;}\n\t\t.el__action-relative {position: relative}\n\t\t.bth_button {display: inline-block;font-size: 20px; max-height: 100%;}\n\t';

	var style_block = document.createElement('style');
	style_block.innerHTML = style;
	document.querySelector('body').appendChild(style_block);
}();