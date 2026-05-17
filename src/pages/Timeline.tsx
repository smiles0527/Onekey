import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import { useTimelineStore, TimelineEvent } from '../store/timelineStore';
import { apiService } from '../services/firebaseService';
import Slideshow from '../components/Slideshow';
import { getRandomPhotos } from '../data/photos';

// ─── Category config ──────────────────────────────────────────────────────────
const CAT = {
  performances: {
    label: 'Performances',
    icon: 'fas fa-music',
    color: 'text-earth-300',
    bg: 'bg-earth-500/15',
    border: 'border-earth-400/30',
    dot: 'bg-earth-400',
    glow: 'shadow-earth-500/30',
  },
  homework: {
    label: 'Homework Help',
    icon: 'fas fa-graduation-cap',
    color: 'text-sage-300',
    bg: 'bg-sage-500/15',
    border: 'border-sage-400/30',
    dot: 'bg-sage-400',
    glow: 'shadow-sage-500/30',
  },
  charity: {
    label: 'Charity',
    icon: 'fas fa-heart',
    color: 'text-rose-300',
    bg: 'bg-rose-500/15',
    border: 'border-rose-400/30',
    dot: 'bg-rose-400',
    glow: 'shadow-rose-500/30',
  },
} as const;

type CatKey = keyof typeof CAT;
type FilterKey = 'all' | CatKey;

// ─── Blank form ───────────────────────────────────────────────────────────────
const BLANK = {
  name: '', date: '', category: 'performances' as CatKey,
  location: '', time: '', attendees: '', performers: '',
  duration: '', description: '', photo: null as File | null,
};

// ─── Safe date parse ──────────────────────────────────────────────────────────
function safeFormat(dateStr: string, fmt: string): string {
  try { return format(parseISO(dateStr), fmt); }
  catch { return dateStr; }
}

// ─── Input component (dark-themed) ───────────────────────────────────────────
const TInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className={`tlm-input ${props.className ?? ''}`} />
);
const TTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea {...props} className={`tlm-input resize-none ${props.className ?? ''}`} />
);
const TSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...props }) => (
  <select {...props} className={`tlm-input ${props.className ?? ''}`}>{children}</select>
);

