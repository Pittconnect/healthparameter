/*------------------------------------------------------------------
jQuery document ready
-------------------------------------------------------------------*/
$(document).ready(function () {
  "use strict";
  if (jQuery.isFunction(jQuery.fn.scrolla)) {
    $(".animate").scrolla();
  }
});
