// Pure three-way reconciliation. No remote writes. A persisted, verified common
// snapshot and stable record ID are prerequisites to applying a plan.
export const EDITABLE_CONTACT_FIELDS = Object.freeze(['name', 'organization', 'role', 'next_step']);
const valid = v => typeof v === 'string' && v.length <= 5000;
export function planContactSync({ id, baseline, base44, sheet }) {
  const result = { id, toBase44: {}, toSheet: {}, conflicts: [], unchanged: [] };
  if (typeof id !== 'string' || !id || [baseline,base44,sheet].some(r=>!r || r.id!==id)) {
    result.conflicts.push({field:'id', reason:'missing_or_mismatched_identity'});
    return result;
  }
  for (const field of EDITABLE_CONTACT_FIELDS) {
    const old = baseline[field], a = base44[field], b = sheet[field];
    if (![old,a,b].every(valid)) { result.conflicts.push({field, reason:'missing_or_invalid_snapshot'}); continue; }
    if (a===b) { result.unchanged.push(field); continue; }
    if (a!==old && b!==old) { result.conflicts.push({field, reason:'concurrent_edit'}); continue; }
    const value = a===old ? b : a;
    if (!value.trim() && old.trim()) { result.conflicts.push({field,reason:'explicit_clear_requires_review'}); continue; }
    if (a===old) result.toBase44[field]=b;
    else result.toSheet[field]=a;
  }
  return result;
}
