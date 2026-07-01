import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import webpush from 'npm:web-push@3.6.7';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { event, data } = body;
    if (!data || !event) return Response.json({ error: 'No data provided' }, { status: 400 });

    let title = 'Mlžidla.cz';
    let message = '';
    let url = '/';

    if (event.entity_name === 'BlogPost') {
      if (data.published !== true) return Response.json({ skipped: true });
      title = 'Nový článek na blogu';
      message = data.title || '';
      url = `/blog/${data.slug || ''}`;
    } else if (event.entity_name === 'Realizace') {
      if (data.published !== true) return Response.json({ skipped: true });
      title = 'Nová reference';
      message = data.name || '';
      url = `/reference/${data.id || ''}`;
    } else if (event.entity_name === 'Product') {
      title = 'Nový produkt';
      message = data.name || '';
      url = `/produkt/${data.slug || ''}`;
    } else {
      return Response.json({ skipped: true });
    }

    const publicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const privateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    if (!publicKey || !privateKey) {
      return Response.json({ error: 'VAPID keys not configured' }, { status: 500 });
    }
    webpush.setVapidDetails('mailto:obchod1@holmtec.cz', publicKey, privateKey);

    const subs = await base44.asServiceRole.entities.PushSubscription.list();
    const payload = JSON.stringify({ title, body: message, url });

    const results = await Promise.all(subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        return { ok: true };
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await base44.asServiceRole.entities.PushSubscription.delete(sub.id);
        }
        return { ok: false, error: err.message };
      }
    }));

    return Response.json({ sent: results.filter((r) => r.ok).length, total: subs.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});