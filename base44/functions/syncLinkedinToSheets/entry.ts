import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { MLZNY_DRIVE_ID } from '../../shared/offerDrive.ts';
import { ensureSheet, ensureHeaders, appendRow, getExistingColumnValues, updateCell, ensureSpreadsheetInDrive } from '../../shared/googleSheets.ts';

const SHEET_NAME = 'LinkedIn aktivity';
const OUTREACH_SHEET = 'Oslovování';
const PROFILE_SHEET = 'Profil';

const ACTIVITY_HEADERS = ['Datum', 'Typ', 'Nadpis / text', 'URL', 'Lajky', 'Komentáře', 'Dosah', 'Stav', 'ID příspěvku'];
const OUTREACH_HEADERS = ['Datum', 'Jméno', 'Firma / pozice', 'LinkedIn URL', 'Typ kontaktu', 'Zpráva', 'Stav', 'Odpověď', 'Poznámka', 'ID záznamu'];
const PROFILE_HEADERS = ['Položka', 'Hodnota'];

async function linkedinGet(url, accessToken) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`LinkedIn API ${res.status}: ${await res.text()}`);
  return res.json();
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const action = body.action || 'sync_activity';

    const { accessToken: linkedinToken } = await base44.asServiceRole.connectors.getConnection('linkedin');
    const { accessToken: sheetsToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const { accessToken: driveToken } = await base44.asServiceRole.connectors.getConnection('googledrive');

    const spreadsheetId = await ensureSpreadsheetInDrive(driveToken, MLZNY_DRIVE_ID, 'LinkedIn aktivity');
    await ensureSheet(sheetsToken, spreadsheetId, SHEET_NAME);
    await ensureHeaders(sheetsToken, spreadsheetId, SHEET_NAME, ACTIVITY_HEADERS);
    await ensureSheet(sheetsToken, spreadsheetId, OUTREACH_SHEET);
    await ensureHeaders(sheetsToken, spreadsheetId, OUTREACH_SHEET, OUTREACH_HEADERS);
    await ensureSheet(sheetsToken, spreadsheetId, PROFILE_SHEET);
    await ensureHeaders(sheetsToken, spreadsheetId, PROFILE_SHEET, PROFILE_HEADERS);

    // ── Sync LinkedIn posts/activity ──
    if (action === 'sync_activity') {
      const profile = await linkedinGet('https://api.linkedin.com/v2/userinfo', linkedinToken);
      const personId = profile.sub;

      // Write profile sheet
      const profileRows = [
        ['Jméno', profile.name || ''],
        ['E-mail', profile.email || ''],
        ['LinkedIn ID', personId || ''],
        ['Profil URL', profile.picture ? `https://www.linkedin.com/in/${profile.given_name || ''}` : ''],
        ['Poslední synchronizace', new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' })],
      ];
      // Overwrite profile sheet
      const profileRange = `${PROFILE_SHEET}!A1:B${profileRows.length}`;
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(profileRange)}?valueInputOption=RAW`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${sheetsToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: profileRows }),
      });

      // Fetch recent posts/shares
      const existingIds = await getExistingColumnValues(sheetsToken, spreadsheetId, SHEET_NAME, 'I');
      let newPosts = 0;
      try {
        const sharesUrl = `https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:person:${personId}&count=50&projection=(elements(*(id,created,edited,text,originalShare,owner,activity,shareCommentary)))`;
        const shares = await linkedinGet(sharesUrl, linkedinToken);
        const elements = shares.elements || [];
        for (const share of elements) {
          const id = String(share.id || '');
          if (!id || existingIds.has(id)) continue;
          const created = share.created?.time ? new Date(share.created.time).toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' }) : '';
          const text = share.text?.value || share.shareCommentary?.text || '';
          const url = share.activity || `https://www.linkedin.com/feed/update/${id}`;
          await appendRow(sheetsToken, spreadsheetId, SHEET_NAME, ACTIVITY_HEADERS.length, [
            created, 'Příspěvek', text.slice(0, 500), url, '', '', '', 'publikováno', id,
          ]);
          newPosts += 1;
        }
      } catch (sharesError) {
        // Shares API may fail for some accounts — log it
        await appendRow(sheetsToken, spreadsheetId, SHEET_NAME, ACTIVITY_HEADERS.length, [
          new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' }), 'Chyba', `Nelze načíst příspěvky: ${sharesError.message}`, '', '', '', '', 'chyba', '',
        ]);
      }

      return Response.json({ ok: true, spreadsheet_id: spreadsheetId, new_posts: newPosts, profile: profile.name || '' });
    }

    // ── Log outreach attempt (architects/developers) ──
    if (action === 'log_outreach') {
      const outreach = body.outreach || {};
      const id = outreach.id || `OUT-${Date.now()}`;
      await appendRow(sheetsToken, spreadsheetId, OUTREACH_SHEET, OUTREACH_HEADERS.length, [
        new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' }),
        outreach.name || '',
        outreach.company || '',
        outreach.linkedin_url || '',
        outreach.contact_type || 'zpráva',
        outreach.message || '',
        outreach.status || 'odesláno',
        outreach.reply || '',
        outreach.note || '',
        id,
      ]);
      return Response.json({ ok: true, outreach_id: id, spreadsheet_id: spreadsheetId });
    }

    // ── Update outreach reply ──
    if (action === 'update_outreach') {
      const { outreach_id, reply, status } = body;
      if (!outreach_id) return Response.json({ error: 'outreach_id required' }, { status: 400 });
      const existing = await getExistingColumnValues(sheetsToken, spreadsheetId, OUTREACH_SHEET, 'J');
      // Find the row number
      const range = `${OUTREACH_SHEET}!J2:J`;
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`, {
        headers: { Authorization: `Bearer ${sheetsToken}` },
      });
      if (!res.ok) return Response.json({ error: 'read failed' }, { status: 500 });
      const data = await res.json();
      const rows = data.values || [];
      const idx = rows.findIndex((r) => String(r?.[0] || '') === String(outreach_id));
      if (idx === -1) return Response.json({ error: 'not found' }, { status: 404 });
      const rowNumber = idx + 2;
      if (reply) await updateCell(sheetsToken, spreadsheetId, OUTREACH_SHEET, 'H', rowNumber, reply);
      if (status) await updateCell(sheetsToken, spreadsheetId, OUTREACH_SHEET, 'G', rowNumber, status);
      return Response.json({ ok: true, updated: true, row: rowNumber });
    }

    // ── Post to LinkedIn ──
    if (action === 'post') {
      const { text, visibility = 'PUBLIC' } = body;
      if (!text) return Response.json({ error: 'text required' }, { status: 400 });
      const profile = await linkedinGet('https://api.linkedin.com/v2/userinfo', linkedinToken);
      const personUrn = `urn:li:person:${profile.sub}`;
      const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: { Authorization: `Bearer ${linkedinToken}`, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
        body: JSON.stringify({
          author: personUrn,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: { text },
              shareMediaCategory: 'NONE',
            },
          },
          visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': visibility },
        }),
      });
      if (!postRes.ok) {
        const errText = await postRes.text();
        await appendRow(sheetsToken, spreadsheetId, SHEET_NAME, ACTIVITY_HEADERS.length, [
          new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' }), 'Chyba publikace', errText.slice(0, 500), '', '', '', '', 'chyba', '',
        ]);
        return Response.json({ error: `LinkedIn post failed: ${errText}` }, { status: postRes.status });
      }
      const postData = await postRes.json();
      const postId = postData.id || postData.activity || '';
      await appendRow(sheetsToken, spreadsheetId, SHEET_NAME, ACTIVITY_HEADERS.length, [
        new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' }), 'Příspěvek', text.slice(0, 500), `https://www.linkedin.com/feed/update/${postId}`, '', '', '', 'publikováno', postId,
      ]);
      return Response.json({ ok: true, post_id: postId, url: `https://www.linkedin.com/feed/update/${postId}` });
    }

    return Response.json({ error: 'unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}