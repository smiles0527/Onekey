import React, { useCallback, useEffect, useRef, useState } from 'react';
import { apiService } from '../../services/api';
import { resolveTeamImageSrc } from '../../utils/teamImageUrl';

const VIEWPORT = 260;
const OUTPUT_SIZE = 800;

interface Props {
  id: string;
  label?: string;
  value: string;
  onChange: (path: string) => void;
  required?: boolean;
}

const TeamPhotoField: React.FC<Props> = ({ id, label = 'Photo', value, onChange, required = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [sourceDataUrl, setSourceDataUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dragRef = useRef<{ sx: number; sy: number; cx: number; cy: number } | null>(null);

  const previewSrc = resolveTeamImageSrc(value);

  // Draw the crop preview onto the canvas whenever source/crop/zoom changes
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseScale = Math.max(VIEWPORT / img.naturalWidth, VIEWPORT / img.naturalHeight);
    const scale = baseScale * zoom;
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;

    // Centre offset + pan
    const ox = (VIEWPORT - dw) / 2 + crop.x;
    const oy = (VIEWPORT - dh) / 2 + crop.y;

    ctx.clearRect(0, 0, VIEWPORT, VIEWPORT);
    ctx.drawImage(img, ox, oy, dw, dh);
  }, [crop, zoom]);

  useEffect(() => {
    if (sourceDataUrl) drawCanvas();
  }, [sourceDataUrl, crop, zoom, drawCanvas]);

  const loadSourceImage = (dataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setSourceDataUrl(dataUrl);
    };
    img.src = dataUrl;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') loadSourceImage(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Pointer drag handlers
  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { sx: e.clientX, sy: e.clientY, cx: crop.x, cy: crop.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setCrop({
      x: dragRef.current.cx + e.clientX - dragRef.current.sx,
      y: dragRef.current.cy + e.clientY - dragRef.current.sy,
    });
  };
  const onPointerUp = () => { dragRef.current = null; };

  const handleApply = async () => {
    if (!sourceDataUrl || !imgRef.current) return;
    setUploading(true);
    setError(null);
    try {
      // Draw final crop to an offscreen canvas at output resolution
      const img = imgRef.current;
      const baseScale = Math.max(VIEWPORT / img.naturalWidth, VIEWPORT / img.naturalHeight);
      const scale = baseScale * zoom;
      const ox = (VIEWPORT - img.naturalWidth * scale) / 2 + crop.x;
      const oy = (VIEWPORT - img.naturalHeight * scale) / 2 + crop.y;

      // Source rect in image coordinates
      const srcX = Math.max(0, -ox / scale);
      const srcY = Math.max(0, -oy / scale);
      const srcW = Math.min(img.naturalWidth - srcX, VIEWPORT / scale);
      const srcH = Math.min(img.naturalHeight - srcY, VIEWPORT / scale);

      const out = document.createElement('canvas');
      out.width = OUTPUT_SIZE;
      out.height = OUTPUT_SIZE;
      const ctx = out.getContext('2d')!;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      const blob = await new Promise<Blob>((res, rej) =>
        out.toBlob(b => b ? res(b) : rej(new Error('Crop failed')), 'image/jpeg', 0.92)
      );

      const file = new File([blob], `team-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const result = await apiService.uploadImage(file);
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
    setError(null);
  };

  return (
    <div className="form-group tpf">
      <label htmlFor={id}>{label}{required ? ' *' : ''}</label>

      {/* Current photo preview */}
      {previewSrc && !sourceDataUrl && (
        <div className="tpf__preview">
          <img src={previewSrc} alt="Current" />
        </div>
      )}

      {/* Cropper */}
      {sourceDataUrl && (
        <div className="tpf__cropper">
          <p className="tpf__hint">Drag to pan · slider to zoom</p>
          <canvas
            ref={canvasRef}
            width={VIEWPORT}
            height={VIEWPORT}
            className="tpf__canvas"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
          {/* re-draw when canvas mounts */}
          <div style={{ display: 'none' }} ref={() => { setTimeout(drawCanvas, 0); }} />

          <label className="tpf__zoom-label">
            Zoom
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="tpf__zoom-slider"
            />
          </label>

          {error && <p className="tpf__error">{error}</p>}

          <div className="tpf__crop-btns">
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancel} disabled={uploading}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleApply} disabled={uploading}>
              {uploading ? 'Uploading…' : 'Apply & upload'}
            </button>
          </div>
        </div>
      )}

      {/* File picker trigger */}
      {!sourceDataUrl && (
        <div className="tpf__actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current?.click()}>
            {value ? 'Replace photo' : 'Choose photo'}
          </button>
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
