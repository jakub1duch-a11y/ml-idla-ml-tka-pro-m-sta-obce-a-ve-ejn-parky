// MLŽIDLA / HolmTec — Apps Script bridge R01. Read-only connection test.
const BASE44_ORIGIN = 'https://mlzidla-holmtec.base44.app';
const BASE44_APP_ID = '6a3ee88c10959cd3588c4d68';

function testBase44Connection() {
  const props = PropertiesService.getScriptProperties();
  const token = (props.getProperty('BASE44_API_TOKEN') || '').trim();
  if (!token) throw new Error('Nastav BASE44_API_TOKEN v nastavení projektu.');
  const response = UrlFetchApp.fetch(BASE44_ORIGIN + '/api/entities/CrmContact?limit=1', {
    method: 'get',
    headers: { Authorization: 'Bearer ' + token, 'X-App-Id': BASE44_APP_ID, Accept: 'application/json' },
    muteHttpExceptions: true,
    followRedirects: false
  });
  const status = response.getResponseCode();
  if (status !== 200) throw new Error('Base44 HTTP ' + status + '; zkontroluj API adresu, oprávnění a token.');
  let data;
  try { data = JSON.parse(response.getContentText()); }
  catch (_) { throw new Error('Base44 nevrátil JSON. Ověř adresu v API reference.'); }
  if (!Array.isArray(data) && !(data && Array.isArray(data.items)) && !(data && Array.isArray(data.data))) {
    throw new Error('Neočekávaný formát API odpovědi.');
  }
  const result = { ok: true, httpStatus: status, appId: BASE44_APP_ID, entity: 'CrmContact', mode: 'read-only' };
  console.log(JSON.stringify(result));
  return result;
}
