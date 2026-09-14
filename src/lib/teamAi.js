import { base44 } from '@/api/base44Client';

export const AI_AUTHOR = { author_email: 'ai@mlzidla.cz', author_name: 'AI asistent' };

const VISUAL_RE = /(ikon\w*|logo|vizu[aá]l\w*|obr[aá]z\w*|render\w*|grafik\w*|ilustrac\w*|piktogram\w*)/i;
const BRAND_STYLE = 'Značka MLŽIDLA® (nerezová mlžítka a mlžné brány pro města a zahrady). Paleta: deep navy #0A1628, ocean blue #153863, signal cyan #22D3EE, bílá. Čistý minimalistický plochý design, jasné tvary, bez textu, jednobarevné pozadí.';

export const isAiMention = (text) => /^@ai\b/i.test(text.trim());
const stripMention = (text) => text.replace(/^@ai\s*/i, '').trim();

const formatHistory = (messages) => messages.slice(-30).map((m) => `${m.author_name || m.author_email}: ${m.message}`).join('\n');

export async function respondAsAi(channel, text, history) {
  const prompt = stripMention(text);
  if (VISUAL_RE.test(prompt)) {
    const { url } = await base44.integrations.Core.GenerateImage({ prompt: `${BRAND_STYLE} Zadání: ${prompt}` });
    return base44.entities.TeamMessage.create({ channel, ...AI_AUTHOR, kind: 'image', image_url: url, message: `Návrh k zadání: ${prompt}` });
  }
  const answer = await base44.integrations.Core.InvokeLLM({
    prompt: `Jsi interní AI asistent týmu MLŽIDLA® / HolmTec (nerezová mlžítka, mlžné brány, chytré ovládání mlžení pro města, obce, architekty a zahrady). Odpovídej česky, stručně, prakticky a s konkrétními doporučeními. Pokud tým řeší design, navrhni varianty a zdůvodni je.\n\nPoslední zprávy v kanálu:\n${formatHistory(history)}\n\nDotaz: ${prompt}`,
  });
  return base44.entities.TeamMessage.create({ channel, ...AI_AUTHOR, kind: 'ai', message: String(answer) });
}

export async function summarizeMeeting({ channel, channelLabel, messages, userName }) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `Vytvoř česky strukturovaný zápis z týmové komunikace kanálu „${channelLabel}“ týmu MLŽIDLA® / HolmTec. Buď věcný a konkrétní, nevymýšlej nic, co v komunikaci není.\n\nKomunikace:\n${formatHistory(messages)}`,
    response_json_schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        summary: { type: 'string' },
        decisions: { type: 'array', items: { type: 'string' } },
        action_items: { type: 'array', items: { type: 'string' } },
        recommendations: { type: 'array', items: { type: 'string' } },
      },
    },
  });
  const note = await base44.entities.MeetingNote.create({
    channel,
    channel_label: channelLabel,
    title: result.title || `Zápis ${new Date().toLocaleDateString('cs-CZ')}`,
    summary: result.summary || '',
    decisions: result.decisions || [],
    action_items: result.action_items || [],
    recommendations: result.recommendations || [],
    message_count: messages.length,
    period_from: messages[0]?.created_date,
    period_to: messages[messages.length - 1]?.created_date,
    created_by_name: userName,
  });
  await base44.entities.TeamMessage.create({ channel, ...AI_AUTHOR, kind: 'summary', message: `📝 ${note.title}\n\n${note.summary}` });
  return note;
}

export function noteToMarkdown(n) {
  const list = (items) => (items?.length ? items.map((i) => `- ${i}`).join('\n') : '- —');
  return `# ${n.title}\n\nKanál: ${n.channel_label || n.channel}\nVytvořeno: ${new Date(n.created_date).toLocaleString('cs-CZ')}${n.created_by_name ? ` · ${n.created_by_name}` : ''}\n\n## Shrnutí\n${n.summary}\n\n## Rozhodnutí\n${list(n.decisions)}\n\n## Úkoly\n${list(n.action_items)}\n\n## Doporučení\n${list(n.recommendations)}\n`;
}

export function chatToText(channelLabel, messages) {
  const lines = messages.map((m) => `[${new Date(m.created_date).toLocaleString('cs-CZ')}] ${m.author_name || m.author_email}: ${m.message}${m.image_url ? ` (vizuál: ${m.image_url})` : ''}`);
  return `Týmový chat MLŽIDLA® — #${channelLabel}\nExport: ${new Date().toLocaleString('cs-CZ')}\n\n${lines.join('\n')}\n`;
}

export function downloadText(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}