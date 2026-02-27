export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { name, phone, email, items, address, transferRef } = body;

    if (!name || !phone || !email || !items || !items.length || !address) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert into D1 using batch
    const stmt = env.DB.prepare(
      'INSERT INTO bookings (name, phone, email, size, quantity, address, transfer_ref, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );

    const batch = items.map(item =>
      stmt.bind(name, phone, email, item.size, item.quantity, address, transferRef || null, 'pending', new Date().toISOString())
    );

    await env.DB.batch(batch);

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
