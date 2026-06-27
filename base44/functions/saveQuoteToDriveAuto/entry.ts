import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Saves generated PDF to Google Drive "mlžný disk" folder and returns URL
// Called automatically when quote is generated

async function findOrCreateFolder(accessToken, parentFolderId, folderName) {
  // List folders in parent
  const listUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false and name='${folderName}'`
  )}&fields=files(id)&supportsAllDrives=true&includeItemsFromAllDrives=true`;

  const listRes = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!listRes.ok) throw new Error(`Drive list failed: ${listRes.status}`);
  const listData = await listRes.json();

  if (listData.files && listData.files.length > 0) {
    return listData.files[0].id;
  }

  // Create folder if not exists
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?supportsAllDrives=true', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    }),
  });

  if (!createRes.ok) throw new Error(`Drive create folder failed: ${createRes.status}`);
  const createData = await createRes.json();
  return createData.id;
}

async function uploadPdfToDrive(pdfBytes, filename, driveFolderId, accessToken) {
  const formData = new FormData();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  formData.append('file', blob, filename);

  const metadata = {
    name: filename,
    mimeType: 'application/pdf',
    parents: [driveFolderId],
  };
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&includeItemsFromAllDrives=true', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });

  if (!res.ok) throw new Error(`Drive upload failed: ${res.status}`);
  const data = await res.json();
  return {
    fileId: data.id,
    driveUrl: `https://drive.google.com/file/d/${data.id}/view`,
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { pdfBytes, filename, quoteNumber, inquiryEmail, inquiryName } = body;

    if (!pdfBytes || !filename) {
      return Response.json({ error: 'Missing pdfBytes or filename' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');

    // Root folder ID where "mlžný disk" folder is located
    // Using "My Drive" root (empty string) or you can use specific folder ID
    const rootFolderId = 'root'; // or pass as parameter

    // Find or create "mlžný disk" folder
    const mlznyDiskFolderId = await findOrCreateFolder(accessToken, rootFolderId, 'mlžný disk');

    // Find or create year+month subfolder (e.g., "2026-06")
    const yearMonth = new Date().toISOString().slice(0, 7); // 2026-06
    const yearFolderId = await findOrCreateFolder(accessToken, mlznyDiskFolderId, yearMonth);

    // Upload PDF
    const { fileId, driveUrl } = await uploadPdfToDrive(pdfBytes, filename, yearFolderId, accessToken);

    return Response.json({
      success: true,
      file_id: fileId,
      drive_url: driveUrl,
      folder_name: `mlžný disk/${yearMonth}`,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});