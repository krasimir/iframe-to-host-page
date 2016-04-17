document.querySelector('button').addEventListener('click', function () {
  getHostPageParam('myid', function (err, data) {
    console.log('param="' + data.value + '"');
  });
});