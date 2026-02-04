import { kv } from '@vercel/kv';

export const config = {
    runtime: 'edge',
};

export default async function handler(request: Request) {
    const { method } = request;
    const url = new URL(request.url);
    const username = url.searchParams.get('username');

    if (!username) {
        return new Response('Username required', { status: 400 });
    }

    if (method === 'GET') {
        const data = await kv.get(`data:${username}`);
        return new Response(JSON.stringify(data || null), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    }

    if (method === 'POST') {
        const data = await request.json();
        await kv.set(`data:${username}`, data);
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    }

    return new Response('Method not allowed', { status: 405 });
}
