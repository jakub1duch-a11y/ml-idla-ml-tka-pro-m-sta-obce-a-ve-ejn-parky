import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const ALLOWED_EMAIL = 'jakub1duch@gmail.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const me = await base44.auth.me().catch(() => null);
    if (!me || String(me.email || '').toLowerCase() !== ALLOWED_EMAIL) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (me.role === 'admin') return Response.json({ ok: true, already_admin: true, user: me });

    const users = await base44.asServiceRole.entities.User.filter({ email: ALLOWED_EMAIL });
    const user = users?.find((item) => String(item.email || '').toLowerCase() === ALLOWED_EMAIL);
    if (!user?.id) return Response.json({ error: 'User record not found. Sign in once with Google or email first.' }, { status: 404 });

    const updated = await base44.asServiceRole.entities.User.update(user.id, { role: 'admin' });
    return Response.json({ ok: true, promoted: true, user: updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
