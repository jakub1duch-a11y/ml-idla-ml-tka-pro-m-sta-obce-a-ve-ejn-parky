import React, { useState, useEffect, useMemo } from 'react';
import { Users, Plus, Sparkles, Copy, Check, ExternalLink, Filter, Trash2, Send, Link2, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SEGMENTS = [
  { value: 'architekt', label: 'Architekt', color: 'bg-violet-100 text-violet-700' },
  { value: 'starosta', label: 'Starosta', color: 'bg-amber-100 text-amber-700' },
  { value: 'mistostarosta', label: 'Místostarosta', color: 'bg-amber-50 text-amber-600' },
  { value: 'manazer', label: 'Manažer veřejných zakázek', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'projektant', label: 'Projektant / inženýr', color: 'bg-blue-100 text-blue-700' },
  { value: 'rozvojove_odbory', label: 'Odbor rozvoje města', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'jiny', label: 'Jiné', color: 'bg-slate-100 text-slate-600' },
];

const STATUSES = [
  { value: 'novy', label: 'Nový', color: 'bg-slate-100 text-slate-600' },
  { value: 'ke_kontaktu', label: 'Ke kontaktu', color: 'bg-blue-50 text-blue-700' },
  { value: 'kontaktovano', label: 'Kontaktováno', color: 'bg-cyan-50 text-cyan-700' },
  { value: 'odpovedel', label: 'Odpověděl', color: 'bg-emerald-50 text-emerald-700' },
  { value: 'schuzka', label: 'Schůzka', color: 'bg-violet-50 text-violet-700' },
  { value: 'odmitnuto', label: 'Odmítnuto', color: 'bg-rose-50 text-rose-600' },
  { value: 'archivovano', label: 'Archivováno', color: 'bg-slate-50 text-slate-400' },
];

const REFERENCES = [
  { key: 'zoo_praha', label: 'ZOO Praha', url: 'https://mlzidla.cz/reference/mlzitka-pro-zoo-praha' },
  { key: 'polna', label: 'Město Polná', url: 'https://mlzidla.cz/reference/mesto-polna-mlzitko-mrkev' },
  { key: 'jicin', label: 'Město Jičín', url: 'https://mlzidla.cz/reference/bendy-jicinske-namesti' },
];

const segmentMeta = (value) => SEGMENTS.find((s) => s.value === value) || SEGMENTS[SEGMENTS.length - 1];
const statusMeta = (value) => STATUSES.find((s) => s.value === value) || STATUSES[0];

export default function AdminProspects() {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSegment, setFilterSegment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', organization: '', linkedin_url: '', email: '', phone: '', segment: 'jiny', notes: '' });
  const [generatingId, setGeneratingId] = useState('');
  const [copiedId, setCopiedId] = useState('');
  const [expandedId, setExpandedId] = useState('');
  const [error, setError] = useState('');

  const loadProspects = async () => {
    setLoading(true);
    try {
      const records = await base44.entities.LinkedInProspect.list('-created_date', 500);
      setProspects(records || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProspects(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return prospects.filter((p) => {
      if (filterSegment && p.segment !== filterSegment) return false;
      if (filterStatus && p.status !== filterStatus) return false;
      if (!q) return true;
      return [p.name, p.role, p.organization, p.email, p.notes].filter(Boolean).join(' ').toLowerCase().includes(q);
    });
  }, [prospects, filterSegment, filterStatus, search]);

  const stats = useMemo(() => {
    const byStatus = {};
    prospects.forEach((p) => { byStatus[p.status] = (byStatus[p.status] || 0) + 1; });
    return {
      total: prospects.length,
      keKontaktu: byStatus.ke_kontaktu || 0,
      kontaktovano: byStatus.kontaktovano || 0,
      odpovedel: byStatus.odpovedel || 0,
      schuzka: byStatus.schuzka || 0,
    };
  }, [prospects]);

  const createProspect = async () => {
    if (!form.name.trim()) return;
    try {
      await base44.entities.LinkedInProspect.create({
        ...form,
        status: 'novy',
        reference_used: 'zoo_praha',
      });
      setForm({ name: '', role: '', organization: '', linkedin_url: '', email: '', phone: '', segment: 'jiny', notes: '' });
      setShowForm(false);
      loadProspects();
    } catch (err) { setError(err.message); }
  };

  const deleteProspect = async (id) => {
    try { await base44.entities.LinkedInProspect.delete(id); loadProspects(); }
    catch (err) { setError(err.message); }
  };

  const generateMessage = async (prospect, refKey) => {
    setGeneratingId(prospect.id);
    setError('');
    try {
      const response = await base44.functions.invoke('generateProspectMessage', {
        prospect_id: prospect.id,
        reference_key: refKey,
      });
      if (response.data?.ok) {
        loadProspects();
      } else { setError(response.data?.error || 'Generování selhalo.'); }
    } catch (err) { setError(err.message); }
    finally { setGeneratingId(''); }
  };

  const updateStatus = async (id, status) => {
    try {
      await base44.entities.LinkedInProspect.update(id, {
        status,
        last_contacted_at: ['kontaktovano', 'odpovedel', 'schuzka'].includes(status) ? new Date().toISOString() : undefined,
      });
      loadProspects();
    } catch (err) { setError(err.message); }
  };

  const copyMessage = async (prospect) => {
    const message = prospect.outreach_message || '';
    const signature = `\n\nIng. Radek Meduna · MLŽIDLA® / HolmTec · mlzidla.cz · +420 774 700 390`;
    await navigator.clipboard.writeText(message + signature);
    setCopiedId(prospect.id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const markContacted = async (prospect) => {
    await updateStatus(prospect.id, 'kontaktovano');
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
            <Users size={20} className="text-cyan" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">LinkedIn Prospecting</h1>
            <p className="text-white/40 text-xs">Vyhledávání a sledování klíčových profilů — architekti, starostové, manažeři veřejných zakázek</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Celkem', value: stats.total, color: 'text-white' },
          { label: 'Ke kontaktu', value: stats.keKontaktu, color: 'text-blue-400' },
          { label: 'Kontaktováno', value: stats.kontaktovano, color: 'text-cyan-400' },
          { label: 'Odpovědělo', value: stats.odpovedel, color: 'text-emerald-400' },
          { label: 'Schůzky', value: stats.schuzka, color: 'text-violet-400' },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 rounded-xl p-4 border border-white/5">
            <p className="text-2xl font-bold {s.color}">{s.value}</p>
            <p className="text-white/40 text-[10px] uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Reference panel */}
      <div className="mb-6 rounded-xl border border-cyan/20 bg-cyan/5 p-4">
        <p className="text-cyan text-xs font-semibold mb-2 flex items-center gap-2"><Link2 size={13} /> Reference pro zprávy</p>
        <div className="flex flex-wrap gap-2">
          {REFERENCES.map((ref) => (
            <a key={ref.key} href={ref.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-xs text-white/70 hover:bg-white/15 transition">
              {ref.label} <ExternalLink size={10} />
            </a>
          ))}
        </div>
      </div>

      {/* Filters + Add */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hledat jméno, organizaci, e-mail…"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan/40"
          />
        </div>
        <select value={filterSegment} onChange={(e) => setFilterSegment(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 outline-none">
          <option value="">Všechny segmenty</option>
          {SEGMENTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 outline-none">
          <option value="">Všechny stavy</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 bg-cyan text-ink px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-cyan/90 transition">
          <Plus size={16} /> Přidat kontakt
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-5 rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jméno a příjmení *" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan/40" />
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Pozice (starosta, architekt…)" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan/40" />
            <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Organizace / město / firma" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan/40" />
            <input value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} placeholder="LinkedIn URL" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan/40" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="E-mail (volitelné)" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan/40" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telefon (volitelné)" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan/40" />
            <select value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/70 outline-none">
              {SEGMENTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Poznámky (kontext z profilu, aktuality…)" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan/40 sm:col-span-2" />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={createProspect} disabled={!form.name.trim()} className="bg-cyan text-ink px-5 py-2.5 rounded-lg text-sm font-bold disabled:opacity-40 hover:bg-cyan/90 transition">Uložit kontakt</button>
            <button onClick={() => setShowForm(false)} className="text-white/50 px-4 py-2.5 rounded-lg text-sm hover:text-white transition">Zrušit</button>
          </div>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-rose-400 bg-rose-500/10 rounded-lg px-3 py-2">{error}</p>}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader size={28} className="animate-spin text-white/30" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-white/40 text-sm">
          {prospects.length === 0 ? 'Zatím nejsou žádné kontakty. Přidejte první profil pomocí tlačítka „Přidat kontakt".' : 'Žádné kontakty neodpovídají filtrům.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((prospect) => {
            const seg = segmentMeta(prospect.segment);
            const st = statusMeta(prospect.status);
            const ref = REFERENCES.find((r) => r.key === prospect.reference_used) || REFERENCES[0];
            const isExpanded = expandedId === prospect.id;
            return (
              <div key={prospect.id} className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
                <div className="p-4 lg:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-semibold text-sm">{prospect.name}</h3>
                        {prospect.role && <span className="text-white/40 text-xs">· {prospect.role}</span>}
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${seg.color}`}>{seg.label}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${st.color}`}>{st.label}</span>
                      </div>
                      {prospect.organization && <p className="text-white/50 text-xs mt-1">{prospect.organization}</p>}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {prospect.linkedin_url && <a href={prospect.linkedin_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan/70 text-xs hover:text-cyan"><Link2 size={11} /> LinkedIn</a>}
                        {prospect.email && <span className="text-white/40 text-xs">{prospect.email}</span>}
                        {prospect.phone && <span className="text-white/40 text-xs">{prospect.phone}</span>}
                        <span className="text-white/30 text-[10px]">Ref: {ref.label}</span>
                      </div>
                      {prospect.notes && <p className="text-white/40 text-xs mt-2 italic">{prospect.notes}</p>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => setExpandedId(isExpanded ? '' : prospect.id)} className="text-white/40 hover:text-white p-1.5 rounded-lg transition" title="Rozbalit zprávu">
                        <Sparkles size={15} />
                      </button>
                      <a href={prospect.linkedin_url || '#'} target="_blank" rel="noreferrer" className="text-white/40 hover:text-cyan p-1.5 rounded-lg transition" title="Otevřít LinkedIn">
                        <ExternalLink size={15} />
                      </a>
                      <button onClick={() => deleteProspect(prospect.id)} className="text-white/30 hover:text-rose-400 p-1.5 rounded-lg transition" title="Smazat">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 border-t border-white/8 pt-4">
                      {prospect.outreach_message ? (
                        <div>
                          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                            <p className="text-white/80 text-sm whitespace-pre-line leading-relaxed">{prospect.outreach_message}</p>
                            <div className="mt-3 pt-3 border-t border-white/8 text-white/40 text-xs">
                              Ing. Radek Meduna · MLŽIDLA® / HolmTec · mlzidla.cz · +420 774 700 390
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <button onClick={() => copyMessage(prospect)} className="inline-flex items-center gap-1.5 bg-cyan text-ink px-4 py-2 rounded-lg text-xs font-bold hover:bg-cyan/90 transition">
                              {copiedId === prospect.id ? <><Check size={14} /> Zkopírováno</> : <><Copy size={14} /> Kopírovat zprávu</>}
                            </button>
                            <button onClick={() => markContacted(prospect)} className="inline-flex items-center gap-1.5 border border-white/15 text-white/70 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 transition">
                              <Send size={13} /> Označit jako kontaktováno
                            </button>
                            <select value={prospect.status} onChange={(e) => updateStatus(prospect.id, e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 outline-none">
                              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-white/40 text-xs mb-3">Zpráva ještě nebyla vygenerována. Vyberte referenci a vygenerujte personalizované oslovení.</p>
                          <div className="flex flex-wrap gap-2">
                            {REFERENCES.map((refOpt) => (
                              <button key={refOpt.key} onClick={() => generateMessage(prospect, refOpt.key)} disabled={generatingId === prospect.id} className="inline-flex items-center gap-1.5 border border-cyan/30 bg-cyan/5 text-cyan px-4 py-2 rounded-lg text-xs font-semibold hover:bg-cyan/15 disabled:opacity-40 transition">
                                {generatingId === prospect.id ? <Loader size={13} className="animate-spin" /> : <Sparkles size={13} />}
                                Generovat s {refOpt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}