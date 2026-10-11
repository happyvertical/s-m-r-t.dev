// CloudFront invokes this global entrypoint.
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
function handler(event) {
	var request = event.request;
	var uri = request.uri;

	// The packaged planner uses directory-style prerendered pages. Keep files
	// untouched so missing assets still reach the origin and remain real 404s.
	if (uri === '/plan') {
		request.uri = '/plan/index.html';
	} else if (uri.startsWith('/plan/') && !uri.split('/').pop().includes('.')) {
		request.uri += uri.endsWith('/') ? 'index.html' : '/index.html';
	} else if (uri.endsWith('/')) {
		request.uri += 'index.html';
	} else if (!uri.includes('.')) {
		request.uri += '.html';
	}

	return request;
}
