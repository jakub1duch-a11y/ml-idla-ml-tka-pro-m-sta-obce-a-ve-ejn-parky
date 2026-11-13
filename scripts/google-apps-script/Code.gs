/**
 * MLŽIDLA.cz / HolmTec — server-to-server webhook.
 * Web App: execute as meduna@holmtec.cz; access Anyone (requests protected by
 * WEBHOOK_SECRET). NEVER call directly from browser JavaScript.
 * Configure Script Properties: WEBHOOK_SECRET, SPREADSHEET_ID, NOTIFICATION_EMAIL,
 * CUSTOMER_AUTOREPLY_ENABLED (false recommended for Base44 integrations).
 */
var INQUIRY_TAB = 'Poptávky';
var EXISTING_COLS = 10;
var NOTIFICATION_COL = 11;
var CUSTOMER_COL = 12;

function jsonResponse_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function value_(input, length) {
  return String(input === undefined || input === null ? '' : input)
    .replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, length || 5000);
}

// Prevent Google Sheets formula injection from untrusted text.
function cell_(input, length) {
  var s = value_(input, length);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function emailValid_(email) {
  return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getOrCreateHeaders_(sheet) {
  // Existing source table A:J must remain untouched.
  if (sheet.getRange(1, NOTIFICATION_COL).getValue() === '') {
    sheet.getRange(1, NOTIFICATION_COL).setValue('Interní notifikace');
  }
  if (sheet.getRange(1, CUSTOMER_COL).getValue() === '') {
    sheet.getRange(1, CUSTOMER_COL).setValue('Potvrzení zákazníkovi');
  }
}

function findByInquiryId_(sheet, inquiryId) {
  var last = sheet.getLastRow();
  if (last < 2 || !inquiryId) return 0;
  var match = sheet.getRange(2, 10, last - 1, 1)
    .createTextFinder(inquiryId).matchEntireCell(true).findNext();
  return match ? match.getRow() : 0;
}

function emailInternal_(data, to) {
  var subject = 'Nová poptávka MLŽIDLA / HolmTec — ' + data.name;
  var body = [
    'Nová poptávka z webového formuláře',
    'ID: ' + data.inquiry_id,
    'Zdroj: ' + data.source,
    'Jméno: ' + data.name,
    'E-mail: ' + (data.email || '—'),
    'Telefon: ' + (data.phone || '—'),
    'Firma: ' + (data.company || '—'),
    'Produkt: ' + (data.product || '—'),
    '',
    'Zpráva:',
    data.message,
    '',
    'Administrace: https://mlzidla.cz/admin?tab=poptavky'
  ].join('\n');
  MailApp.sendEmail({ to: to, subject: subject, body: body, name: 'MLŽIDLA.cz — poptávky' });
}

function emailCustomer_(data) {
  var greeting = data.name ? 'Dobrý den, ' + data.name + ',' : 'Dobrý den,';
  var body = greeting + '\n\nDěkujeme za Vaši poptávku. Zprávu jsme přijali. ' +
    'Po technickém posouzení Vás budeme kontaktovat s návrhem dalšího postupu.\n\n' +
    'S pozdravem\nIng. Radek Meduna\nMLŽIDLA.cz by HolmTec\n' +
    'meduna@holmtec.cz\nhttps://mlzidla.cz';
  MailApp.sendEmail({
    to: data.email,
    subject: 'Potvrzení přijetí poptávky | MLŽIDLA.cz',
    body: body,
    name: 'MLŽIDLA.cz by HolmTec'
  });
}

function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var expected = props.getProperty('WEBHOOK_SECRET');
  if (!expected || expected.length < 32) {
    return jsonResponse_({status:'error', code:'not_configured'});
  }

  var parsed;
  try {
    var raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > 25000) return jsonResponse_({status:'error', code:'invalid_payload_size'});
    parsed = JSON.parse(raw);
  } catch (_) {
    return jsonResponse_({status:'error', code:'invalid_json'});
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) ||
      typeof parsed.token !== 'string' || parsed.token !== expected) {
    return jsonResponse_({status:'error', code:'unauthorized'});
  }

  var lead = {
    inquiry_id: value_(parsed.inquiry_id || parsed.entity_id, 120),
    name: value_(parsed.name || parsed.jmeno, 160),
    email: value_(parsed.email, 254).toLowerCase(),
    phone: value_(parsed.phone || parsed.telefon, 60),
    company: value_(parsed.company || parsed.firma, 160),
    product: value_(parsed.product || parsed.produkt, 250),
    message: value_(parsed.message || parsed.zprava, 6000),
    source: value_(parsed.source || 'Web (Base44/Antigravity)', 120)
  };

  if (!lead.name || !lead.message || !(lead.email || lead.phone) ||
      !emailValid_(lead.email)) {
    return jsonResponse_({status:'error', code:'invalid_lead'});
  }
  if (!lead.inquiry_id) {
    // External Antigravity clients should supply a stable UUID for idempotency.
    lead.inquiry_id = Utilities.getUuid();
  }

  var spreadsheetId = props.getProperty('SPREADSHEET_ID');
  var notifyTo = props.getProperty('NOTIFICATION_EMAIL') || 'meduna@holmtec.cz';
  if (!spreadsheetId || !emailValid_(notifyTo)) {
    return jsonResponse_({status:'error', code:'sheet_or_recipient_not_configured'});
  }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return jsonResponse_({status:'error', code:'busy_retry'});
  try {
    var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(INQUIRY_TAB);
    if (!sheet) return jsonResponse_({status:'error', code:'sheet_tab_missing'});
    getOrCreateHeaders_(sheet);

    var existingRow = findByInquiryId_(sheet, lead.inquiry_id);
    var row = existingRow;
    if (!row) {
      var now = Utilities.formatDate(new Date(), 'Europe/Prague', 'dd. MM. yyyy HH:mm:ss');
      // A:J matches the pre-existing MLŽIDLA — Poptávky a klienti table.
      sheet.appendRow([
        now, cell_(lead.source, 120), cell_(lead.name, 160), cell_(lead.email, 254),
        cell_(lead.phone, 60), cell_(lead.company, 160), cell_(lead.product, 250),
        cell_(lead.message, 6000), 'nova', lead.inquiry_id, 'PENDING', 'PENDING'
      ]);
      row = sheet.getLastRow();
    } else {
      // Preserve historical records; never mail old leads because a new bridge was enabled.
      if (!sheet.getRange(row, NOTIFICATION_COL).getValue()) {
        sheet.getRange(row, NOTIFICATION_COL).setValue('SKIPPED_LEGACY');
      }
      if (!sheet.getRange(row, CUSTOMER_COL).getValue()) {
        sheet.getRange(row, CUSTOMER_COL).setValue('SKIPPED_LEGACY');
      }
    }

    var warnings = [];
    var internalStatus = String(sheet.getRange(row, NOTIFICATION_COL).getValue());
    if (internalStatus !== 'SENT' && internalStatus !== 'SKIPPED_LEGACY') {
      try {
        emailInternal_(lead, notifyTo);
        sheet.getRange(row, NOTIFICATION_COL).setValue('SENT');
      } catch (error) {
        sheet.getRange(row, NOTIFICATION_COL).setValue('ERROR');
        warnings.push('internal_email_failed');
        console.error(error);
      }
    }

    var replyEnabled = props.getProperty('CUSTOMER_AUTOREPLY_ENABLED') === 'true';
    // The Base44 customer notification pipeline already exists. Only enable
    // this for a source that has no other confirmation sender.
    var shouldReply = replyEnabled && parsed.send_customer_confirmation === true && !!lead.email;
    var customerStatus = String(sheet.getRange(row, CUSTOMER_COL).getValue());
    if (customerStatus === 'PENDING' && !shouldReply) {
      sheet.getRange(row, CUSTOMER_COL).setValue('DISABLED');
    } else if (shouldReply && customerStatus !== 'SENT' && customerStatus !== 'SKIPPED_LEGACY') {
      try {
        emailCustomer_(lead);
        sheet.getRange(row, CUSTOMER_COL).setValue('SENT');
      } catch (error) {
        sheet.getRange(row, CUSTOMER_COL).setValue('ERROR');
        warnings.push('customer_email_failed');
        console.error(error);
      }
    }

    return jsonResponse_({
      status:'success', inquiry_id:lead.inquiry_id, duplicate:Boolean(existingRow),
      warnings:warnings, internal_notification:sheet.getRange(row, NOTIFICATION_COL).getValue(),
      customer_confirmation:sheet.getRange(row, CUSTOMER_COL).getValue()
    });
  } catch (error) {
    console.error(error);
    return jsonResponse_({status:'error', code:'processing_failed'});
  } finally {
    lock.releaseLock();
  }
}

// Health check only; no PII, token, or configuration data.
function doGet() {
  return jsonResponse_({status:'online', service:'MLZIDLA_INQUIRIES_V1'});
}
