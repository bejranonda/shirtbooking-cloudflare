export async function onRequestPut(context) {
    try {
        const { request, env } = context;
        const body = await request.json();
        const { id, status, pw } = body;

        const adminPassword = env.ADMIN_PASSWORD || 'ChangeMeInCloudflareDashboard';

        if (pw !== adminPassword) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered'];
        if (!validStatuses.includes(status)) {
            return new Response(JSON.stringify({ error: 'Invalid status' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!id) {
            return new Response(JSON.stringify({ error: 'Booking ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await env.DB.prepare(
            'UPDATE bookings SET status = ? WHERE id = ?'
        ).bind(status, id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
