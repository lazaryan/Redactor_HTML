'use strict';

/**
 * класс Ajax запросов
 */

function myAjax() {}

myAjax.prototype = {
  save: function save(text) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../main.php', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("html=" + encodeURIComponent(text));

    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4) return;

      if (xhr.status != 200) {
        console.warn(xhr.status + ': ' + xhr.statusText);
      } else {}
    };
  }
};