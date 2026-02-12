import type { Handle } from '@sveltejs/kit';

function withNoStore(response: Response): Response {
	const headers = new Headers(response.headers);
	headers.set('cache-control', 'no-store, no-cache, must-revalidate, max-age=0');
	headers.set('pragma', 'no-cache');
	headers.set('expires', '0');

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	const contentType = response.headers.get('content-type') ?? '';
	const isHtml = contentType.includes('text/html');
	const isApi = event.url.pathname.startsWith('/api/');

	// Avoid stale HTML/API responses that can reference mismatched hashed assets.
	if (isHtml || isApi) {
		return withNoStore(response);
	}

	return response;
};
