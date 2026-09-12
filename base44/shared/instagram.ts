const graphUrl = 'https://graph.instagram.com';

async function readJson(response) {
  const data = await response.json();
  if (!response.ok) {
    const message = data?.error?.message || data?.error_message || 'Instagram API request failed';
    throw new Error(message);
  }
  return data;
}

export async function getInstagramIdentity(accessToken) {
  const response = await fetch(`${graphUrl}/me?fields=id,username&access_token=${encodeURIComponent(accessToken)}`);
  return readJson(response);
}

async function waitForContainer(accessToken, containerId) {
  for (let attempt = 0; attempt < 15; attempt++) {
    const response = await fetch(`${graphUrl}/${containerId}?fields=status_code,status&access_token=${encodeURIComponent(accessToken)}`);
    const data = await readJson(response);
    if (data.status_code === 'FINISHED') return;
    if (data.status_code === 'ERROR') throw new Error(`Instagram nepřijal médium: ${data.status || 'ERROR'}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error('Instagram nezpracoval obrázek v časovém limitu.');
}

export async function publishInstagramImage(accessToken, imageUrl, caption) {
  const account = await getInstagramIdentity(accessToken);
  const containerResponse = await fetch(`${graphUrl}/${account.id}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl, caption: caption || '', access_token: accessToken }),
  });
  const container = await readJson(containerResponse);
  await waitForContainer(accessToken, container.id);
  const publishResponse = await fetch(`${graphUrl}/${account.id}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: container.id, access_token: accessToken }),
  });
  return readJson(publishResponse);
}