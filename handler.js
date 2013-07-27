var router = require('./router');

var preHandler = function() {
  // TODO: decorate and pre-processing the response object
  //       to fill out the headers, including cookies, content-length,
  //       content-type by mime, cache-control (etag).
}

var preRouter = Object.create(router);
preRouter.add(/.*/, preHandler);