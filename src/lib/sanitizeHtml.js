// Minimal client-side HTML sanitizer to prevent stored XSS when rendering
// admin-authored blog content via dangerouslySetInnerHTML.
const DANGEROUS_TAGS = ['script', 'iframe', 'object', 'embed', 'link', 'style', 'form', 'meta', 'base'];

export function sanitizeHtml(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');

  doc.body.querySelectorAll('*').forEach((el) => {
    if (DANGEROUS_TAGS.includes(el.tagName.toLowerCase())) {
      el.remove();
      return;
    }
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();
      const isUrlAttr = name === 'href' || name === 'src';
      if (name.startsWith('on') || (isUrlAttr && value.startsWith('javascript:'))) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
}