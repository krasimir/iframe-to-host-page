(function () {
  function GETParam (val) {
    var result = null, tmp = [];
    var items = window.location.search.substr(1).split("&");
    for(var index = 0; index < items.length; index++) {
      tmp = items[index].split("=");
      if(tmp[0] === val) result = decodeURIComponent(tmp[1]);
    }
    return result;
  };
  function listen(obj, evt, fnc) {
    if (obj.addEventListener) { // W3C model
      obj.addEventListener(evt, fnc, false);
      return true;
    } else if (obj.attachEvent) { // Microsoft model
      return obj.attachEvent('on' + evt, fnc);
    }
  };
  listen(window, 'message', function (event) {
    if (event.data.type === '__tr') {
      event.source.postMessage({ value: GETParam(event.data.param) }, event.origin)
    }
  });
})();