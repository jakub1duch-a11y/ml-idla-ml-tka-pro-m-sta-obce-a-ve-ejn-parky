import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { bootstrapMlzidlaLakehouse, normalizeDatabricksHost } from '../../shared/databricks.ts';

export default async function(req: Request) {
  const startedAt = new Date().toISOString();
  let run: any = null;
  let config: any = null;
  let base44: any = null;

  try {
    base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const configs = await base44.asServiceRole.entities.DatabricksConfig.filter({ key: 'primary' }, '-created_date', 1, 0);
    config = Array.isArray(configs) ? configs[0] : null;
    if (!config) return Response.json({ error: 'DatabricksConfig nebyl nalezen.' }, { status: 400 });

    const host = normalizeDatabricksHost(config.workspace_host);
    if (!host) return Response.json({ error: 'Nejdřív je nutné uložit Databricks Workspace URL.' }, { status: 400 });

    run = await base44.asServiceRole.entities.DatabricksSyncRun.create({
      run_type: 'bootstrap',
      status: 'running',
      started_at: startedAt,
      records_count: 0,
      catalog: config.catalog || 'mlzidla',
      details: 'Inicializace Mlzidla.cz lakehouse struktury.',
    });

    await base44.asServiceRole.entities.DatabricksConfig.update(config.id, {
      bootstrap_status: 'running',
      connection_status: 'connected',
      last_error: '',
    });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('databricks');
    const result = await bootstrapMlzidlaLakehouse(
      { host, accessToken, warehouseId: config.warehouse_id || null },
      config.warehouse_id || null,
      config.catalog || 'mlzidla',
    );

    const finishedAt = new Date().toISOString();
    await base44.asServiceRole.entities.DatabricksConfig.update(config.id, {
      workspace_host: host,
      warehouse_id: result.warehouseId,
      catalog: result.catalog,
      connection_status: 'ready',
      bootstrap_status: 'ready',
      last_error: '',
    });

    if (run?.id) {
      await base44.asServiceRole.entities.DatabricksSyncRun.update(run.id, {
        status: result.warnings.length ? 'partial' : 'success',
        finished_at: finishedAt,
        warehouse_id: result.warehouseId,
        catalog: result.catalog,
        details: JSON.stringify({
          warehouse: { id: result.warehouseId, name: result.warehouse?.name, state: result.warehouse?.state },
          schemas: ['raw', 'core', 'analytics', 'ai'],
          warnings: result.warnings,
        }),
      });
    }

    return Response.json({
      ok: true,
      host,
      warehouseId: result.warehouseId,
      warehouseName: result.warehouse?.name || null,
      catalog: result.catalog,
      schemas: ['raw', 'core', 'analytics', 'ai'],
      warnings: result.warnings,
      ready: true,
    });
  } catch (error: any) {
    const finishedAt = new Date().toISOString();
    try {
      if (config?.id && base44) {
        await base44.asServiceRole.entities.DatabricksConfig.update(config.id, {
          bootstrap_status: 'error',
          connection_status: 'error',
          last_error: error.message || 'Databricks bootstrap failed.',
        });
      }
      if (run?.id && base44) {
        await base44.asServiceRole.entities.DatabricksSyncRun.update(run.id, {
          status: 'error',
          finished_at: finishedAt,
          error: error.message || 'Databricks bootstrap failed.',
        });
      }
    } catch (_) {
      // Preserve original failure; audit update is best-effort only.
    }
    return Response.json({ error: error.message || 'Databricks bootstrap failed.' }, { status: 500 });
  }
}
