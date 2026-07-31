import type { APIRoute } from 'astro';

export const prerender = false;

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

type CacheEntry = {
	status: number;
	data: unknown;
	expiresAt: number;
	generatedAt: string;
};

const cache = new Map<string, CacheEntry>();

function isValidUsername(u: string) {
	// Allow common GitHub username characters (alphanumeric and hyphen)
	return /^[a-zA-Z0-9-]+$/.test(u);
}

export const GET: APIRoute = async ({ params }) => {
	const username = params?.username;
	if (!username || typeof username !== 'string' || !isValidUsername(username)) {
		return new Response(JSON.stringify({ error: 'Invalid username' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const now = Date.now();
	const cached = cache.get(username);
	if (cached && cached.expiresAt > now) {
		return new Response(
			JSON.stringify({ username, generated_at: cached.generatedAt, cached: true, data: cached.data }),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	if (cached) cache.delete(username);

	const upstreamUrl = `https://github.com/${encodeURIComponent(username)}.contribs`;
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 10_000);

	const headers: Record<string, string> = {
		'User-Agent': 'mona-mayhem/1 (+https://github.com)',
		Accept: 'application/json',
	};
	const token = process.env.GITHUB_TOKEN;
	if (token) headers.Authorization = `Bearer ${token}`;

	try {
		const res = await fetch(upstreamUrl, { signal: controller.signal, headers });
		clearTimeout(timeout);

		if (res.status === 200) {
			const json = await res.json();
			const generatedAt = new Date().toISOString();
			cache.set(username, { status: 200, data: json, expiresAt: now + CACHE_TTL_MS, generatedAt });
			return new Response(JSON.stringify({ username, generated_at: generatedAt, cached: false, data: json }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} else if (res.status === 404) {
			return new Response(JSON.stringify({ error: 'Not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		} else if (res.status === 429) {
			const ra = res.headers.get('Retry-After');
			const outHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
			if (ra) outHeaders['Retry-After'] = ra;
			return new Response(JSON.stringify({ error: 'Rate limited' }), { status: 429, headers: outHeaders });
		} else if (res.status >= 500) {
			return new Response(JSON.stringify({ error: 'Upstream error' }), {
				status: 502,
				headers: { 'Content-Type': 'application/json' },
			});
		} else {
			const text = await res.text();
			console.error(`Unexpected upstream status ${res.status}: ${text}`);
			return new Response(JSON.stringify({ error: 'Unexpected upstream response', status: res.status }), {
				status: 502,
				headers: { 'Content-Type': 'application/json' },
			});
		}
	} catch (err: unknown) {
		clearTimeout(timeout);
		const e = err as any;
		if (e?.name === 'AbortError') {
			return new Response(JSON.stringify({ error: 'Upstream timeout' }), {
				status: 504,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		console.error('Fetch error for', username, e?.message ?? e);
		return new Response(JSON.stringify({ error: 'Network error' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
