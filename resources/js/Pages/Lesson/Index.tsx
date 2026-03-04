import { Head, Link, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import {
    BookOpen,
    Heart,
    Home,
    Music,
    PlusSquare,
    Search,
    Upload,
    Video,
    X,
} from 'lucide-react';
import { LessonItem, PageProps } from '@/types';

// ─── Avatar ──────────────────────────────────────────────────────────────────

function Avatar({
    name,
    photoUrl,
    size = 32,
}: {
    name: string;
    photoUrl?: string | null;
    size?: number;
}) {
    return (
        <div
            className="shrink-0 overflow-hidden rounded-full bg-surface-elevated flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            {photoUrl ? (
                <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
                <span className="font-bold text-accent" style={{ fontSize: size * 0.38 }}>
                    {name.charAt(0).toUpperCase()}
                </span>
            )}
        </div>
    );
}

// ─── Level badge ──────────────────────────────────────────────────────────────

const levelColors: Record<string, string> = {
    beginner:     'bg-green-900/60 text-green-400',
    intermediate: 'bg-yellow-900/60 text-yellow-400',
    pro:          'bg-red-900/60 text-red-400',
};

function LevelBadge({ level }: { level: string }) {
    return (
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${levelColors[level] ?? 'bg-surface-elevated text-text-secondary'}`}>
            {level}
        </span>
    );
}

// ─── Submit Lesson Modal ──────────────────────────────────────────────────────

function SubmitModal({ onClose }: { onClose: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title:       '',
        description: '',
        level:       'beginner',
        tags:        '',
        video:       null as File | null,
    });

    const fileRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('level', data.level);
        // split tags by comma
        data.tags.split(',').map(t => t.trim()).filter(Boolean).forEach(t => formData.append('tags[]', t));
        if (data.video) formData.append('video', data.video);

        router.post(route('lesson.store'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => { reset(); onClose(); },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl p-6">
                <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-white">
                    <X size={20} />
                </button>
                <h2 className="text-lg font-bold mb-5">Submit a Lesson</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1">Title *</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            placeholder="E.g. How to play Hotel California intro"
                            className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-sm text-white placeholder-text-secondary focus:outline-none focus:border-accent"
                            required
                        />
                        {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1">Description</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows={3}
                            placeholder="What will students learn?"
                            className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-sm text-white placeholder-text-secondary focus:outline-none focus:border-accent resize-none"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-text-secondary mb-1">Level *</label>
                            <select
                                value={data.level}
                                onChange={e => setData('level', e.target.value)}
                                className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="pro">Pro</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-text-secondary mb-1">Tags (comma-separated)</label>
                            <input
                                type="text"
                                value={data.tags}
                                onChange={e => setData('tags', e.target.value)}
                                placeholder="fingerpicking, blues, acoustic"
                                className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-sm text-white placeholder-text-secondary focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1">Video *</label>
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-accent transition-colors py-8 cursor-pointer"
                        >
                            <Video size={32} className="text-text-secondary" />
                            {data.video ? (
                                <span className="text-sm text-white">{data.video.name}</span>
                            ) : (
                                <span className="text-sm text-text-secondary">Click to choose video (MP4, MOV, AVI)</span>
                            )}
                        </div>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="video/mp4,video/quicktime,video/x-msvideo"
                            className="hidden"
                            onChange={e => setData('video', e.target.files?.[0] ?? null)}
                        />
                        {errors.video && <p className="text-xs text-red-400 mt-1">{errors.video}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-semibold text-white disabled:opacity-60 hover:bg-accent/90 transition-colors"
                    >
                        <Upload size={16} />
                        {processing ? 'Submitting…' : 'Submit for Review'}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ─── Lesson Card ──────────────────────────────────────────────────────────────

function LessonCard({ lesson }: { lesson: LessonItem }) {
    const [playing, setPlaying] = useState(false);

    return (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
            {/* Video thumbnail / player */}
            {lesson.video_url ? (
                <div className="relative aspect-video bg-black">
                    {playing ? (
                        <video
                            src={lesson.video_url}
                            autoPlay
                            controls
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <button
                            onClick={() => setPlaying(true)}
                            className="absolute inset-0 flex items-center justify-center group"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/90 shadow-[0_0_20px_rgba(255,77,0,0.5)] group-hover:scale-105 transition-transform">
                                <svg className="w-6 h-6 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </button>
                    )}
                </div>
            ) : (
                <div className="aspect-video bg-surface-elevated flex items-center justify-center">
                    <BookOpen size={40} className="text-text-secondary" />
                </div>
            )}

            {/* Details */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white leading-snug">{lesson.title}</h3>
                    <LevelBadge level={lesson.level} />
                </div>
                {lesson.description && (
                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">{lesson.description}</p>
                )}
                {lesson.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {lesson.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-surface-elevated text-text-secondary px-2 py-0.5 rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
                <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>{lesson.user?.name ?? 'Unknown'}</span>
                    <span>{lesson.created_at}</span>
                </div>
            </div>
        </div>
    );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────

function MobileBottomNav({
    authUser,
    onSubmit,
}: {
    authUser: { id: number; name: string; profile_photo_url?: string | null };
    onSubmit: () => void;
}) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden items-center justify-around border-t border-border bg-surface h-16 px-2">
            <Link href={route('video.feed')} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-text-secondary hover:text-white transition-colors">
                <Home size={24} />
                <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link href={route('profile.show')} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-text-secondary hover:text-white transition-colors">
                <Search size={24} />
                <span className="text-[10px] font-medium">Search</span>
            </Link>
            <button onClick={onSubmit} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-text-secondary hover:text-white transition-colors">
                <PlusSquare size={24} />
                <span className="text-[10px] font-medium">Submit</span>
            </button>
            <Link href={route('lesson.index')} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-white transition-colors">
                <BookOpen size={24} className="text-accent" />
                <span className="text-[10px] font-medium">Lessons</span>
            </Link>
            <Link href={route('profile.show')} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-text-secondary hover:text-white transition-colors">
                <Avatar name={authUser.name} photoUrl={authUser.profile_photo_url} size={26} />
                <span className="text-[10px] font-medium">Profile</span>
            </Link>
        </nav>
    );
}

// ─── Left Sidebar ─────────────────────────────────────────────────────────────

function LeftSidebar({
    authUser,
    onSubmit,
}: {
    authUser: { id: number; name: string; profile_photo_url?: string | null };
    onSubmit: () => void;
}) {
    const navItems = [
        { icon: Home,      label: 'Home',    href: route('video.feed'),    active: false, onClick: undefined as (() => void) | undefined },
        { icon: Search,    label: 'Search',  href: route('profile.show'),  active: false, onClick: undefined as (() => void) | undefined },
        { icon: BookOpen,  label: 'Lessons', href: route('lesson.index'),  active: true,  onClick: undefined as (() => void) | undefined },
        { icon: PlusSquare,label: 'Submit',  href: '#',                    active: false, onClick: onSubmit },
        { icon: Heart,     label: 'Liked',   href: route('profile.show'),  active: false, onClick: undefined as (() => void) | undefined },
    ];

    return (
        <aside className="fixed top-0 left-0 h-full w-16 xl:w-56 hidden md:flex flex-col border-r border-border bg-surface z-40 py-6 px-2 xl:px-4">
            {/* Logo */}
            <Link href={route('video.feed')} className="flex items-center gap-2.5 mb-8 px-1 xl:px-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent shadow-[0_0_14px_rgba(255,77,0,0.5)]">
                    <Music size={18} className="text-white" />
                </div>
                <span className="hidden xl:block text-base font-black tracking-tighter text-white">
                    GITAR<span className="text-accent">PRO</span>
                </span>
            </Link>

            {/* Nav items */}
            <nav className="flex flex-col gap-1 flex-1">
                {navItems.map(({ icon: Icon, label, href, active, onClick }) => {
                    const cls = `flex items-center gap-3 rounded-lg px-2 py-2.5 xl:px-3 text-sm font-medium transition-colors ${
                        active
                            ? 'text-white bg-surface-elevated'
                            : 'text-text-secondary hover:text-white hover:bg-surface-elevated'
                    }`;
                    return onClick ? (
                        <button key={label} onClick={onClick} className={cls}>
                            <Icon size={22} className="shrink-0" />
                            <span className="hidden xl:block">{label}</span>
                        </button>
                    ) : (
                        <Link key={label} href={href} className={cls}>
                            <Icon size={22} className="shrink-0" />
                            <span className="hidden xl:block">{label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Profile link at bottom */}
            <Link
                href={route('profile.show')}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 xl:px-3 text-sm font-medium text-text-secondary hover:text-white hover:bg-surface-elevated transition-colors"
            >
                <Avatar name={authUser.name} photoUrl={authUser.profile_photo_url} size={28} />
                <span className="hidden xl:block truncate">{authUser.name}</span>
            </Link>
        </aside>
    );
}

// ─── Lessons Page ─────────────────────────────────────────────────────────────

const LEVELS = [
    { value: null,           label: 'All' },
    { value: 'beginner',     label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'pro',          label: 'Pro' },
];

export default function Index({
    auth,
    lessons,
    activeLevel,
}: PageProps<{
    lessons: LessonItem[];
    activeLevel: string | null;
}>) {
    const [showSubmit, setShowSubmit] = useState(false);

    const setLevel = (level: string | null) => {
        router.get(route('lesson.index'), level ? { level } : {}, { preserveState: false });
    };

    return (
        <>
            <Head title="Lessons" />

            <div className="min-h-screen bg-background text-white">
                <LeftSidebar authUser={auth.user} onSubmit={() => setShowSubmit(true)} />
                <MobileBottomNav authUser={auth.user} onSubmit={() => setShowSubmit(true)} />

                <div className="md:pl-16 xl:pl-56 pb-16 md:pb-0">
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent shadow-[0_0_14px_rgba(255,77,0,0.4)]">
                                    <BookOpen size={20} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold">Lessons</h1>
                                    <p className="text-xs text-text-secondary">Curated guitar lessons from the community</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowSubmit(true)}
                                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors shadow-[0_0_14px_rgba(255,77,0,0.3)]"
                            >
                                <Upload size={15} />
                                Submit Lesson
                            </button>
                        </div>

                        {/* Level filter */}
                        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
                            {LEVELS.map(({ value, label }) => (
                                <button
                                    key={label}
                                    onClick={() => setLevel(value)}
                                    className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                        activeLevel === value
                                            ? 'bg-accent border-accent text-white'
                                            : 'border-border text-text-secondary hover:text-white hover:border-white/30'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Lessons grid */}
                        {lessons.length === 0 ? (
                            <div className="flex flex-col items-center gap-4 py-24 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
                                    <BookOpen size={32} className="text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">No lessons yet</h2>
                                    <p className="mt-1 text-text-secondary text-sm">
                                        Be the first to submit a guitar lesson.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowSubmit(true)}
                                    className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-semibold text-white hover:bg-accent/90"
                                >
                                    <Upload size={16} />
                                    Submit Lesson
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {lessons.map(lesson => (
                                    <LessonCard key={lesson.id} lesson={lesson} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showSubmit && <SubmitModal onClose={() => setShowSubmit(false)} />}
        </>
    );
}
