// CloudFront calls handler by name; deployed by infra/modules/havesmrt/main.tf.
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
function handler(event) {
	var request = event.request;
	var uri = request.uri;

	// The site is prerendered as <path>.html (SvelteKit trailingSlash 'never'),
	// so <path>/ has no object and S3 answers 403. Send it to <path> with a 301,
	// keeping the query string (s-m-r-t.dev#339).
	if (uri.length > 1 && uri.endsWith('/')) {
		var location = uri.replace(/\/+$/, '') || '/';
		var qs = [];
		for (var key in request.querystring) {
			var param = request.querystring[key];
			var values = param.multiValue ? param.multiValue : [param];
			for (var i = 0; i < values.length; i++) {
				qs.push(values[i].value === '' ? key : key + '=' + values[i].value);
			}
		}
		if (qs.length) location += '?' + qs.join('&');
		return {
			statusCode: 301,
			statusDescription: 'Moved Permanently',
			headers: { location: { value: location }, 'cache-control': { value: 'public, max-age=3600' } }
		};
	}

	// The root page is index.html; everything else without an extension is <path>.html.
	if (uri === '/') {
		request.uri = '/index.html';
	} else if (!uri.includes('.')) {
		request.uri += '.html';
	}

	return request;
}
