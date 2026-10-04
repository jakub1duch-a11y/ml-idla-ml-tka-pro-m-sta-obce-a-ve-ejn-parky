import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { callSupla, suplaConfigStatus } from '../../shared/suplaApi.ts';

const tools = [
  { name: 'supla_list_channels', description: 'Načte dostupné SUPLA kanály a jejich stav.', inputSchema: { type: 'object', properties: {} } },
  { name: 'supla_get_channel', description: 'Načte detail jednoho SUPLA kanálu.', inputSchema: { type: 'object', properties: { channelId: { type: 'string' } }, required: ['channelId'] } },
  { name: 'supla_toggle_channel', description: 'Zapne nebo vypne kanál po explicitním potvrzení správce.', inputSchema: { type: 'object', properties: { channelId: { type: 'string' }, on: { type: 'boolean' } }, required: ['channelId', 'on'] } },
];

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const input = await req.json().catch(() => ({}));
    if (input.method === 'tools/list') return Response.json({ tools, config: suplaConfigStatus() });
    if (input.method !== 'tools/call') return Response.json({ jsonrpc: '2.0', error: { code: -32601, message: 'Použijte tools/list nebo tools/call.' } }, { status: 400 });
    const name = input.params?.name;
    const args = input.params?.arguments || {};
    const map: Record<string, { action: 'list_channels'|'get_channel'|'toggle_channel' }> = {
      supla_list_channels: { action: 'list_channels' }, supla_get_channel: { action: 'get_channel' }, supla_toggle_channel: { action: 'toggle_channel' },
    };
    if (!map[name]) return Response.json({ jsonrpc: '2.0', error: { code: -32602, message: 'Neznámý SUPLA nástroj.' } }, { status: 400 });
    const data = await callSupla(map[name].action, args);
    return Response.json({ jsonrpc: '2.0', result: { content: [{ type: 'text', text: JSON.stringify(data) }] } });
  } catch (error) {
    return Response.json({ jsonrpc: '2.0', error: { code: -32000, message: error?.message || String(error) } }, { status: 502 });
  }
}