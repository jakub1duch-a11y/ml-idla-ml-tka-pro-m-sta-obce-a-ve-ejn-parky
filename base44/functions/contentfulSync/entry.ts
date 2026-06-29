import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Content model definitions for HolmTec
const CONTENT_MODELS = {
  product: {
    name: 'Product',
    description: 'Mlžný produkt / sculpture',
    fields: [
      { id: 'name', name: 'Název', type: 'Symbol', required: true },
      { id: 'slug', name: 'Slug', type: 'Symbol', required: true, validations: [{ unique: true }] },
      { id: 'shortDescription', name: 'Krátký popis', type: 'Symbol' },
      { id: 'description', name: 'Popis', type: 'Text' },
      { id: 'mainImage', name: 'Hlavní obrázek', type: 'Link', linkType: 'Asset' },
      { id: 'micronSize', name: 'Micron Size', type: 'Symbol' },
      { id: 'waterConsumption', name: 'Spotřeba vody', type: 'Symbol' },
      { id: 'material', name: 'Materiál', type: 'Symbol' },
      { id: 'pressure', name: 'Tlak', type: 'Symbol' },
      { id: 'coverageArea', name: 'Plocha pokrytí', type: 'Symbol' },
      { id: 'featured', name: 'Zvýrazněný', type: 'Boolean' },
    ]
  },
  realizace: {
    name: 'Realizace',
    description: 'Projekt / realizace HolmTec',
    fields: [
      { id: 'name', name: 'Název projektu', type: 'Symbol', required: true },
      { id: 'client', name: 'Klient', type: 'Symbol' },
      { id: 'location', name: 'Lokalita', type: 'Symbol' },
      { id: 'year', name: 'Rok', type: 'Integer' },
      { id: 'category', name: 'Kategorie', type: 'Symbol', validations: [{ in: ['mestsky', 'event', 'soukromy', 'prumyslovy'] }] },
      { id: 'description', name: 'Popis', type: 'Text' },
      { id: 'mainImage', name: 'Hlavní obrázek', type: 'Link', linkType: 'Asset' },
      { id: 'productUsed', name: 'Použitý produkt', type: 'Symbol' },
      { id: 'featured', name: 'Na homepage', type: 'Boolean' },
      { id: 'published', name: 'Publikováno', type: 'Boolean' },
    ]
  },
  blogPost: {
    name: 'Blog Post',
    description: 'Blog & Inspirace příspěvek',
    fields: [
      { id: 'title', name: 'Název', type: 'Symbol', required: true },
      { id: 'slug', name: 'Slug', type: 'Symbol', validations: [{ unique: true }] },
      { id: 'category', name: 'Kategorie', type: 'Symbol', validations: [{ in: ['inspirace', 'realizace', 'technika', 'novinky'] }] },
      { id: 'perex', name: 'Perex', type: 'Symbol' },
      { id: 'content', name: 'Obsah', type: 'Text' },
      { id: 'coverImage', name: 'Obrázek', type: 'Link', linkType: 'Asset' },
      { id: 'published', name: 'Publikováno', type: 'Boolean' },
      { id: 'publishedDate', name: 'Datum publikace', type: 'Date' },
      { id: 'tags', name: 'Tagy', type: 'Array', items: { type: 'Symbol' } },
    ]
  }
};

async function cfRequest(url, method, accessToken, body) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Contentful error ${res.status}: ${JSON.stringify(data.details || data.message || data)}`);
  return data;
}

async function getSpaces(accessToken) {
  const data = await cfRequest('https://api.contentful.com/spaces', 'GET', accessToken);
  return data.items || [];
}

async function syncContentModel(spaceId, accessToken, modelKey, modelDef) {
  const baseUrl = `https://api.contentful.com/spaces/${spaceId}/environments/master/content_types`;
  
  // Check if content type already exists
  let existing = null;
  try {
    existing = await cfRequest(`${baseUrl}/${modelKey}`, 'GET', accessToken);
  } catch (e) {
    // doesn't exist yet
  }

  const fields = modelDef.fields.map(f => {
    const field = { id: f.id, name: f.name, type: f.type, required: f.required || false };
    if (f.linkType) { field.linkType = f.linkType; }
    if (f.validations) { field.validations = f.validations; }
    if (f.items) { field.items = f.items; }
    return field;
  });

  const payload = {
    name: modelDef.name,
    description: modelDef.description,
    displayField: modelDef.fields[0].id,
    fields,
  };

  let result;
  if (existing) {
    // Update
    const res = await fetch(`${baseUrl}/${modelKey}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'X-Contentful-Version': String(existing.sys.version),
      },
      body: JSON.stringify(payload),
    });
    result = await res.json();
    if (!res.ok) throw new Error(`Update error: ${JSON.stringify(result.details || result.message || result)}`);
  } else {
    // Create
    const res = await fetch(`${baseUrl}/${modelKey}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
      },
      body: JSON.stringify(payload),
    });
    result = await res.json();
    if (!res.ok) throw new Error(`Create error: ${JSON.stringify(result.details || result.message || result)}`);
  }

  // Publish the content type
  const publishRes = await fetch(`${baseUrl}/${modelKey}/published`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Contentful-Version': String(result.sys.version),
    },
  });
  const published = await publishRes.json();
  if (!publishRes.ok) throw new Error(`Publish error: ${JSON.stringify(published.details || published.message || published)}`);

  return { id: modelKey, name: modelDef.name, action: existing ? 'updated' : 'created' };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const action = body.action || 'listSpaces';
    const spaceId = body.spaceId;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('contentful');

    if (action === 'listSpaces') {
      const spaces = await getSpaces(accessToken);
      return Response.json({
        spaces: spaces.map(s => ({ id: s.sys.id, name: s.name }))
      });
    }

    if (action === 'syncModels') {
      if (!spaceId) return Response.json({ error: 'spaceId is required' }, { status: 400 });

      const results = [];
      for (const [key, def] of Object.entries(CONTENT_MODELS)) {
        const result = await syncContentModel(spaceId, accessToken, key, def);
        results.push(result);
      }
      return Response.json({ success: true, results, spaceId });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});