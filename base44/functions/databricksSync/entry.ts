import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { executeSql, normalizeDatabricksHost, sqlString, sqlTimestamp } from '../../shared/databricks.ts';

const ENTITY_TABLES: Record<string, string> = {
  Product: 'base44_products',
  ContactInquiry: 'base44_contact_inquiries',
  Poptavka: 'base44_poptavky',
  Realizace: 'base44_realizace',
  MarketingPost: 'base44_marketing_posts',
};

function safeJson(value: unknown) {
  return JSON.stringify(value ?? null);
}

async function readAll(base44: any, entityName: string) {
  const rows: any[] = [];
  const pageSize = 500;
  for (let skip = 0; skip < 5000; skip += pageSize) {
    const page = await base44.asServiceRole.entities[entityName].filter({}, '-updated_date', pageSize, skip);
    const items = Array.isArray(page) ? page : [];
    rows.push(...items);
    if (items.length < pageSize) break;
  }
  return rows;
}

function mergeStatement(catalog: string, table: string, records: any[]) {
  const tuples = records.map((row) => `(
    ${sqlString(row.id)},
    ${sqlString(safeJson(row))},
    ${sqlTimestamp(row.created_date)},
    ${sqlTimestamp(row.updated_date)},
    current_timestamp()
  )`).join(',\n');

  return `MERGE INTO \`${catalog}\`.\`raw\`.\`${table}\` AS target
USING (VALUES ${tuples}) AS source(source_id, payload_json, source_created_at, source_updated_at, synced_at)
ON target.source_id = source.source_id
WHEN MATCHED THEN UPDATE SET
  target.payload_json = source.payload_json,
  target.source_created_at = source.source_created_at,
  target.source_updated_at = source.source_updated_at,
  target.synced_at = source.synced_at
WHEN NOT MATCHED THEN INSERT (source_id, payload_json, source_created_at, source_updated_at, synced_at)
VALUES (source.source_id, source.payload_json, source.source_created_at, source.source_updated_at, source.synced_at)`;
}

export default async function(req: Request) {
  const startedAt = new Date().toISOString();
  let base44: any = null;
  let run: any = null;
  let config: any = null;

  try {
    base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const configs = await base44.asServiceRole.entities.DatabricksConfig.filter({ key: 'primary' }, '-created_date', 1, 0);
    config = Array.isArray(configs) ? configs[0] : null;
    if (!config) return Response.json({ error: 'DatabricksConfig nebyl nalezen.' }, { status: 400 });
    if (config.bootstrap_status !== 'ready') return Response.json({ error: 'Databricks bootstrap zatím není dokončen.' }, { status: 409 });
    if (config.sync_enabled === false && !body.force) return Response.json({ error: 'Synchronizace je v konfiguraci vypnutá.' }, { status: 409 });

    const host = normalizeDatabricksHost(config.workspace_host);
    const warehouseId = String(config.warehouse_id || '');
    const catalog = String(config.catalog || 'mlzidla');
    if (!host || !warehouseId) return Response.json({ error: 'Chybí Databricks host nebo SQL warehouse.' }, { status: 400 });

    const requested = Array.isArray(body.entities) && body.entities.length
      ? body.entities.filter((name: string) => ENTITY_TABLES[name])
      : (Array.isArray(config.sync_entities) ? config.sync_entities : Object.keys(ENTITY_TABLES)).filter((name: string) => ENTITY_TABLES[name]);

    run = await base44.asServiceRole.entities.DatabricksSyncRun.create({
      run_type: 'sync',
      status: 'running',
      started_at: startedAt,
      records_count: 0,
      warehouse_id: warehouseId,
      catalog,
      details: JSON.stringify({ entities: requested }),
    });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('databricks');
    const connection = { host, accessToken, warehouseId };
    const results: any[] = [];
    let total = 0;

    for (const entityName of requested) {
      try {
        const records = await readAll(base44, entityName);
        const table = ENTITY_TABLES[entityName];
        for (let i = 0; i < records.length; i += 50) {
          const batch = records.slice(i, i + 50);
          if (batch.length) await executeSql(connection, warehouseId, mergeStatement(catalog, table, batch));
        }
        total += records.length;
        results.push({ entity: entityName, table, status: 'success', records: records.length });
      } catch (error: any) {
        results.push({ entity: entityName, table: ENTITY_TABLES[entityName], status: 'error', records: 0, error: error.message });
      }
    }

    const failed = results.filter((item) => item.status === 'error');
    const finishedAt = new Date().toISOString();
    const status = failed.length === 0 ? 'success' : failed.length === results.length ? 'error' : 'partial';

    try {
      await executeSql(connection, warehouseId, `INSERT INTO \`${catalog}\`.\`analytics\`.\`sync_runs\`
        VALUES (${sqlString(run.id)}, 'Base44', ${sqlString(requested.join(','))}, ${total}, ${sqlString(status)}, ${sqlTimestamp(startedAt)}, ${sqlTimestamp(finishedAt)}, ${sqlString(safeJson(results))})`);
    } catch (_) {
      // Base44 remains the authoritative audit trail if the Databricks audit insert fails.
    }

    await base44.asServiceRole.entities.DatabricksSyncRun.update(run.id, {
      status,
      finished_at: finishedAt,
      records_count: total,
      details: JSON.stringify(results),
      error: failed.map((item) => `${item.entity}: ${item.error}`).join('\n'),
    });

    await base44.asServiceRole.entities.DatabricksConfig.update(config.id, {
      last_sync_at: finishedAt,
      connection_status: failed.length === results.length ? 'error' : 'ready',
      last_error: failed.map((item) => `${item.entity}: ${item.error}`).join('\n'),
    });

    return Response.json({ ok: failed.length !== results.length, status, records: total, results, finishedAt });
  } catch (error: any) {
    const finishedAt = new Date().toISOString();
    try {
      if (run?.id && base44) {
        await base44.asServiceRole.entities.DatabricksSyncRun.update(run.id, {
          status: 'error', finished_at: finishedAt, error: error.message || 'Databricks sync failed.',
        });
      }
      if (config?.id && base44) {
        await base44.asServiceRole.entities.DatabricksConfig.update(config.id, {
          connection_status: 'error', last_error: error.message || 'Databricks sync failed.',
        });
      }
    } catch (_) {}
    return Response.json({ error: error.message || 'Databricks sync failed.' }, { status: 500 });
  }
}
