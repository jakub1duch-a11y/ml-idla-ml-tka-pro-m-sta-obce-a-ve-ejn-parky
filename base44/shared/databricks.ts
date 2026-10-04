export type DatabricksConnection = {
  host: string;
  accessToken: string;
  warehouseId?: string | null;
};

export function normalizeDatabricksHost(value: unknown) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    return `${url.protocol}//${url.host}`.replace(/\/$/, '');
  } catch {
    return '';
  }
}

export function safeIdentifier(value: unknown, fallback: string) {
  const cleaned = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  return cleaned || fallback;
}

function errorMessage(payload: any, status: number) {
  return payload?.message || payload?.error?.message || payload?.error_code || payload?.error || `HTTP ${status}`;
}

export async function databricksRequest(
  connection: DatabricksConnection,
  path: string,
  init: RequestInit = {},
) {
  const response = await fetch(`${connection.host}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${connection.accessToken}`,
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  });
  const text = await response.text();
  let data: any = {};
  if (text) {
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
  }
  if (!response.ok) {
    const error: any = new Error(errorMessage(data, response.status));
    error.status = response.status;
    error.payload = data;
    throw error;
  }
  return data;
}

export async function listWarehouses(connection: DatabricksConnection) {
  const data = await databricksRequest(connection, '/api/2.0/sql/warehouses');
  return Array.isArray(data?.warehouses) ? data.warehouses : [];
}

export async function chooseWarehouse(connection: DatabricksConnection, preferredId?: string | null) {
  const warehouses = await listWarehouses(connection);
  if (!warehouses.length) throw new Error('V Databricks nebyl nalezen žádný SQL warehouse.');

  const preferred = preferredId ? warehouses.find((w: any) => w.id === preferredId) : null;
  const running = warehouses.find((w: any) => String(w.state || '').toUpperCase() === 'RUNNING');
  const serverless = warehouses.find((w: any) => Boolean(w.enable_serverless_compute));
  const warehouse = preferred || running || serverless || warehouses[0];

  const state = String(warehouse.state || '').toUpperCase();
  if (state === 'STOPPED' || state === 'DELETED') {
    await databricksRequest(connection, `/api/2.0/sql/warehouses/${warehouse.id}/start`, { method: 'POST' });
  }
  return warehouse;
}

function statementState(data: any) {
  return String(data?.status?.state || '').toUpperCase();
}

