var handle = require('./handle'),
	vows = require('vows'),
	assert = require('assert'),
	http = require('http'),
	events = require('events');

var options = {
	host:'localhost',
	port:8888,
	path:'/',
	method:'get'
}

http.createServer(function(req, res) {
	handle.preHandler(req,res);
	res.write('a');
	res.end();
}).listen(8888);

vows.describe('write response headers').addBatch({
	'handle work, when request \'localhost:8888/\'': {
		topic: function() {
			var promise = new(events.EventEmitter);
			var req = http.get(options, function(res) {
				promise.emit('success', res);
			});
			req.end();
			return promise;
		},
		'should respond with a 200 OK':function(res) {
			assert.equal(res.statusCode, 200);
		},
		'mimetype is \'text/html\'': function(res) {
			assert.equal(res.headers['content-type'], 'text/html');
		},
		'cookie has been set': function(res) {
			assert.isArray(res.headers['set-cookie']);
		}
	},
	'handle work, when request\'localhost:8888/test.js\'':{
		topic: function(){
			var promise = new(events.EventEmitter);
			options.path = '/test.js'
			var req = http.get(options, function(res) {
				promise.emit('success', res);
			});
			req.end();
			return promise;
		},
		'should respond with a 200 OK': function(res) {
			assert.equal(res.statusCode, 200);
		},
		'mimetype is \'application/x-javascript\'': function(res) {
			assert.equal(res.headers['content-type'], 'application/x-javascript')
		},
		'get Content-Length': function(res) {
			assert.isString(res.headers['content-length']);
		}
	}
}).export(module);