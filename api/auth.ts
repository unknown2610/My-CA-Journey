import { kv } from '@vercel/kv';

export const config = {
    runtime: 'edge',
};

export default async function handler(request: Request) {
    const { action, username, password } = await request.json();

    if (action === 'signup') {
        const existing = await kv.hget('users', username);
        if (existing) {
            return new Response(JSON.stringify({ error: 'Username already exists' }), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }
        await kv.hset('users', { [username]: password });
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    }

    if (action === 'login') {
        const storedPassword = await kv.hget('users', username);
        if (storedPassword === password) {
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
            status: 401,
            headers: { 'content-type': 'application/json' },
        });
    }

    return new Response('Invalid action', { status: 400 });
}
