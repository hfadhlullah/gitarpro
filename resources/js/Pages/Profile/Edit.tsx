import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    BookOpen,
    Heart,
    Home,
    LogOut,
    Music,
    PlusSquare,
    Search,
    Settings,
    Shield,
    Trash2,
    User,
} from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({
    name,
    photoUrl,
    size = 28,
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

// ─── Left Sidebar ─────────────────────────────────────────────────────────────

function LeftSidebar({ authUser }: { authUser: { name: string; profile_photo_url?: string | null } }) {
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

            {/* Nav */}
            <nav className="flex flex-col gap-1 flex-1">
                <Link
                    href={route('video.feed')}
                    className="flex items-center gap-3 rounded-lg px-2 py-2.5 xl:px-3 text-sm font-medium text-text-secondary hover:text-white hover:bg-surface-elevated transition-colors"
                >
                    <Home size={22} className="shrink-0" />
                    <span className="hidden xl:block">Home</span>
                </Link>
                <Link
                    href={route('profile.show')}
                    className="flex items-center gap-3 rounded-lg px-2 py-2.5 xl:px-3 text-sm font-medium text-text-secondary hover:text-white hover:bg-surface-elevated transition-colors"
                >
                    <Search size={22} className="shrink-0" />
                    <span className="hidden xl:block">Search</span>
                </Link>
                <Link
                    href={route('profile.show')}
                    className="flex items-center gap-3 rounded-lg px-2 py-2.5 xl:px-3 text-sm font-medium text-text-secondary hover:text-white hover:bg-surface-elevated transition-colors"
                >
                    <Heart size={22} className="shrink-0" />
                    <span className="hidden xl:block">Liked</span>
                </Link>
            </nav>

            {/* Profile (active) at bottom */}
            <Link
                href={route('profile.edit')}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 xl:px-3 text-sm font-medium text-white bg-surface-elevated transition-colors"
            >
                <div className="shrink-0 ring-2 ring-accent rounded-full">
                    <Avatar name={authUser.name} photoUrl={authUser.profile_photo_url} size={28} />
                </div>
                <span className="hidden xl:block truncate">{authUser.name}</span>
            </Link>
        </aside>
    );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────

function MobileBottomNav({ authUser }: { authUser: { name: string; profile_photo_url?: string | null } }) {
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
            <Link href={route('lesson.index')} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-text-secondary hover:text-white transition-colors">
                <BookOpen size={24} />
                <span className="text-[10px] font-medium">Lessons</span>
            </Link>
            <Link href={route('profile.edit')} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-accent transition-colors">
                <div className="ring-2 ring-accent rounded-full">
                    <Avatar name={authUser.name} photoUrl={authUser.profile_photo_url} size={26} />
                </div>
                <span className="text-[10px] font-medium">Profile</span>
            </Link>
        </nav>
    );
}

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function Edit({
    auth,
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <AppLayout authUser={auth.user}>
            <Head title="Settings" />

            {/* Main content */}
            <div className="h-full overflow-y-auto">
                <div className="max-w-2xl mx-auto px-4 py-8">

                    {/* Page title */}
                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                            <Settings size={20} className="text-accent" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Settings</h1>
                            <p className="text-sm text-text-secondary">Manage your account</p>
                        </div>
                        <Link
                            href={route('profile.show')}
                            className="ml-auto text-sm text-text-secondary hover:text-accent transition-colors"
                        >
                            ← Back to profile
                        </Link>
                    </div>

                    {/* Profile Information */}
                    <section id="profile" className="rounded-2xl border border-border bg-surface p-6 mb-4">
                        <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                                <User size={16} className="text-accent" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-white">Profile Information</h2>
                                <p className="text-xs text-text-secondary">Update your name and email address</p>
                            </div>
                        </div>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </section>

                    {/* Update Password */}
                    <section id="password" className="rounded-2xl border border-border bg-surface p-6 mb-4">
                        <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                                <Shield size={16} className="text-accent" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-white">Update Password</h2>
                                <p className="text-xs text-text-secondary">Use a strong, unique password</p>
                            </div>
                        </div>
                        <UpdatePasswordForm />
                    </section>

                    {/* Delete Account */}
                    <section id="delete" className="rounded-2xl border border-red-900/40 bg-surface p-6 mb-4">
                        <div className="mb-5 flex items-center gap-3 border-b border-red-900/30 pb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-900/20">
                                <Trash2 size={16} className="text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-white">Delete Account</h2>
                                <p className="text-xs text-text-secondary">Permanently remove your account and all data</p>
                            </div>
                        </div>
                        <DeleteUserForm />
                    </section>

                    {/* Log Out — at the very end */}
                    <div className="rounded-2xl border border-border bg-surface p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-elevated">
                                    <LogOut size={16} className="text-text-secondary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Log out</p>
                                    <p className="text-xs text-text-secondary">Sign out of your account</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-red-500/50 hover:bg-red-900/20 hover:text-red-400"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
