var url, querystring, mime;

url = require('url');
querystring = require('querystring');
mime = require('./mime');

var eTag, EXPIRE;

function getCookie (cookies) {
	var cookie;
	cookie = cookies;
	cookie = querystring.stringify(cookie, ';', '=');
	return cookie;
}

var preHandler = function (req, res) {
	var cookies, extention;
 
    req.path = req.url.match(/\.\w+$/);
	cookies = querystring.parse(req.headers.cookie, ';');
	extention = req.path ? req.path : '.html';

	res.setHeader('Content-Type' , mime.type(extention));
		//	set Content-Type.
	res.setHeader('Set-Cookie', getCookie(cookies));
		//	set Cookie.
	eTag = '';
	res.setHeader('Etag', eTag);
	if (eTag!=='' && req.headers['if-none-match'] === eTag) {
		res.statusCode = 304;
	}
	else{
		res.statusCode = 200;
	}
		//	Cache-Control by Etag.	And control the statuscode.
	res._write = res.write;
	res.write = function (data) {
		res.setHeader('Content-Length', Buffer.length);
			//	set Content-Length.
		res._write(data);
	}
}

exports.preHandler = preHandler;