export async function executeSql(
  connection: DatabricksConnection,
  warehouseId: string,
  statement: string,
  catalog?: string,
  schema?: string,
) {
  const payload: Record<string, unknown> = {
    warehouse_id: warehouseId,
    statement,
    wait_timeout: '10s',
    on_wait_timeout: 'CONTINUE',
    disposition: 'INLINE',
  };
  if (catalog) payload.catalog = catalog;
  if (schema) payload.schema = schema;

  let data = await databricksRequest(connection, '/api/2.0/sql/statements/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  let state = statementState(data);
  const id = data?.statement_id;
  for (let i = 0; id && ['PENDING', 'RUNNING'].includes(state) && i < 30; i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    data = await databricksRequest(connection, `/api/2.0/sql/statements/${id}`);
    state = statementState(data);
  }

  if (state && state !== 'SUCCEEDED') {
    const message = data?.status?.error?.message || data?.status?.error?.error_code || `SQL statement ${state}`;
    const error: any = new Error(message);
    error.payload = data;
    throw error;
  }
  return data;
}

export function sqlString(value: unknown) {
  if (value === null || value === undefined) return 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}

export function sqlTimestamp(value: unknown) {
  const text = String(value || '').trim();
  if (!text) return 'NULL';
  return `CAST(${sqlString(text)} AS TIMESTAMP)`;
}

export async function bootstrapMlzidlaLakehouse(
  connection: DatabricksConnection,
  preferredWarehouseId?: string | null,
  requestedCatalog = 'mlzidla',
) {
  const warehouse = await chooseWarehouse(connection, preferredWarehouseId);
  const warehouseId = warehouse.id;
  let catalog = safeIdentifier(requestedCatalog, 'mlzidla');
  const warnings: string[] = [];

  try {
    await executeSql(connection, warehouseId, `CREATE CATALOG IF NOT EXISTS \`${catalog}\``);
  } catch (error: any) {
    warnings.push(`Vlastní katalog \`${catalog}\` nebylo možné vytvořit: ${error.message}. Používám katalog main.`);
    catalog = 'main';
  }

  const schemas = ['raw', 'core', 'analytics', 'ai'];
  for (const schema of schemas) {
    await executeSql(connection, warehouseId, `CREATE SCHEMA IF NOT EXISTS \`${catalog}\`.\`${schema}\``);
  }

  const tableStatements = [
    `CREATE TABLE IF NOT EXISTS \`${catalog}\`.\`raw\`.\`base44_products\` (source_id STRING, payload_json STRING, source_created_at TIMESTAMP, source_updated_at TIMESTAMP, synced_at TIMESTAMP) USING DELTA`,
    `CREATE TABLE IF NOT EXISTS \`${catalog}\`.\`raw\`.\`base44_contact_inquiries\` (source_id STRING, payload_json STRING, source_created_at TIMESTAMP, source_updated_at TIMESTAMP, synced_at TIMESTAMP) USING DELTA`,
    `CREATE TABLE IF NOT EXISTS \`${catalog}\`.\`raw\`.\`base44_poptavky\` (source_id STRING, payload_json STRING, source_created_at TIMESTAMP, source_updated_at TIMESTAMP, synced_at TIMESTAMP) USING DELTA`,
    `CREATE TABLE IF NOT EXISTS \`${catalog}\`.\`raw\`.\`base44_realizace\` (source_id STRING, payload_json STRING, source_created_at TIMESTAMP, source_updated_at TIMESTAMP, synced_at TIMESTAMP) USING DELTA`,
    `CREATE TABLE IF NOT EXISTS \`${catalog}\`.\`raw\`.\`base44_marketing_posts\` (source_id STRING, payload_json STRING, source_created_at TIMESTAMP, source_updated_at TIMESTAMP, synced_at TIMESTAMP) USING DELTA`,
    `CREATE TABLE IF NOT EXISTS \`${catalog}\`.\`analytics\`.\`sync_runs\` (run_id STRING, source STRING, entity_name STRING, records_count BIGINT, status STRING, started_at TIMESTAMP, finished_at TIMESTAMP, details STRING) USING DELTA`,
    `CREATE TABLE IF NOT EXISTS \`${catalog}\`.\`ai\`.\`document_registry\` (document_id STRING, title STRING, source_url STRING, mime_type STRING, product_slug STRING, metadata_json STRING, indexed_at TIMESTAMP) USING DELTA`,
  ];

  for (const statement of tableStatements) {
    await executeSql(connection, warehouseId, statement);
  }

  try {
    await executeSql(connection, warehouseId, `CREATE VOLUME IF NOT EXISTS \`${catalog}\`.\`ai\`.\`files\``);
  } catch (error: any) {
    warnings.push(`AI volume se nepodařilo vytvořit: ${error.message}`);
  }

  const viewStatements = [
    `CREATE OR REPLACE VIEW \`${catalog}\`.\`core\`.\`products_latest\` AS SELECT source_id, payload_json, source_created_at, source_updated_at, synced_at FROM \`${catalog}\`.\`raw\`.\`base44_products\``,
    `CREATE OR REPLACE VIEW \`${catalog}\`.\`core\`.\`leads_latest\` AS SELECT 'ContactInquiry' AS source_type, source_id, payload_json, source_created_at, source_updated_at, synced_at FROM \`${catalog}\`.\`raw\`.\`base44_contact_inquiries\` UNION ALL SELECT 'Poptavka' AS source_type, source_id, payload_json, source_created_at, source_updated_at, synced_at FROM \`${catalog}\`.\`raw\`.\`base44_poptavky\``,
    `CREATE OR REPLACE VIEW \`${catalog}\`.\`core\`.\`marketing_latest\` AS SELECT source_id, payload_json, source_created_at, source_updated_at, synced_at FROM \`${catalog}\`.\`raw\`.\`base44_marketing_posts\``,
  ];
  for (const statement of viewStatements) {
    await executeSql(connection, warehouseId, statement);
  }

  return { warehouse, warehouseId, catalog, warnings };
}
