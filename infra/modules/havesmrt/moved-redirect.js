// Appended to url-rewrite.js (renamed to rewriteRequest) by main.tf when
// redirect_to_new_domain is on. CloudFront calls handler by name.
/* global rewriteRequest */
var OLD_HOST = '__OLD_HOST__';
var NEW_HOST = '__NEW_HOST__';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
function handler(event) {
	var request = event.request;
	var header = request.headers && request.headers.host;
	// Exact match on the host, case-insensitive, ignoring a port suffix. Anything
	// else (the new host, the distribution's own name) takes the normal path.
	var host = header ? String(header.value).toLowerCase().replace(/:\d+$/, '') : '';
	if (host !== OLD_HOST) return rewriteRequest(event);

	// One 301 to the same path on the new host. The host is fixed, and leading
	// slashes (and backslashes, which browsers read as slashes) collapse so the
	// path never starts a protocol-relative Location. Trailing slashes go here
	// because pages are prerendered as <path>.html and the new host would
	// otherwise 301 again.
	var path = '/' + request.uri.replace(/^[/\\]+/, '').replace(/\/+$/, '');

	// CloudFront passes values still percent-encoded, so rebuild them raw.
	var qs = [];
	var querystring = request.querystring || {};
	for (var key in querystring) {
		var param = querystring[key];
		var values = param.multiValue ? param.multiValue : [param];
		for (var i = 0; i < values.length; i++) {
			qs.push(values[i].value === '' ? key : key + '=' + values[i].value);
		}
	}

	return {
		statusCode: 301,
		statusDescription: 'Moved Permanently',
		headers: {
			location: { value: 'https://' + NEW_HOST + path + (qs.length ? '?' + qs.join('&') : '') },
			'cache-control': { value: 'public, max-age=3600' }
		}
	};
}
