import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Diagnostika dostupnosti Canva Connect z Base44, bez vracení přístupových údajů.
// Canva v ChatGPT je jiná autorizace než Canva API na serveru Base44.
Deno.serve(async (req: Request) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const hasClient = Boolean(Deno.env.get('CANVA_CLIENT_ID'));
    const hasSecret = Boolean(Deno.env.get('CANVA_CLIENT_SECRET'));
    // Nezaměňovat pouhé nastavení klientských údajů s platnou OAuth autorizací.
    const connected = false;
    return Response.json({
      ok: true,
      provider: 'canva',
      native_connector_supported: false,
      has_canva_client_registration: hasClient && hasSecret,
      oauth_connected: connected,
      canva_autoexport_enabled: false,
      canva_autofill_enabled: false,
      fallback_mode: 'manual_export_and_verified_upload',
      next_action: !hasClient || !hasSecret
        ? 'V Canva Developer Portal vytvořte OAuth Connect integraci a uložte Client ID a Client Secret do Base44 Secrets.'
        : 'Dokončete OAuth přihlášení Canvy pro Base44. Client ID/Secret samy o sobě nepovolují přístup k uživatelským návrhům.',
      authorization_docs: 'https://www.canva.dev/docs/apps/rest-apis/authentication/',
      template_url: 'https://www.canva.com/brand/brand-templates/EAHZVIjydfU',
    }, { headers: { 'Cache-Control':'no-store' } });
  } catch (error) {
    return Response.json({ error: String((error as Error)?.message || error) }, { status: 500 });
  }
});
