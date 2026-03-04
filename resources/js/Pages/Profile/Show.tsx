import { Head, Link, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import {
    Camera,
    Grid3X3,
    Heart,
    LogOut,
    MessageCircle,
    Music,
    Music2,
    Play,
    Send,
    Settings,
    Trash2,
    Upload,
    Video,
    X,
} from 'lucide-react';
import { CommentItem, PageProps, ProfileUser, VideoItem } from '@/types';
import AppLayout from '@/Layouts/AppLayout';

// ─── Mini Video Card (grid thumbnail) ───────────────────────────────────────

function VideoThumbnail({
    video,
    onClick,
}: {
    video: VideoItem;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="group relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-surface-elevated"
        >
            <video
                src={video.url}
                className="h-full w-full object-cover"
                muted
                preload="metadata"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <Play size={28} className="text-white" fill="white" />
                <span className="text-xs font-semibold text-white">{video.title}</span>
            </div>
            {/* Like count badge */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white">
                <Heart size={12} fill="white" />
                <span className="text-xs font-semibold">{video.likes_count}</span>
            </div>
        </button>
    );
}

// ─── Inline Video Player Modal ───────────────────────────────────────────────

type ModalPanel = 'comments' | 'tab' | null;

function VideoModal({
    video,
    authUserId,
    onClose,
}: {
    video: VideoItem;
    authUserId: number;
    onClose: () => void;
}) {
    const [liked, setLiked] = useState(video.liked);
    const [likesCount, setLikesCount] = useState(video.likes_count);
    const [panel, setPanel] = useState<ModalPanel>(null);
    const [comments, setComments] = useState<CommentItem[]>(video.comments ?? []);
    const [commentsCount, setCommentsCount] = useState(video.comments_count ?? 0);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleLike = () => {
        setLiked((p) => !p);
        setLikesCount((p) => (liked ? p - 1 : p + 1));
        router.post(
            route('video.like', video.id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    setLiked((p) => !p);
                    setLikesCount((p) => (liked ? p + 1 : p - 1));
                },
            },
        );
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || submitting) return;
        setSubmitting(true);
        const optimistic: CommentItem = {
            id: Date.now(),
            content: commentText.trim(),
            user_id: authUserId,
            user: { id: authUserId, name: 'You' },
            created_at: 'just now',
        };
        setComments((prev) => [optimistic, ...prev]);
        setCommentsCount((c) => c + 1);
        const sent = commentText.trim();
        setCommentText('');
        router.post(
            route('comment.store', video.id),
            { content: sent },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setSubmitting(false),
                onError: () => {
                    setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
                    setCommentsCount((c) => c - 1);
                    setCommentText(sent);
                    setSubmitting(false);
                },
            },
        );
    };

    const handleCommentDelete = (comment: CommentItem) => {
        setComments((prev) => prev.filter((c) => c.id !== comment.id));
        setCommentsCount((c) => c - 1);
        router.delete(route('comment.destroy', comment.id), {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                setComments((prev) => [comment, ...prev]);
                setCommentsCount((c) => c + 1);
            },
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-surface"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-1 text-white backdrop-blur-sm transition hover:bg-black/60"
                >
                    <X size={16} />
                </button>

                <video
                    src={video.url}
                    controls
                    autoPlay
                    className="max-h-[55vh] w-full object-contain bg-black"
                />

                {/* Info + actions row */}
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-white">{video.title}</p>
                        {video.user && (
                            <p className="text-sm text-text-secondary">by {video.user.name}</p>
                        )}
                        <p className="text-xs text-text-secondary">{video.created_at}</p>
                    </div>

                    <div className="ml-3 flex items-center gap-2">
                        {/* Like */}
                        <button
                            onClick={handleLike}
                            className={`flex flex-col items-center gap-0.5 rounded-full p-2 transition-all active:scale-90 ${liked
                                ? 'bg-accent/20 text-accent'
                                : 'bg-surface-elevated text-white hover:bg-border'
                                }`}
                        >
                            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                            <span className="text-xs font-semibold">{likesCount}</span>
                        </button>

                        {/* Comments toggle */}
                        <button
                            onClick={() => setPanel((p) => (p === 'comments' ? null : 'comments'))}
                            className={`flex flex-col items-center gap-0.5 rounded-full p-2 transition-all active:scale-90 ${panel === 'comments'
                                ? 'bg-accent/20 text-accent'
                                : 'bg-surface-elevated text-white hover:bg-border'
                                }`}
                        >
                            <MessageCircle size={18} fill={panel === 'comments' ? 'currentColor' : 'none'} />
                            <span className="text-xs font-semibold">{commentsCount}</span>
                        </button>

                        {/* Tab toggle (only if tab exists) */}
                        {video.tab && (
                            <button
                                onClick={() => setPanel((p) => (p === 'tab' ? null : 'tab'))}
                                className={`flex flex-col items-center gap-0.5 rounded-full p-2 transition-all active:scale-90 ${panel === 'tab'
                                    ? 'bg-accent/20 text-accent'
                                    : 'bg-surface-elevated text-white hover:bg-border'
                                    }`}
                            >
                                <Music2 size={18} />
                                <span className="text-xs font-semibold">Tab</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Tab panel */}
                {panel === 'tab' && video.tab && (
                    <div className="border-t border-border">
                        <div className="flex items-center gap-2 px-4 py-2">
                            <Music2 size={14} className="text-accent" />
                            <span className="text-xs font-semibold text-white">
                                Guitar Tab
                                <span className="ml-2 rounded bg-surface-elevated px-1.5 py-0.5 text-xs text-text-secondary uppercase">
                                    {video.tab.format}
                                </span>
                            </span>
                        </div>
                        <div className="max-h-40 overflow-y-auto px-4 pb-3">
                            <pre className="whitespace-pre font-mono text-xs leading-relaxed text-text-primary">
                                {video.tab.content}
                            </pre>
                        </div>
                    </div>
                )}

                {/* Comments panel */}
                {panel === 'comments' && (
                    <div className="flex flex-col border-t border-border" style={{ maxHeight: '220px' }}>
                        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
                            {comments.length === 0 ? (
                                <p className="text-center text-xs text-text-secondary py-4">
                                    No comments yet.
                                </p>
                            ) : (
                                comments.map((c) => (
                                    <div key={c.id} className="flex items-start gap-2">
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                                            {c.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-xs font-semibold text-white">
                                                    {c.user.name}
                                                </span>
                                                <span className="text-xs text-text-secondary">
                                                    {c.created_at}
                                                </span>
                                            </div>
                                            <p className="text-xs text-text-primary break-words">
                                                {c.content}
                                            </p>
                                        </div>
                                        {c.user_id === authUserId && (
                                            <button
                                                onClick={() => handleCommentDelete(c)}
                                                className="shrink-0 rounded p-0.5 text-text-secondary transition hover:text-red-400"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        <form
                            onSubmit={handleCommentSubmit}
                            className="border-t border-border p-2 flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment…"
                                maxLength={500}
                                className="flex-1 rounded-lg bg-surface-elevated px-3 py-1.5 text-xs text-white placeholder-text-secondary outline-none focus:ring-1 focus:ring-accent"
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim() || submitting}
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white transition hover:bg-accent-hover disabled:opacity-40"
                            >
                                <Send size={13} />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Avatar Upload Button ────────────────────────────────────────────────────

function AvatarUpload({
    photoUrl,
    name,
}: {
    photoUrl: string | null;
    name: string;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const { post, processing } = useForm<{ photo: File | null }>({ photo: null });

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const form = new FormData();
        form.append('photo', file);
        router.post(route('profile.photo'), form, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-accent shadow-[0_0_20px_rgba(255,77,0,0.4)]">
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-elevated text-3xl font-bold text-accent">
                        {name.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            <button
                onClick={() => fileRef.current?.click()}
                disabled={processing}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white shadow-lg transition hover:bg-accent-hover disabled:opacity-60"
                title="Change photo"
            >
                <Camera size={14} />
            </button>
            <input
                ref={fileRef}
                type="file"
                accept="image/jpg,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFile}
            />
        </div>
    );
}

// ─── Profile Show Page ───────────────────────────────────────────────────────

type Tab = 'videos' | 'liked';

export default function Show({
    auth,
    profileUser,
    videos,
    likedVideos,
    isOwner,
}: PageProps<{
    profileUser: ProfileUser;
    videos: VideoItem[];
    likedVideos: VideoItem[];
    isOwner: boolean;
}>) {
    const [activeTab, setActiveTab] = useState<Tab>('videos');
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

    const displayVideos = activeTab === 'videos' ? videos : likedVideos;

    return (
        <AppLayout authUser={auth.user}>
            <Head title={`${profileUser.name} · GitarPro`} />

            {/* Main content */}
            <div className="h-full w-full overflow-y-auto pb-16 md:pb-0">
                <div className="mx-auto max-w-2xl px-4 py-8">
                    {/* ── Profile Header ── */}
                    <div className="flex flex-col items-center py-10 text-center">
                        {isOwner ? (
                            <AvatarUpload
                                photoUrl={profileUser.profile_photo_url}
                                name={profileUser.name}
                            />
                        ) : (
                            <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-accent shadow-[0_0_20px_rgba(255,77,0,0.4)]">
                                {profileUser.profile_photo_url ? (
                                    <img
                                        src={profileUser.profile_photo_url}
                                        alt={profileUser.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-surface-elevated text-3xl font-bold text-accent">
                                        {profileUser.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        )}

                        <h1 className="mt-4 text-xl font-bold text-white">
                            {profileUser.name}
                        </h1>

                        {isOwner && (
                            <div className="mt-4 flex items-center justify-center gap-3">
                                <Link href={route('profile.edit')} className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface-elevated px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                                    <Settings size={16} />
                                    Edit Profile
                                </Link>
                                <Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-900/20 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors">
                                    <LogOut size={16} />
                                    Log Out
                                </Link>
                            </div>
                        )}

                        {/* Stats row */}
                        <div className="mt-4 flex gap-8">
                            <div className="flex flex-col items-center">
                                <span className="text-lg font-bold text-white">
                                    {profileUser.videos_count}
                                </span>
                                <span className="text-xs text-text-secondary">Videos</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-lg font-bold text-white">
                                    {profileUser.likes_received}
                                </span>
                                <span className="text-xs text-text-secondary">Likes</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-lg font-bold text-white">
                                    {likedVideos.length}
                                </span>
                                <span className="text-xs text-text-secondary">Liked</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Tabs ── */}
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${activeTab === 'videos'
                                ? 'border-b-2 border-accent text-accent'
                                : 'text-text-secondary hover:text-white'
                                }`}
                        >
                            <Grid3X3 size={16} />
                            Videos
                        </button>
                        <button
                            onClick={() => setActiveTab('liked')}
                            className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${activeTab === 'liked'
                                ? 'border-b-2 border-accent text-accent'
                                : 'text-text-secondary hover:text-white'
                                }`}
                        >
                            <Heart size={16} />
                            Liked
                        </button>
                    </div>

                    {/* ── Grid ── */}
                    {displayVideos.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 py-20 text-center">
                            {activeTab === 'videos' ? (
                                <>
                                    <Video size={40} className="text-text-secondary" />
                                    <p className="text-text-secondary">No videos yet.</p>
                                    {isOwner && (
                                        <Link
                                            href={route('video.create')}
                                            className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
                                        >
                                            <Upload size={16} />
                                            Upload your first video
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Heart size={40} className="text-text-secondary" />
                                    <p className="text-text-secondary">No liked videos yet.</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="mt-1 grid grid-cols-3 gap-0.5">
                            {displayVideos.map((video) => (
                                <VideoThumbnail
                                    key={video.id}
                                    video={video}
                                    onClick={() => setSelectedVideo(video)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Video modal ── */}
            {selectedVideo && (
                <VideoModal
                    video={selectedVideo}
                    authUserId={auth.user.id}
                    onClose={() => setSelectedVideo(null)}
                />
            )}
        </AppLayout>
    );
}
