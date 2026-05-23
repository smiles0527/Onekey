import React, { useEffect, useRef, useState } from 'react';
import { usePhotoStore } from '../../store/photoStore';
import { PHOTO_CATEGORIES, PhotoCategory, PhotoRecord } from '../../services/firebaseService';
import { BUILTIN_PHOTOS } from '../../data/builtinPhotos';

type FilterKey = 'all' | PhotoCategory;

const PhotoManager: React.FC = () => {
  const photos      = usePhotoStore(s => s.photos);
  const isLoading   = usePhotoStore(s => s.isLoading);
  const error       = usePhotoStore(s => s.error);
  const fetchPhotos = usePhotoStore(s => s.fetchPhotos);
  const upload      = usePhotoStore(s => s.uploadPhoto);
  const remove      = usePhotoStore(s => s.deletePhoto);
  const recategorize = usePhotoStore(s => s.recategorizePhoto);

  const [filter, setFilter]               = useState<FilterKey>('all');
  const [uploadCategory, setUploadCategory] = useState<PhotoCategory>('onekey');
  const [isDragging, setIsDragging]       = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number; failed: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  const visiblePhotos = filter === 'all'
    ? photos
    : photos.filter(p => p.category === filter);

  const visibleBuiltins = filter === 'all'
    ? BUILTIN_PHOTOS
    : BUILTIN_PHOTOS.filter(p => p.category === filter);

  // Counts include both uploaded and built-in for accurate totals
  const countsByCategory = PHOTO_CATEGORIES.reduce<Record<string, number>>((acc, c) => {
    acc[c.id] =
      photos.filter(p => p.category === c.id).length +
      BUILTIN_PHOTOS.filter(p => p.category === c.id).length;
    return acc;
  }, {});

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (list.length === 0) return;
    setUploadProgress({ done: 0, total: list.length, failed: 0 });

    for (let i = 0; i < list.length; i++) {
      const result = await upload(list[i], uploadCategory);
      setUploadProgress(prev => prev && {
        done:   prev.done + 1,
        total:  prev.total,
        failed: prev.failed + (result ? 0 : 1),
      });
    }
    setTimeout(() => setUploadProgress(null), 2500);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };

  const onDelete = async (photo: PhotoRecord) => {
    if (!window.confirm(`Delete "${photo.filename}"? This cannot be undone.`)) return;
    await remove(photo);
  };

  const categoryMeta = (id: PhotoCategory) => PHOTO_CATEGORIES.find(c => c.id === id);

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fafaf9', margin: 0 }}>Photo Manager</h2>
        <p style={{ fontSize: '0.875rem', color: '#a8a29e', marginTop: 4 }}>
          Upload and organize photos. Uploaded photos automatically appear in the matching page's slideshow / gallery.
        </p>
      </div>

      {/* Upload dropzone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          borderRadius: 14,
          padding: '32px 24px',
          textAlign: 'center', cursor: 'pointer',
          background: isDragging ? 'rgba(200,164,110,0.15)' : '#231f1c',
          border: `2px dashed ${isDragging ? '#c8a46e' : 'rgba(200,164,110,0.3)'}`,
          transition: 'all 0.2s',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files) { handleFiles(e.target.files); e.target.value = ''; } }}
        />
        <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fafaf9', marginBottom: 6 }}>
          {isDragging ? 'Drop to upload' : 'Drag photos here or click to browse'}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#78716c' }}>
          Max 12 MB per image · JPG / PNG / WEBP / GIF
        </div>

        {/* Category to upload into */}
        <div
          style={{ marginTop: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}
          onClick={e => e.stopPropagation()}
        >
          <span style={{ fontSize: '0.8rem', color: '#a8a29e' }}>Upload into:</span>
          {PHOTO_CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setUploadCategory(c.id)}
              style={{
                padding: '5px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600,
                background: uploadCategory === c.id ? c.color : 'rgba(255,255,255,0.06)',
                color: uploadCategory === c.id ? '#1c1917' : '#a8a29e',
                border: `1px solid ${uploadCategory === c.id ? c.color : 'rgba(255,255,255,0.1)'}`,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Upload progress */}
        {uploadProgress && (
          <div style={{ marginTop: 16, fontSize: '0.85rem', color: '#c8a46e' }}>
            Uploaded {uploadProgress.done} of {uploadProgress.total}
            {uploadProgress.failed > 0 && <span style={{ color: '#fb7185' }}> · {uploadProgress.failed} failed</span>}
          </div>
        )}
      </div>

      {error && (
        <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 8, background: 'rgba(251,113,133,0.1)', color: '#fb7185', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Filter chips */}
      <div style={{ marginTop: 28, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '6px 14px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600,
            background: filter === 'all' ? '#fafaf9' : 'rgba(255,255,255,0.05)',
            color: filter === 'all' ? '#1c1917' : '#a8a29e',
            border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
          }}
        >
          All ({photos.length + BUILTIN_PHOTOS.length})
        </button>
        {PHOTO_CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            style={{
              padding: '6px 14px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600,
              background: filter === c.id ? c.color : 'rgba(255,255,255,0.05)',
              color: filter === c.id ? '#1c1917' : '#a8a29e',
              border: `1px solid ${filter === c.id ? c.color : 'rgba(255,255,255,0.1)'}`,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {c.label} ({countsByCategory[c.id] ?? 0})
          </button>
        ))}
      </div>

      {/* Uploaded grid */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a46e', marginBottom: 12 }}>
          Uploaded ({visiblePhotos.length})
        </h3>
        {isLoading && photos.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#78716c' }}>Loading…</div>
        )}
        {!isLoading && visiblePhotos.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: '#78716c', fontSize: '0.85rem', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 8 }}>
            No uploaded photos {filter !== 'all' ? `in ${categoryMeta(filter)?.label}` : 'yet'}.
          </div>
        )}
        {visiblePhotos.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}>
            {visiblePhotos.map(photo => {
              const meta = categoryMeta(photo.category);
              return (
                <div
                  key={photo.id}
                  style={{
                    borderRadius: 10, overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: '#1a1714', position: 'relative',
                  }}
                >
                  <div style={{ aspectRatio: '4/3', background: '#0a0a0a', overflow: 'hidden' }}>
                    <img src={photo.url} alt={photo.filename}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#a8a29e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      title={photo.filename}>
                      {photo.filename}
                    </div>
                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <select
                        value={photo.category}
                        onChange={e => recategorize(photo.id, e.target.value as PhotoCategory)}
                        style={{
                          flex: 1, fontSize: '0.7rem', padding: '4px 6px', borderRadius: 4,
                          background: meta?.color ?? '#444', color: '#1c1917', fontWeight: 700,
                          border: 'none', cursor: 'pointer', appearance: 'none',
                        }}
                      >
                        {PHOTO_CATEGORIES.map(c => (
                          <option key={c.id} value={c.id} style={{ background: '#231f1c', color: '#fafaf9' }}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => onDelete(photo)}
                        title="Delete"
                        style={{
                          padding: '4px 10px', borderRadius: 4, fontSize: '0.7rem',
                          background: 'rgba(251,113,133,0.1)', color: '#fb7185',
                          border: '1px solid rgba(251,113,133,0.2)', cursor: 'pointer', fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Built-in grid (read-only) */}
      {visibleBuiltins.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#78716c', marginBottom: 6 }}>
            Built-in ({visibleBuiltins.length})
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#57534e', marginBottom: 12 }}>
            Photos shipped with the codebase. Read-only — to remove or change, edit <code style={{ color: '#a8a29e' }}>src/data/builtinPhotos.ts</code> in the repo.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}>
            {visibleBuiltins.map(photo => {
              const meta = categoryMeta(photo.category);
              return (
                <div
                  key={photo.src}
                  style={{
                    borderRadius: 10, overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.05)',
                    background: '#1a1714', position: 'relative',
                    opacity: 0.92,
                  }}
                >
                  <div style={{ aspectRatio: '4/3', background: '#0a0a0a', overflow: 'hidden', position: 'relative' }}>
                    <img src={photo.src} alt={photo.label}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <span style={{
                      position: 'absolute', top: 8, left: 8,
                      padding: '2px 8px', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700,
                      background: 'rgba(12,10,9,0.78)', color: '#a8a29e',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      backdropFilter: 'blur(6px)',
                    }}>
                      Built-in
                    </span>
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#a8a29e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      title={photo.label}>
                      {photo.label}
                    </div>
                    <div style={{ marginTop: 6, display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700,
                      background: meta?.color ?? '#444', color: '#1c1917', letterSpacing: '0.04em' }}>
                      {meta?.label ?? photo.category}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoManager;
