import React, { useState, useEffect, useRef } from 'react';
import { Loader, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MediaGrid from '@/components/admin/media/MediaGrid';

export default function AdminMedia() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const load = () => {
    setLoading(true);
    base44.entities.MediaFile.list('-created_date').then(setFiles).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Automatické přiřazení známých produktových videí podle názvu souboru.
  // Pokud název neznáme, soubor se bezpečně uloží jako NEZAŘAZENÉ a lze jej přiřadit ručně.
  const inferMediaMeta = (fileName = '') => {
    const name = fileName.toLowerCase();

    const rules = [
      { match: 'a912389b-814c-4922-8d8c-d71f9d9299f9', product_slug: 'y-armist-j70', media_group: 'Y-ARMIST', media_role: 'video' },
      { match: '2fd97cdc-fc16-43b3-9cbd-f2ee2df7112a', product_slug: 'ostrev-mlzitko', media_group: 'OSTREV', media_role: 'video' },
      { match: '6289d5ae-5b3d-431d-a492-6c6715db31d8', product_slug: 'bendy-alej', media_group: 'STEBLO', media_role: 'video' },
      { match: '0a03edab-eaa0-4441-81a2-5a441952900b', product_slug: 'bendy-alej', media_group: 'STEBLO', media_role: 'video' },
      { match: '8bb4e2b2-ac18-45a8-a168-469875a62f92', product_slug: 'bendy-alej', media_group: 'STEBLO', media_role: 'video' },
      { match: 'b266039d-56cf-4df7-b37b-b7500928b599', product_slug: 'bendy-alej', media_group: 'STEBLO', media_role: 'video' },
      { match: 'vid_20260802_154033_723', product_slug: 'mlzitko-bendy', media_group: 'BENDY', media_role: 'video' },
      { match: '20b69394-a9b7-4bf1-8647-eca79925590c', product_slug: 'linea-solo', media_group: 'LINEA', media_role: 'video' },
      { match: '25b2b26b-bd81-4748-b0e5-fa4a106993ed', product_slug: '', media_group: 'GENERAL', media_role: 'marketing' },
      { match: 'mlzitka-kolekce-nove-video', product_slug: '', media_group: 'MARKETING', media_role: 'video' },
      { match: 'mlzitko-linea-steblo-video', product_slug: 'linea-solo', media_group: 'LINEA_STEBLO', media_role: 'video' },
      { match: 'mlzitko-ostrev-video', product_slug: 'ostrev-mlzitko', media_group: 'OSTREV', media_role: 'video' },
    ];

    const rule = rules.find((item) => name.includes(item.match));
    return rule || { product_slug: '', media_group: 'NEZAŘAZENÉ', media_role: 'unassigned' };
  };

  const handleUpload = async (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    setUploading(true);
    try {
      let order = Date.now();
      for (const file of selected) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        const meta = inferMediaMeta(file.name);
        await base44.entities.MediaFile.create({
          file_url,
          file_name: file.name,
          file_type: file.type,
          ...meta,
          sort_order: order++,
        });
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
      load();
    }
  };

  const handleDelete = async (id) => {
    await base44.entities.MediaFile.delete(id);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-lg font-medium">Media knihovna ({files.length})</h2>
          <p className="text-white/30 text-xs font-mono mt-1">Odkazy na soubory jsou dostupné z mlzidla.cz</p>
        </div>
        <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono cursor-pointer transition-all ${uploading ? 'bg-white/10 text-white/40' : 'bg-cyan text-ink hover:bg-cyan/90'}`}>
          {uploading ? <Loader size={13} className="animate-spin" /> : <Upload size={13} />}
          {uploading ? 'Nahrávám...' : 'Nahrát soubory'}
          <input ref={inputRef} type="file" multiple accept="image/*,video/*,application/pdf" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-cyan/40" /></div>
      ) : (
        <MediaGrid files={files} onDelete={handleDelete} />
      )}
    </div>
  );
}