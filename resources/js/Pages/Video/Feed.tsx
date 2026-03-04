import { Head, Link, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import {
    Bookmark,
    BookOpen,
    FileVideo,
    Heart,
    Home,
    MessageCircle,
    MoreHorizontal,
    Music,
    Music2,
    PlusSquare,
    Search,
    Send,
    Trash2,
    Upload,
    Video,
    X,
} from 'lucide-react';
import InputError from '@/Components/InputError';
import { CommentItem, PageProps, SuggestedUser, VideoItem } from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Avatar({
    name,
    photoUrl,
    size = 32,
    ring = false,
}: {
    name: string;
    photoUrl?: string | null;
    size?: number;
    ring?: boolean;
}) {
    return (
        <div
            className={`shrink-0 overflow-hidden rounded-full ${ring ? 'p-0.5 bg-gradient-to-tr from-accent via-orange-400 to-yellow-400' : ''}`}
            style={{ width: size, height: size }}
        >
            <div className="w-full h-full rounded-full overflow-hidden bg-surface-elevated flex items-center justify-center">
                {photoUrl ? (
                    <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <span className="font-bold text-accent" style={{ fontSize: size * 0.38 }}>
                        {name.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
        </div>
    );
}

// ─── Comments Panel ───────────────────────────────────────────────────────────

function CommentsPanel({
    video,
    authUserId,
}: {
    video: VideoItem;
    authUserId: number;
}) {
    const [comments, setComments] = useState<CommentItem[]>(video.comments ?? []);
    const [count, setCount] = useState(video.comments_count ?? 0);
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || submitting) return;
        setSubmitting(true);
        const optimistic: CommentItem = {
            id: Date.now(),
            content: text.trim(),
            user_id: authUserId,
            user: { id: authUserId, name: 'You' },
            created_at: 'just now',
        };
        setComments((prev) => [...prev, optimistic]);
        setCount((c) => c + 1);
        const sent = text.trim();
        setText('');
        router.post(
            route('comment.store', video.id),
            { content: sent },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setSubmitting(false),
                onError: () => {
                    setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
                    setCount((c) => c - 1);
                    setText(sent);
                    setSubmitting(false);
                },
            },
        );
    };

    const handleDelete = (comment: CommentItem) => {
        setComments((prev) => prev.filter((c) => c.id !== comment.id));
        setCount((c) => c - 1);
        router.delete(route('comment.destroy', comment.id), {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                setComments((prev) => [...prev, comment]);
                setCount((c) => c + 1);
            },
        });
    };

    return (
        <div className="flex flex-col">
            {/* Comments list */}
            {comments.length > 0 && (
                <div className="px-4 pb-2 space-y-2 max-h-40 overflow-y-auto">
                    {comments.map((c) => (
                        <div key={c.id} className="flex items-start gap-2 group">
                            <Avatar name={c.user.name} size={24} />
                            <div className="flex-1 min-w-0">
                                <span className="text-xs font-semibold text-white mr-1.5">{c.user.name}</span>
                                <span className="text-xs text-text-primary break-words">{c.content}</span>
                                <div className="text-xs text-text-secondary mt-0.5">{c.created_at}</div>
                            </div>
                            {c.user_id === authUserId && (
                                <button
                                    onClick={() => handleDelete(c)}
                                    className="opacity-0 group-hover:opacity-100 rounded p-0.5 text-text-secondary hover:text-red-400 transition"
                                >
                                    <Trash2 size={11} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border px-4 py-2.5">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a comment…"
                    maxLength={500}
                    className="flex-1 bg-transparent text-sm text-white placeholder-text-secondary outline-none"
                />
                <button
                    type="submit"
                    disabled={!text.trim() || submitting}
                    className="text-accent text-sm font-semibold disabled:opacity-40 transition hover:text-accent/80"
                >
                    Post
                </button>
            </form>
        </div>
    );
}

// ─── Tab Panel ────────────────────────────────────────────────────────────────

function TabPanel({ tab }: { tab: { format: string; content: string } }) {
    return (
        <div className="border-t border-border px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
                <Music2 size={13} className="text-accent" />
                <span className="text-xs font-semibold text-white">
                    Guitar Tab
                    <span className="ml-2 rounded bg-surface-elevated px-1.5 py-0.5 text-xs text-text-secondary uppercase">
                        {tab.format}
                    </span>
                </span>
            </div>
            <div className="max-h-36 overflow-y-auto">
                <pre className="whitespace-pre font-mono text-xs leading-relaxed text-text-primary">
                    {tab.content}
                </pre>
            </div>
        </div>
    );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({
    video,
    authUserId,
}: {
    video: VideoItem;
    authUserId: number;
}) {
    const [liked, setLiked] = useState(video.liked);
    const [likesCount, setLikesCount] = useState(video.likes_count);
    const [saved, setSaved] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showTab, setShowTab] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleLike = () => {
        setLiked((p) => !p);
        setLikesCount((p) => (liked ? p - 1 : p + 1));
        router.post(route('video.like', video.id), {}, {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                setLiked((p) => !p);
                setLikesCount((p) => (liked ? p + 1 : p - 1));
            },
        });
    };

    return (
        <article className="border border-border rounded-xl bg-surface overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3">
                <Link href={route('profile.show.user', video.user?.id ?? 0)}>
                    <Avatar
                        name={video.user?.name ?? '?'}
                        photoUrl={video.user?.profile_photo_url}
                        size={36}
                        ring
                    />
                </Link>
                <div className="flex-1 min-w-0">
                    <Link
                        href={route('profile.show.user', video.user?.id ?? 0)}
                        className="text-sm font-semibold text-white hover:underline"
                    >
                        {video.user?.name ?? 'Unknown'}
                    </Link>
                    <div className="text-xs text-text-secondary">{video.created_at}</div>
                </div>
                <button className="text-text-secondary hover:text-white transition p-1">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Video */}
            <div className="relative bg-black">
                <video
                    ref={videoRef}
                    src={video.url}
                    controls
                    playsInline
                    className="w-full max-h-[520px] object-contain"
                />
                {/* Tab badge if has tab */}
                {video.tab && (
                    <button
                        onClick={() => setShowTab((p) => !p)}
                        className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm transition ${
                            showTab
                                ? 'bg-accent text-white'
                                : 'bg-black/50 text-white hover:bg-accent/80'
                        }`}
                    >
                        <Music2 size={12} />
                        Tab
                    </button>
                )}
            </div>

            {/* Actions row */}
            <div className="flex items-center gap-1 px-3 pt-3 pb-1">
                {/* Like */}
                <button
                    onClick={handleLike}
                    className={`p-2 rounded-full transition-all active:scale-90 ${liked ? 'text-accent' : 'text-white hover:text-text-secondary'}`}
                >
                    <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
                </button>
                {/* Comment */}
                <button
                    onClick={() => setShowComments((p) => !p)}
                    className={`p-2 rounded-full transition ${showComments ? 'text-accent' : 'text-white hover:text-text-secondary'}`}
                >
                    <MessageCircle size={24} />
                </button>
                {/* Share / send — cosmetic */}
                <button className="p-2 rounded-full text-white hover:text-text-secondary transition">
                    <Send size={22} />
                </button>
                {/* Spacer */}
                <div className="flex-1" />
                {/* Bookmark */}
                <button
                    onClick={() => setSaved((p) => !p)}
                    className={`p-2 rounded-full transition ${saved ? 'text-accent' : 'text-white hover:text-text-secondary'}`}
                >
                    <Bookmark size={24} fill={saved ? 'currentColor' : 'none'} />
                </button>
            </div>

            {/* Likes count */}
            <div className="px-4 pb-1">
                <span className="text-sm font-semibold text-white">
                    {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                </span>
            </div>

            {/* Title as caption */}
            <div className="px-4 pb-3">
                <span className="text-sm font-semibold text-white mr-2">{video.user?.name}</span>
                <span className="text-sm text-text-primary">{video.title}</span>
            </div>

            {/* Comment count toggle */}
            {(video.comments_count ?? 0) > 0 && !showComments && (
                <button
                    onClick={() => setShowComments(true)}
                    className="px-4 pb-2 text-sm text-text-secondary hover:text-white transition"
                >
                    View all {video.comments_count} comments
                </button>
            )}

            {/* Tab panel */}
            {showTab && video.tab && <TabPanel tab={video.tab} />}

            {/* Comments panel */}
            {showComments && (
                <CommentsPanel video={video} authUserId={authUserId} />
            )}
        </article>
    );
}

// ─── Stories Row ──────────────────────────────────────────────────────────────

function StoriesRow({ users }: { users: SuggestedUser[] }) {
    if (users.length === 0) return null;
    return (
        <div className="border border-border rounded-xl bg-surface p-4 mb-6">
            <div className="flex gap-5 overflow-x-auto pb-1 scrollbar-hide">
                {users.map((u) => (
                    <Link
                        key={u.id}
                        href={route('profile.show.user', u.id)}
                        className="flex flex-col items-center gap-1.5 shrink-0"
                    >
                        <Avatar name={u.name} photoUrl={u.profile_photo_path} size={60} ring />
                        <span className="text-xs text-text-primary max-w-[56px] truncate text-center">
                            {u.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────

function UploadModal({ onClose }: { onClose: () => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors, progress } = useForm({
        title: '',
        video: null as File | null,
        has_tab: false,
        tab_format: 'text',
        tab_content: '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
            setData((prev) => ({ ...prev, video: file, title: prev.title || nameWithoutExt }));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('video.store'), { onSuccess: onClose });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent shadow-[0_0_12px_rgba(255,77,0,0.4)]">
                            <Upload size={15} className="text-white" />
                        </div>
                        <span className="font-bold text-white">Upload Cover</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-text-secondary transition hover:bg-surface-elevated hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={submit} className="p-5 space-y-5">
                    {/* Drop zone */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all ${
                            data.video
                                ? 'border-accent bg-accent/5'
                                : 'border-border bg-background hover:border-accent hover:bg-surface-elevated'
                        }`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv"
                            className="hidden"
                        />
                        {data.video ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="rounded-full bg-accent/20 p-3">
                                    <FileVideo className="h-8 w-8 text-accent" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{data.video.name}</p>
                                    <p className="text-sm text-text-secondary">
                                        {data.video.size >= 1048576
                                            ? `${(data.video.size / 1048576).toFixed(2)} MB`
                                            : `${(data.video.size / 1024).toFixed(2)} KB`}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setData('video', null); }}
                                    className="absolute top-3 right-3 text-text-secondary hover:text-white transition"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="rounded-full bg-surface-elevated p-3 group-hover:bg-accent/10 transition-all">
                                    <Upload className="h-8 w-8 text-text-secondary group-hover:text-accent transition-colors" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Click to browse or drag & drop</p>
                                    <p className="text-sm text-text-secondary">MP4, MOV, AVI up to 200MB</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <InputError message={errors.video} className="text-red-400 text-sm" />

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. Master of Puppets — Guitar Solo Cover"
                            required
                            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-white placeholder-text-secondary outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                        />
                        <InputError message={errors.title} className="mt-1 text-red-400 text-sm" />
                    </div>

                    {/* Tab toggle */}
                    <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="rounded-lg bg-accent/20 p-1.5">
                                    <Music2 className="h-4 w-4 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Attach Guitar Tab</p>
                                    <p className="text-xs text-text-secondary">Help others play along</p>
                                </div>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={data.has_tab}
                                    onChange={(e) => setData('has_tab', e.target.checked)}
                                />
                                <div className="peer h-6 w-11 rounded-full bg-surface-elevated border border-border after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:after:translate-x-full peer-focus:outline-none" />
                            </label>
                        </div>
                        {data.has_tab && (
                            <textarea
                                className="w-full h-36 rounded-lg border border-border bg-surface-elevated px-3 py-2 font-mono text-xs text-text-primary placeholder-text-secondary outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                placeholder={`e|------------------|\nB|------------------|\nG|------------------|\nD|------------------|\nA|---7---7h9p7------|\nE|-0---0-------10---|`}
                                value={data.tab_content}
                                onChange={(e) => setData('tab_content', e.target.value)}
                            />
                        )}
                        <InputError message={errors.tab_content} className="text-red-400 text-sm" />
                    </div>

                    {/* Progress + submit */}
                    <div className="flex items-center gap-4 pt-1">
                        {progress && (
                            <div className="flex-1">
                                <div className="w-full bg-surface-elevated rounded-full h-1.5">
                                    <div
                                        className="bg-accent h-1.5 rounded-full transition-all shadow-[0_0_8px_rgba(255,77,0,0.5)]"
                                        style={{ width: `${progress.percentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-text-secondary mt-1">{progress.percentage}% uploaded</p>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={processing || !data.video}
                            className="ml-auto flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 font-bold text-white shadow-[0_0_16px_rgba(255,77,0,0.3)] transition hover:bg-accent-hover active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <Music size={16} />
                            {processing ? 'Uploading…' : 'Publish'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────

function MobileBottomNav({ authUser, onUpload }: { authUser: { id: number; name: string; profile_photo_url?: string | null }; onUpload: () => void }) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden items-center justify-around border-t border-border bg-surface h-16 px-2">
            <Link href={route('video.feed')} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-white transition-colors">
                <Home size={24} className="text-accent" />
                <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link href={route('profile.show')} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-text-secondary hover:text-white transition-colors">
                <Search size={24} />
                <span className="text-[10px] font-medium">Search</span>
            </Link>
            <button onClick={onUpload} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-text-secondary hover:text-white transition-colors">
                <PlusSquare size={24} />
                <span className="text-[10px] font-medium">Upload</span>
            </button>
            <Link href={route('lesson.index')} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-text-secondary hover:text-white transition-colors">
                <BookOpen size={24} />
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

function LeftSidebar({ authUser, onUpload }: { authUser: { id: number; name: string; profile_photo_url?: string | null }; onUpload: () => void }) {
    const navItems = [
        { icon: Home, label: 'Home', href: route('video.feed'), active: true, onClick: undefined as (() => void) | undefined },
        { icon: Search, label: 'Search', href: route('profile.show'), active: false, onClick: undefined as (() => void) | undefined },
        { icon: BookOpen, label: 'Lessons', href: route('lesson.index'), active: false, onClick: undefined as (() => void) | undefined },
        { icon: Video, label: 'Upload', href: '#', active: false, onClick: onUpload },
        { icon: Heart, label: 'Liked', href: route('profile.show'), active: false, onClick: undefined as (() => void) | undefined },
        { icon: PlusSquare, label: 'Create', href: '#', active: false, onClick: onUpload },
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

// ─── Right Sidebar ────────────────────────────────────────────────────────────

function RightSidebar({
    authUser,
    suggestedUsers,
}: {
    authUser: { id: number; name: string; email: string };
    suggestedUsers: SuggestedUser[];
}) {
    return (
        <aside className="hidden lg:flex flex-col gap-5 w-80 shrink-0 sticky top-6 self-start">
            {/* Logged-in user */}
            <div className="flex items-center gap-3">
                <Link href={route('profile.show')}>
                    <Avatar name={authUser.name} size={44} ring />
                </Link>
                <div className="flex-1 min-w-0">
                    <Link
                        href={route('profile.show')}
                        className="block text-sm font-semibold text-white hover:underline truncate"
                    >
                        {authUser.name}
                    </Link>
                    <span className="block text-xs text-text-secondary truncate">{authUser.email}</span>
                </div>
                <Link
                    href={route('profile.edit')}
                    className="text-xs font-semibold text-accent hover:text-accent/80 transition shrink-0"
                >
                    Settings
                </Link>
            </div>

            {/* Suggested for you */}
            {suggestedUsers.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-text-secondary">Suggested for you</span>
                        <Link
                            href={route('profile.show')}
                            className="text-xs font-semibold text-white hover:text-text-secondary transition"
                        >
                            See all
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        {suggestedUsers.map((u) => (
                            <div key={u.id} className="flex items-center gap-3">
                                <Link href={route('profile.show.user', u.id)}>
                                    <Avatar
                                        name={u.name}
                                        photoUrl={u.profile_photo_path}
                                        size={36}
                                        ring
                                    />
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={route('profile.show.user', u.id)}
                                        className="block text-sm font-semibold text-white hover:underline truncate"
                                    >
                                        {u.name}
                                    </Link>
                                    <span className="block text-xs text-text-secondary">
                                        {u.videos_count} {u.videos_count === 1 ? 'video' : 'videos'}
                                    </span>
                                </div>
                                <Link
                                    href={route('profile.show.user', u.id)}
                                    className="text-xs font-semibold text-accent hover:text-accent/80 transition shrink-0"
                                >
                                    Follow
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer links */}
            <div className="text-xs text-text-secondary leading-relaxed">
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {['About', 'Help', 'Press', 'API', 'Privacy', 'Terms', 'Locations'].map((l) => (
                        <span key={l} className="hover:underline cursor-pointer">{l}</span>
                    ))}
                </div>
                <p className="mt-2">© 2026 GITARPRO</p>
            </div>
        </aside>
    );
}

// ─── Feed Page ────────────────────────────────────────────────────────────────

export default function Feed({
    auth,
    videos,
    suggestedUsers,
}: PageProps<{
    videos: VideoItem[];
    suggestedUsers: SuggestedUser[];
}>) {
    const [showUpload, setShowUpload] = useState(false);

    return (
        <>
            <Head title="Feed" />

            <div className="min-h-screen bg-background text-white">
                {/* Left sidebar — desktop only */}
                <LeftSidebar authUser={auth.user} onUpload={() => setShowUpload(true)} />

                {/* Mobile bottom nav */}
                <MobileBottomNav authUser={auth.user} onUpload={() => setShowUpload(true)} />

                {/* Main content — offset by sidebar width on desktop, bottom-padded on mobile */}
                <div className="md:pl-16 xl:pl-56 pb-16 md:pb-0">
                    <div className="max-w-[935px] mx-auto px-4 py-6 flex gap-8">
                        {/* Center feed column */}
                        <div className="flex-1 min-w-0 max-w-[470px]">
                            {/* Stories row */}
                            <StoriesRow users={suggestedUsers} />

                            {/* Posts */}
                            {videos.length === 0 ? (
                                <div className="flex flex-col items-center gap-6 py-24 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent shadow-[0_0_30px_rgba(255,77,0,0.4)]">
                                        <Music size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">No videos yet</h2>
                                        <p className="mt-1 text-text-secondary">
                                            Be the first to share a guitar cover.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowUpload(true)}
                                        className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white shadow-[0_0_20px_rgba(255,77,0,0.3)] hover:bg-accent-hover"
                                    >
                                        <Upload size={18} />
                                        Upload a Video
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {videos.map((video) => (
                                        <PostCard
                                            key={video.id}
                                            video={video}
                                            authUserId={auth.user.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right sidebar */}
                        <RightSidebar
                            authUser={auth.user}
                            suggestedUsers={suggestedUsers}
                        />
                    </div>
                </div>
            </div>

            {/* Upload modal */}
            {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
        </>
    );
}
