export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { name, phone, size, quantity, address } = body;

    if (!name || !phone || !size || !quantity || !address) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert into D1
    await env.DB.prepare(
      'INSERT INTO bookings (name, phone, size, quantity, address, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    )
      .bind(name, phone, size, quantity, address, new Date().toISOString())
      .run();

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
