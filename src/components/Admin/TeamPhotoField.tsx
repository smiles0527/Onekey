import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { apiService } from '../../services/api';
import { resolveTeamImageSrc } from '../../utils/teamImageUrl';

const VIEWPORT = 260;   // px — square cropper viewport
const OUTPUT   = 800;   // px — output image size

interface Props {
  id: string;
  label?: string;
  value: string;
  onChange: (path: string) => void;
  required?: boolean;
}

// ─── helpers ────────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/** Maximum pan offset so the image always fills the viewport. */
function maxPan(naturalPx: number, scale: number) {
  const drawn = naturalPx * scale;
  return Math.max(0, (drawn - VIEWPORT) / 2);
}

async function urlToDataUrl(src: string): Promise<string> {
  // For data URLs already – return as-is
  if (src.startsWith('data:')) return src;
  // For everything else – fetch as blob (works for Firebase Storage public URLs)
  const res = await fetch(src);
  if (!res.ok) throw new Error('Could not load image');
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
// ────────────────────────────────────────────────────────────

const TeamPhotoField: React.FC<Props> = ({
  id, label = 'Photo', value, onChange, required = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const imgRef       = useRef<HTMLImageElement | null>(null);
  const dragRef      = useRef<{ sx: number; sy: number; cx: number; cy: number } | null>(null);

  const [sourceDataUrl, setSourceDataUrl] = useState<string | null>(null);
  const [crop,    setCrop]    = useState({ x: 0, y: 0 });
  const [zoom,    setZoom]    = useState(1);
  const [loading, setLoading] = useState(false); // loading existing photo into cropper
  const [uploading, setUploading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const previewSrc = resolveTeamImageSrc(value);

  // ── Draw ──────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseScale = Math.max(VIEWPORT / img.naturalWidth, VIEWPORT / img.naturalHeight);
    const scale = baseScale * zoom;
    const dw = img.naturalWidth  * scale;
    const dh = img.naturalHeight * scale;
    const ox = (VIEWPORT - dw) / 2 + crop.x;
    const oy = (VIEWPORT - dh) / 2 + crop.y;

    ctx.clearRect(0, 0, VIEWPORT, VIEWPORT);
    ctx.drawImage(img, ox, oy, dw, dh);
  }, [crop, zoom]);

  // useLayoutEffect so the canvas is guaranteed to be in the DOM before we draw
  useLayoutEffect(() => {
    if (sourceDataUrl) draw();
  }, [sourceDataUrl, crop, zoom, draw]);

  // ── Load image into cropper ────────────────────────────────
  const openCropper = (dataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setError(null);
      setSourceDataUrl(dataUrl);
    };
    img.onerror = () => setError('Failed to load image.');
    img.src = dataUrl;
  };

  // ── File picker ────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') openCropper(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ── Adjust-crop existing photo ─────────────────────────────
  const handleAdjustExisting = async () => {
    if (!previewSrc) return;
    setLoading(true);
    setError(null);
    try {
      const dataUrl = await urlToDataUrl(previewSrc);
      openCropper(dataUrl);
    } catch {
      setError('Cannot load this photo for cropping. Upload the original file instead.');
    } finally {
      setLoading(false);
    }
  };

  // ── Pan / drag ─────────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { sx: e.clientX, sy: e.clientY, cx: crop.x, cy: crop.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !imgRef.current) return;
    const img = imgRef.current;
    const baseScale = Math.max(VIEWPORT / img.naturalWidth, VIEWPORT / img.naturalHeight);
    const scale = baseScale * zoom;
    const mx = maxPan(img.naturalWidth,  scale);
    const my = maxPan(img.naturalHeight, scale);

    setCrop({
      x: clamp(dragRef.current.cx + e.clientX - dragRef.current.sx, -mx, mx),
      y: clamp(dragRef.current.cy + e.clientY - dragRef.current.sy, -my, my),
    });
  };

  const handlePointerUp = () => { dragRef.current = null; };

  // ── Zoom change — re-clamp pan ─────────────────────────────
  const handleZoom = (newZoom: number) => {
    setZoom(newZoom);
    if (!imgRef.current) return;
    const img = imgRef.current;
    const baseScale = Math.max(VIEWPORT / img.naturalWidth, VIEWPORT / img.naturalHeight);
    const scale = baseScale * newZoom;
    const mx = maxPan(img.naturalWidth,  scale);
    const my = maxPan(img.naturalHeight, scale);
    setCrop(c => ({ x: clamp(c.x, -mx, mx), y: clamp(c.y, -my, my) }));
  };

  // ── Apply crop & upload ────────────────────────────────────
  const handleApply = async () => {
    if (!sourceDataUrl || !imgRef.current) return;
    setUploading(true);
    setError(null);
    try {
      const img = imgRef.current;
      const baseScale = Math.max(VIEWPORT / img.naturalWidth, VIEWPORT / img.naturalHeight);
      const scale = baseScale * zoom;
      const ox = (VIEWPORT - img.naturalWidth  * scale) / 2 + crop.x;
      const oy = (VIEWPORT - img.naturalHeight * scale) / 2 + crop.y;

      // Convert viewport [0, VIEWPORT] → source image coordinates
      const srcX = clamp(-ox / scale, 0, img.naturalWidth);
      const srcY = clamp(-oy / scale, 0, img.naturalHeight);
      const srcW = clamp((VIEWPORT - ox) / scale - srcX, 0, img.naturalWidth  - srcX);
      const srcH = clamp((VIEWPORT - oy) / scale - srcY, 0, img.naturalHeight - srcY);

      const out = document.createElement('canvas');
      out.width  = OUTPUT;
      out.height = OUTPUT;
      out.getContext('2d')!.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT, OUTPUT);

      const blob = await new Promise<Blob>((res, rej) =>
        out.toBlob(b => b ? res(b) : rej(new Error('Crop failed')), 'image/jpeg', 0.92)
      );

      const result = await apiService.uploadImage(
        new File([blob], `team-${Date.now()}.jpg`, { type: 'image/jpeg' })
      );

      if (result.success && result.data) {
        onChange(result.data.filePath);
        setSourceDataUrl(null);
        imgRef.current = null;
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Could not upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSourceDataUrl(null);
    imgRef.current = null;
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setError(null);
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="form-group tpf">
      <label htmlFor={id}>{label}{required ? ' *' : ''}</label>

      {/* Preview of currently saved photo */}
      {previewSrc && !sourceDataUrl && (
        <div className="tpf__preview">
          <img src={previewSrc} alt="Current" />
        </div>
      )}

      {/* Cropper */}
      {sourceDataUrl && (
        <div className="tpf__cropper">
          <p className="tpf__hint">Drag to pan &middot; slider to zoom</p>

          <canvas
            ref={canvasRef}
            width={VIEWPORT}
            height={VIEWPORT}
            className="tpf__canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />

          <label className="tpf__zoom-label">
            Zoom
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={e => handleZoom(Number(e.target.value))}
              className="tpf__zoom-slider"
            />
          </label>

          {error && <p className="tpf__error">{error}</p>}

          <div className="tpf__crop-btns">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCancel}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleApply}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : 'Apply & upload'}
            </button>
          </div>
        </div>
      )}

      {/* Action buttons when no cropper is open */}
      {!sourceDataUrl && (
        <div className="tpf__actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            {value ? 'Replace photo' : 'Choose photo'}
          </button>

          {value && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAdjustExisting}
              disabled={loading}
            >
              {loading ? 'Loading…' : 'Adjust crop'}
            </button>
          )}

          {error && <p className="tpf__error">{error}</p>}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        tabIndex={-1}
        aria-label={`${label} file`}
      />
    </div>
  );
};

export default TeamPhotoField;
