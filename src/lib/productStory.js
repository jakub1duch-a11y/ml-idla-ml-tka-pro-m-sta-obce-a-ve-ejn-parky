// Rozdělí dlouhý popis produktu (HTML nebo plain text) do smysluplných sekcí.

function textOf(node) {
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
}

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu;

function clean(text) {
  return text.replace(EMOJI, '').replace(/\s+/g, ' ').trim();
}

function shortTitle(text) {
  const base = clean(text);
  const colon = base.indexOf(':');
  if (colon > 4 && colon < 55) return base.slice(0, colon).replace(/[,–—]$/, '').trim();
  const firstSentence = base.split(/(?<=[.!?])\s/)[0] || base;
  return firstSentence.replace(/[.:!?,]+$/, '').split(' ').slice(0, 4).join(' ');
}

export function splitDescriptionIntoSections(description) {
  if (!description || typeof description !== 'string') return [];

  const doc = new DOMParser().parseFromString(`<div>${description}</div>`, 'text/html');
  const root = doc.body.firstElementChild;
  const nodes = Array.from(root?.children || []);

  const sections = [];
  const push = (title) => { sections.push({ title, paragraphs: [], bullets: [] }); };
  const current = () => sections[sections.length - 1];

  if (nodes.length === 0) {
    // Plain text bez HTML — rozdělíme na odstavce
    const chunks = description.split(/\n{2,}|\r\n\r\n/).map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
    const paras = chunks.length > 1 ? chunks : (description.match(/[^.!?]+[.!?]+/g) || [description]).map((s) => s.trim());
    for (let i = 0; i < paras.length; i += 2) {
      const group = paras.slice(i, i + 2);
      push(shortTitle(group[0]));
      current().paragraphs = group.map(clean);
    }
    return sections.filter((s) => s.paragraphs.length > 0);
  }

  nodes.forEach((node) => {
    const tag = node.tagName.toLowerCase();
    const text = textOf(node);
    if (/^h[1-6]$/.test(tag)) {
      if (text) push(text);
      return;
    }
    if (tag === 'ul' || tag === 'ol') {
      if (!current()) push('Přehled');
      current().bullets.push(...Array.from(node.querySelectorAll('li')).map((li) => clean(textOf(li))).filter(Boolean));
      return;
    }
    if (!text) return;
    if (!current() || (current().paragraphs.length >= 2 && current().title.startsWith('…'))) {
      push(`… ${shortTitle(text)}`);
    } else if (!current()) {
      push(shortTitle(text));
    }
    current().paragraphs.push(clean(text));
  });

  return sections
    .filter((s) => s.paragraphs.length > 0 || s.bullets.length > 0)
    .map((s) => ({ ...s, title: s.title.replace(/^…\s*/, '') }));
}