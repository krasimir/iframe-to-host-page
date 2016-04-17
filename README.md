# iframe-to-host-page

An example of iframe to/from host page communication using [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

The exercise was accessing a GET parameter of the host page's URL. If we serve a third party widget we'll probably not be able to do that because the domains of the iframe page and the host page do not match.

Inside the iframe:

```js
getHostPageParam('myid', function (err, data) {
  console.log('param="' + data.value + '"');
});
```

Where `getHostPageParam` is as follows:

```js
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
```

In the host page:

```js
(function () {
  function param (val) {
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
      event.source.postMessage({ value: param(event.data.param) }, event.origin)
    }
  });
})();
```

There are minified versions of the scripts under the `build` directory.
