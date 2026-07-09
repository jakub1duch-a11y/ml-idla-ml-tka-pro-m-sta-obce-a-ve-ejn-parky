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

  const handleUpload = async (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    setUploading(true);
    for (const file of selected) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.MediaFile.create({ file_url, file_name: file.name, file_type: file.type });
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
    load();
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