// ─── Main component ───────────────────────────────────────────────────────────
const Timeline: React.FC = () => {
  const heroImages = useMemo(() => getRandomPhotos(6), []);

  const { isAuthenticated, user, hasPermission } = useAuthStore();
  const { events, addEvent, removeEvent, updateEvent, fetchEvents, isLoading } = useTimelineStore();

  // UI
  const [filter, setFilter]     = useState<FilterKey>('all');
  const [sortDir, setSortDir]   = useState<'desc' | 'asc'>('desc');
  const [expandedId, setExpand] = useState<string | null>(null);

  // Modals
  const [showAdd, setShowAdd]           = useState(false);
  const [editing, setEditing]           = useState<TimelineEvent | null>(null);
  const [deleteId, setDeleteId]         = useState<string | null>(null);
  const [submitting, setSubmitting]     = useState(false);
  const [formError, setFormError]       = useState<string | null>(null);

  // Form
  const [form, setForm]             = useState({ ...BLANK });
  const [photoPreview, setPreview]  = useState<string | null>(null);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const canManage = !!(isAuthenticated && user && hasPermission('manage_timeline'));

  // ── Derived data ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const base = filter === 'all' ? events : events.filter(e => e.category === filter);
    return [...base].sort((a, b) => {
      const d = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortDir === 'desc' ? -d : d;
    });
  }, [events, filter, sortDir]);

  // Year groups with global alternating index pre-computed
  const yearGroups = useMemo(() => {
    let gi = 0;
    const map = new Map<string, (TimelineEvent & { _left: boolean })[]>();
    filtered.forEach(ev => {
      const yr = safeFormat(ev.date, 'yyyy');
      if (!map.has(yr)) map.set(yr, []);
      map.get(yr)!.push({ ...ev, _left: gi++ % 2 === 0 });
    });
    return Array.from(map.entries()).map(([year, evs]) => ({ year, events: evs }));
  }, [filtered]);

  const stats = useMemo(() => ({
    total:        events.length,
    performances: events.filter(e => e.category === 'performances').length,
    homework:     events.filter(e => e.category === 'homework').length,
    charity:      events.filter(e => e.category === 'charity').length,
  }), [events]);

  // ── Modal helpers ───────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm({ ...BLANK });
    setPreview(null);
    setFormError(null);
    setShowAdd(true);
  };

  const openEdit = (ev: TimelineEvent) => {
    setForm({
      name: ev.name, date: ev.date, category: ev.category,
      location: ev.location ?? '', time: ev.time ?? '',
      attendees: ev.attendees ?? '', performers: ev.performers ?? '',
      duration: ev.duration ?? '', description: ev.description ?? '',
      photo: null,
    });
    setPreview(ev.photo ?? null);
    setFormError(null);
    setEditing(ev);
  };

  const closeModal = () => {
    setShowAdd(false);
    setEditing(null);
    setFormError(null);
    setSubmitting(false);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(p => ({ ...p, photo: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setFormError(null);
    try {
      let photoUrl: string | null = editing?.photo ?? null;
      if (form.photo) {
        const res = await apiService.uploadImage(form.photo);
        if (res.success && res.data) photoUrl = res.data.filePath;
        else setFormError('Photo upload failed — event saved without new photo.');
      }

      const payload = {
        name: form.name, date: form.date, category: form.category,
        location:    form.location    || undefined,
        time:        form.time        || undefined,
        attendees:   form.attendees   || undefined,
        performers:  form.performers  || undefined,
        duration:    form.duration    || undefined,
        description: form.description || undefined,
        photo: photoUrl,
        createdBy: user.id,
      };

      if (editing) await updateEvent(editing.id, payload);
      else          await addEvent(payload);

      closeModal();
    } catch (err: any) {
      setFormError(err.message ?? 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await removeEvent(deleteId);
    if (expandedId === deleteId) setExpand(null);
    setDeleteId(null);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-900">

      {/* ── Hero ── */}
      <section className="hero-section" style={{ minHeight: '52vh' }}>
        <motion.div className="hero-section__media">
          <Slideshow images={heroImages} interval={5500} overlay={false} />
        </motion.div>
        <div className="hero-section__scrim" aria-hidden />
        <div className="hero-section__content container">
          <motion.div
            className="hero-section__panel"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <p className="hero-section__eyebrow">Our Chronicle</p>
            <h1 className="hero-section__title">
              text
            </h1>
            <p className="hero-section__subtitle">
              text
            </p>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.button
          aria-label="Scroll to timeline"
          onClick={() => document.getElementById('timeline-body')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/60 hover:text-white/90 transition-colors cursor-pointer bg-transparent border-0 p-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-xs tracking-widest uppercase font-medium">scroll</span>
          <motion.i
            className="fas fa-chevron-down text-lg"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.button>
      </section>

      {/* ── Stats strip ── */}
      <div id="timeline-body" className="border-b border-white/8 bg-stone-900/80 backdrop-blur-sm">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Total Events',       value: stats.total,        color: 'text-white' },
              { label: 'Performances',        value: stats.performances, color: 'text-earth-400' },
              { label: 'Tutoring Sessions',   value: stats.homework,     color: 'text-sage-400' },
              { label: 'Charity Events',      value: stats.charity,      color: 'text-rose-400' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`text-4xl font-bold font-display ${s.color}`}>{s.value}</div>
                <div className="mt-1 text-[11px] font-semibold tracking-widest uppercase text-stone-500">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-[4.4rem] z-30 bg-stone-900/92 backdrop-blur-md border-b border-white/8">
        <div className="container py-3 flex flex-wrap items-center gap-2 justify-between">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'performances', 'homework', 'charity'] as const).map(cat => {
              const active = filter === cat;
              const meta = cat !== 'all' ? CAT[cat] : null;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                    active
                      ? meta
                        ? `${meta.bg} ${meta.color} ${meta.border}`
                        : 'bg-white/12 text-white border-white/25'
                      : 'bg-transparent text-stone-500 border-white/10 hover:text-stone-300 hover:border-white/20'
                  }`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {cat === 'all' ? 'All Events' : meta!.label}
                </motion.button>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-stone-500 border border-white/10 hover:text-stone-300 hover:border-white/20 transition-all"
            >
              <i className={`fas fa-sort-amount-${sortDir === 'desc' ? 'down' : 'up'}`} />
              {sortDir === 'desc' ? 'Newest first' : 'Oldest first'}
            </button>
            {canManage && (
              <motion.button
                onClick={openAdd}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-earth-600 hover:bg-earth-500 text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <i className="fas fa-plus" />
                Add Event
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* ── Timeline body ── */}
      <section className="container max-w-5xl py-16">

        {/* Loading */}
        {isLoading && filtered.length === 0 && (
          <div className="py-24 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-white/20 border-t-earth-400 rounded-full animate-spin" />
            <p className="text-sm text-stone-500">Loading chronicle…</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <motion.div className="py-24 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-7xl mb-5 opacity-20 font-display">◎</div>
            <h3 className="text-xl font-semibold text-stone-300 mb-2">No events yet</h3>
            <p className="text-sm text-stone-500">
              {canManage
                ? 'Add the first event to start building the chronicle.'
                : 'The story is just beginning — check back soon.'}
            </p>
            {canManage && (
              <motion.button
                onClick={openAdd}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-earth-600 hover:bg-earth-500 text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <i className="fas fa-plus" /> Add first event
              </motion.button>
            )}
          </motion.div>
        )}

        {/* The actual timeline */}
        {filtered.length > 0 && (
          <div className="relative">
            {/* Vertical spine */}
            <div
              className="absolute left-[1.1rem] md:left-1/2 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1) 5%, rgba(255,255,255,0.1) 95%, transparent)' }}
            />

            {yearGroups.map((group) => (
              <div key={group.year}>
                {/* Year pill */}
                <motion.div
                  className="relative flex items-center mb-6 mt-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Year ring on spine */}
                  <div className="absolute left-[1.1rem] md:left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white/30 ring-4 ring-stone-900 z-10" />
                  {/* Year label — centered desktop, offset mobile */}
                  <div className="ml-10 md:ml-0 md:w-full md:flex md:justify-center">
                    <span className="inline-block px-4 py-0.5 text-xs font-bold font-display text-stone-300 bg-stone-800 border border-white/15 rounded-full tracking-widest">
                      {group.year}
                    </span>
                  </div>
                </motion.div>

                {/* Events */}
                {group.events.map((event, ei) => {
                  const meta      = CAT[event.category];
                  const isLeft    = event._left;
                  const isExpanded = expandedId === event.id;

                  return (
                    <motion.div
                      key={event.id}
                      className="relative flex mb-10"
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.5, delay: Math.min(ei * 0.07, 0.35) }}
                    >
                      {/* Dot on spine */}
                      <div
                        className={`absolute left-[1.1rem] md:left-1/2 top-5 z-10 w-3 h-3 -translate-x-1/2 rounded-full ring-4 ring-stone-900 shadow-lg ${meta.dot} ${meta.glow}`}
                      />

                      {/* Mobile: all cards offset to the right of spine */}
                      {/* Desktop: alternate left / right of spine */}

                      {/* Left spacer (desktop only, for right-side cards) */}
                      {!isLeft && <div className="hidden md:block flex-1" />}

                      {/* Card wrapper */}
                      <div className={`
                        flex-1 pl-10 md:pl-0 md:flex-none md:w-[calc(50%-2.5rem)]
                        ${isLeft ? 'md:mr-auto md:pr-0' : 'md:ml-auto md:pl-0'}
                      `}>
                        <motion.article
                          className="group bg-stone-800/55 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors cursor-pointer"
                          whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.35)' }}
                          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                          onClick={() => setExpand(isExpanded ? null : event.id)}
                        >
                          {/* Cover photo */}
                          {event.photo && (
                            <div className="aspect-[16/7] overflow-hidden">
                              <motion.img
                                src={event.photo}
                                alt={event.name}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.7 }}
                                loading="lazy"
                                onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
                              />
                            </div>
                          )}

                          <div className="p-5">
                            {/* Top row: category + date + admin actions */}
                            <div className="flex items-start justify-between gap-2 mb-2.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${meta.bg} ${meta.color} ${meta.border}`}>
                                  <i className={`${meta.icon} text-[9px]`} />
                                  {meta.label}
                                </span>
                                <time className="text-[11px] text-stone-500">
                                  {safeFormat(event.date, 'MMMM d, yyyy')}
                                </time>
                              </div>

                              {/* Admin controls — visible on hover */}
                              {canManage && (
                                <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={e => { e.stopPropagation(); openEdit(event); }}
                                    className="p-1.5 rounded-lg text-stone-500 hover:text-earth-300 hover:bg-earth-500/15 transition-all"
                                    title="Edit event"
                                  >
                                    <i className="fas fa-pencil-alt text-xs" />
                                  </button>
                                  <button
                                    onClick={e => { e.stopPropagation(); setDeleteId(event.id); }}
                                    className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                    title="Delete event"
                                  >
                                    <i className="fas fa-trash-alt text-xs" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className="text-[1.05rem] font-bold text-white leading-snug mb-3">{event.name}</h3>

                            {/* Quick-info chips */}
                            {(event.location || event.time || event.duration) && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {event.location && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] text-stone-400 bg-white/5 border border-white/8">
                                    <i className="fas fa-map-marker-alt text-[9px] text-earth-400" />
                                    {event.location}
                                  </span>
                                )}
                                {event.time && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] text-stone-400 bg-white/5 border border-white/8">
                                    <i className="fas fa-clock text-[9px] text-stone-500" />
                                    {event.time}
                                  </span>
                                )}
                                {event.duration && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] text-stone-400 bg-white/5 border border-white/8">
                                    <i className="fas fa-hourglass-half text-[9px] text-stone-500" />
                                    {event.duration}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Description preview (collapsed) */}
                            {event.description && !isExpanded && (
                              <p className="text-sm text-stone-400 leading-relaxed line-clamp-2 mb-1">
                                {event.description}
                              </p>
                            )}

                            {/* Expanded content */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                                  style={{ overflow: 'hidden' }}
                                >
                                  {event.description && (
                                    <p className="text-sm text-stone-300 leading-relaxed whitespace-pre-wrap mb-4">
                                      {event.description}
                                    </p>
                                  )}
                                  {(event.attendees || event.performers) && (
                                    <div className="flex flex-wrap gap-4 pt-3 border-t border-white/10">
                                      {event.attendees && (
                                        <div className="flex items-center gap-1.5 text-xs text-stone-400">
                                          <i className="fas fa-users text-earth-400" />
                                          <span>{event.attendees} attendees</span>
                                        </div>
                                      )}
                                      {event.performers && (
                                        <div className="flex items-center gap-1.5 text-xs text-stone-400">
                                          <i className="fas fa-music text-earth-400" />
                                          <span>{event.performers} performers</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Expand toggle */}
                            {(event.description || event.attendees || event.performers) && (
                              <div className="mt-3 flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-400 transition-colors select-none">
                                <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-[8px]`} />
                                {isExpanded ? 'Collapse' : 'Read more'}
                              </div>
                            )}
                          </div>
                        </motion.article>
                      </div>

                      {/* Right spacer (desktop, for left-side cards) */}
                      {isLeft && <div className="hidden md:block flex-1" />}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Photo archive link ── */}
      <div className="border-t border-white/8 py-8">
        <div className="container text-center">
          <a
            href="https://drive.google.com/drive/u/0/folders/1SASLgBECg8h7-37JtEGAVDpu0_5hwyHZ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-earth-300 transition-colors"
          >
            <i className="fab fa-google-drive" />
            View full photo archive on Google Drive
          </a>
        </div>
      </div>

      {/* ── Add / Edit modal ── */}
      <AnimatePresence>
        {(showAdd || editing) && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="w-full max-w-2xl bg-stone-900 border border-white/12 rounded-2xl shadow-2xl"
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="text-sm font-bold text-white font-display uppercase tracking-widest">
                  {editing ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button onClick={closeModal} className="p-1.5 rounded-lg text-stone-500 hover:text-white hover:bg-white/10 transition-all">
                  <i className="fas fa-times" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[78vh]">
                <div className="space-y-4">
                  {formError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/30 text-sm text-red-300">
                      {formError}
                    </div>
                  )}

                  {/* Name + Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="tlm-label">Event Name *</label>
                      <TInput
                        type="text"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Spring Concert at Sunrise Manor"
                        required
                      />
                    </div>
                    <div>
                      <label className="tlm-label">Category *</label>
                      <TSelect
                        value={form.category}
                        onChange={e => setForm(p => ({ ...p, category: e.target.value as CatKey }))}
                        required
                      >
                        <option value="performances">Performances</option>
                        <option value="homework">Homework Help</option>
                        <option value="charity">Charity Events</option>
                      </TSelect>
                    </div>
                  </div>

                  {/* Date + Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="tlm-label">Date *</label>
                      <TInput
                        type="date"
                        value={form.date}
                        onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="tlm-label">Time</label>
                      <TInput
                        type="time"
                        value={form.time}
                        onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Location + Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="tlm-label">Location</label>
                      <TInput
                        type="text"
                        value={form.location}
                        onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                        placeholder="e.g. Sunrise Manor, Room 4"
                      />
                    </div>
                    <div>
                      <label className="tlm-label">Duration</label>
                      <TInput
                        type="text"
                        value={form.duration}
                        onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                        placeholder="e.g. 2 hours"
                      />
                    </div>
                  </div>

                  {/* Attendees + Performers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="tlm-label">Attendees</label>
                      <TInput
                        type="text"
                        value={form.attendees}
                        onChange={e => setForm(p => ({ ...p, attendees: e.target.value }))}
                        placeholder="e.g. 45 seniors"
                      />
                    </div>
                    <div>
                      <label className="tlm-label">Performers / Volunteers</label>
                      <TInput
                        type="text"
                        value={form.performers}
                        onChange={e => setForm(p => ({ ...p, performers: e.target.value }))}
                        placeholder="e.g. 8 student volunteers"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="tlm-label">Description</label>
                    <TTextarea
                      rows={6}
                      value={form.description}
                      onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Tell the story of this event — what happened, who was there, what made it meaningful…"
                    />
                  </div>

                  {/* Photo upload */}
                  <div>
                    <label className="tlm-label">Cover Photo</label>
                    <label className="block cursor-pointer">
                      <div className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/12 rounded-xl overflow-hidden transition-all hover:border-earth-400/40 hover:bg-earth-500/5 ${photoPreview ? 'h-44' : 'h-28'}`}>
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <i className="fas fa-cloud-upload-alt text-2xl text-stone-600" />
                            <span className="text-xs text-stone-500">Click to choose a cover photo</span>
                          </>
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                    </label>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={() => { setPreview(null); setForm(p => ({ ...p, photo: null })); }}
                        className="mt-1.5 text-xs text-stone-500 hover:text-stone-300 transition-colors"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm text-stone-400 hover:text-white transition-colors"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      className="px-5 py-2 text-sm font-semibold bg-earth-600 hover:bg-earth-500 text-white rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={submitting}
                    >
                      {submitting
                        ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                        : editing ? 'Update Event' : 'Add Event'
                      }
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete confirmation ── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              className="w-full max-w-sm bg-stone-900 border border-white/12 rounded-2xl shadow-2xl p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-400/25 flex items-center justify-center mb-4">
                <i className="fas fa-trash-alt text-red-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Delete this event?</h3>
              <p className="text-sm text-stone-400 mb-6">This cannot be undone. The event will be permanently removed from the chronicle.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 text-sm text-stone-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;
