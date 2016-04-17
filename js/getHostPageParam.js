getHostPageParam = (function () {
  var messages = [];
  var listen = function(obj, evt, fnc) {
    if (obj.addEventListener) { // W3C model
      obj.addEventListener(evt, fnc, false);
      return true;
    } else if (obj.attachEvent) { // Microsoft model
      return obj.attachEvent('on' + evt, fnc);
    }
  };

  listen(window, 'message', function (event) {
    messages.forEach(function (m) { m(null, event.data); })
  });
  return function (param, callback) {
    var message = {
      type: '__tr',
      param: param
    };

    if (window.parent) {      
      messages.push(callback);
      window.parent.postMessage(message, '*');
    } else {
      callback({ error: 'No parent window.'})
    }
  }
})();