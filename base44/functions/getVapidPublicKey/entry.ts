Deno.serve(async (req) => {
  try {
    const publicKey = Deno.env.get('VAPID_PUBLIC_KEY') || '';
    return Response.json({ publicKey });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});