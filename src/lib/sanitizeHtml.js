// Client-side HTML sanitizer to prevent stored XSS when rendering
// admin-authored blog content via dangerouslySetInnerHTML.
import DOMPurify from 'dompurify';

export function sanitizeHtml(html) {
  if (!html) return '';
  return DOMPurify.sanitize(html);
}