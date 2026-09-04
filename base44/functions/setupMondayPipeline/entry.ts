import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ensurePipelineGroups, PIPELINE_STAGES } from '../../shared/mondayPipeline.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const token = process.env.MONDAY_API_TOKEN;
    const boardId = Number(process.env.MONDAY_BOARD_ID);
    if (!token || !boardId) {
      return Response.json({ error: 'MONDAY_API_TOKEN a MONDAY_BOARD_ID nejsou nastaveny. Doplňte je v Nastavení → Tajné klíče.' }, { status: 400 });
    }

    const groups = await ensurePipelineGroups(token, boardId);
    return Response.json({
      ok: true,
      board_id: boardId,
      groups,
      stages: PIPELINE_STAGES,
      missing: PIPELINE_STAGES.filter((s) => !groups[s.key]).map((s) => s.key),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});