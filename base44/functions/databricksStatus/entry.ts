import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { listWarehouses, normalizeDatabricksHost } from '../../shared/databricks.ts';

export default async function(req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const configs = await base44.asServiceRole.entities.DatabricksConfig.filter({ key: 'primary' }, '-created_date', 1, 0);
    const config = Array.isArray(configs) ? configs[0] : null;
    if (!config) return Response.json({ ok: true, configured: false, reason: 'missing_config' });

    const host = normalizeDatabricksHost(config.workspace_host);
    if (!host) {
      return Response.json({
        ok: true,
        configured: false,
        connected: false,
        bootstrapStatus: config.bootstrap_status || 'not_started',
        connectionStatus: config.connection_status || 'unconfigured',
        reason: 'workspace_host_required',
      });
    }

    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('databricks');
      const warehouses = await listWarehouses({ host, accessToken });
      const selected = config.warehouse_id
        ? warehouses.find((item: any) => item.id === config.warehouse_id)
        : warehouses.find((item: any) => String(item.state || '').toUpperCase() === 'RUNNING') || warehouses[0] || null;

      await base44.asServiceRole.entities.DatabricksConfig.update(config.id, {
        connection_status: config.bootstrap_status === 'ready' ? 'ready' : 'connected',
        last_error: '',
      });

      return Response.json({
        ok: true,
        configured: true,
        connected: true,
        host,
        catalog: config.catalog || 'mlzidla',
        warehouseId: selected?.id || config.warehouse_id || null,
        warehouseName: selected?.name || null,
        warehouseState: selected?.state || null,
        warehouses: warehouses.map((item: any) => ({
          id: item.id,
          name: item.name,
          state: item.state,
          serverless: Boolean(item.enable_serverless_compute),
        })),
        bootstrapStatus: config.bootstrap_status || 'not_started',
        connectionStatus: config.bootstrap_status === 'ready' ? 'ready' : 'connected',
        lastSyncAt: config.last_sync_at || null,
        syncEnabled: config.sync_enabled !== false,
      });
    } catch (error: any) {
      await base44.asServiceRole.entities.DatabricksConfig.update(config.id, {
        connection_status: 'awaiting_oauth',
        last_error: error.message || 'Databricks connector is not authorized.',
      });
      return Response.json({
        ok: true,
        configured: true,
        connected: false,
        host,
        bootstrapStatus: config.bootstrap_status || 'not_started',
        connectionStatus: 'awaiting_oauth',
        reason: 'connector_authorization_required',
        error: error.message || 'Databricks connector is not authorized.',
      });
    }
  } catch (error: any) {
    return Response.json({ error: error.message || 'Databricks status failed.' }, { status: 500 });
  }
}
