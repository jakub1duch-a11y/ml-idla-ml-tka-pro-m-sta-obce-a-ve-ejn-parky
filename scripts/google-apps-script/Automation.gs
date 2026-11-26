// R01: signed Base44 health check only. Does not write Sheets or send mail.
// If the Google project already has doPost, integrate this handler into that router.
function base44WebhookHandler(e) {
  function reply(value) {
    return ContentService.createTextOutput(JSON.stringify(value))
      .setMimeType(ContentService.MimeType.JSON);
  }
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > 4096) return reply({ok:false,error:'invalid_request'});
    const secret = PropertiesService.getScriptProperties().getProperty('GOOGLE_SHEETS_WEBHOOK_SECRET') || '';
    if (secret.length < 32) return reply({ok:false,error:'not_configured'});
    const body = JSON.parse(raw);
    if (typeof body.envelope !== 'string' || !/^[a-f0-9]{64}$/.test(body.signature || ''))
      return reply({ok:false,error:'invalid_request'});
    const expected = Utilities.computeHmacSha256Signature(body.envelope, secret, Utilities.Charset.UTF_8)
      .map(function(b) { return ((b + 256) % 256).toString(16).padStart(2,'0'); }).join('');
    let diff = 0;
    for (let i=0;i<64;i++) diff |= expected.charCodeAt(i) ^ body.signature.charCodeAt(i);
    if (diff !== 0) return reply({ok:false,error:'unauthorized'});
    const p = JSON.parse(body.envelope);
    if (p.source !== 'Base44_Function' || p.entity !== 'HealthCheck' || p.mode !== 'dry_run' ||
        !Number.isFinite(p.timestamp) || Math.abs(Date.now()-p.timestamp)>120000 ||
        typeof p.messageId !== 'string' || !/^[a-f0-9-]{36}$/.test(p.messageId))
      return reply({ok:false,error:'invalid_envelope'});
    return reply({ok:true,messageId:p.messageId,mode:'dry_run',recordsWritten:0});
  } catch (_) { return reply({ok:false,error:'invalid_request'}); }
}
// Standalone project only: if doPost already exists, route signed probes to base44WebhookHandler.
function doPost(e) { return base44WebhookHandler(e); }
