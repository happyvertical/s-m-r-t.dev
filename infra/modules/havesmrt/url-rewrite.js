// CloudFront invokes this global entrypoint.
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
function handler(event) {
	var request = event.request;
	var uri = request.uri;

	// Keep the directory URL canonical so the package index resolves its
	// relative assets below /plan/. A generated redirect must serialize queries.
	if (uri === '/plan') {
		var query = [];
		var querystring = request.querystring || {};
		for (var name in querystring) {
			if (Object.prototype.hasOwnProperty.call(querystring, name)) {
				var entry = querystring[name];
				var values = entry.multiValue || [entry];
				for (var index = 0; index < values.length; index += 1) {
					query.push(encodeURIComponent(name) + '=' + encodeURIComponent(values[index].value));
				}
			}
		}
		return {
			statusCode: 308,
			statusDescription: 'Permanent Redirect',
			headers: {
				location: { value: '/plan/' + (query.length ? '?' + query.join('&') : '') }
			}
		};
	}

	// The packaged planner owns its client-side fallback. Keep files untouched
	// so missing assets still reach the origin and remain real 404s.
	if (uri === '/plan/') {
		request.uri = '/plan/index.html';
	} else if (uri.startsWith('/plan/') && !uri.split('/').pop().includes('.')) {
		request.uri = '/plan/404.html';
	} else if (uri.endsWith('/')) {
		request.uri += 'index.html';
	} else if (!uri.includes('.')) {
		request.uri += '.html';
	}

	return request;
}
