'use strict';

/**
 * Загрузка на страницу всех необходимых стилей 
 */
;!function () {
	var style = '\n\t\t.el_action {border: 3px solid #DAF449;}\n\t\t.el__action-setting {background-color: #DAF449; position: absolute; right: 0; z-index: 999;}\n\t\t.el__action-relative {position: relative}\n\t\t.bth_button {display: inline-block; max-height: 100%; min-height: 30px; border: 2px solid #222; padding: 5px; box-sizing: border-box;}\n\t\t.bth_button_img {height: 30px;}\n\t';

	var style_block = document.createElement('style');
	style_block.innerHTML = style;
	document.querySelector('body').appendChild(style_block);
}();