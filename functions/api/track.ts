export async function onRequestGet(context) {
    try {
        const { request, env } = context;
        const url = new URL(request.url);
        const phone = url.searchParams.get('phone');
        const name = url.searchParams.get('name');

        if (!phone || !name) {
            return new Response(JSON.stringify({ error: 'Phone and name are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { results } = await env.DB.prepare(
            'SELECT id, name, phone, email, size, quantity, address, status, created_at FROM bookings WHERE phone = ? AND name = ? ORDER BY created_at DESC'
        ).bind(phone, name).all();

        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
