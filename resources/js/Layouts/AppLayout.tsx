import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Heart,
    Home,
    Music,
    PlusSquare,
    Search,
} from 'lucide-react';

function Avatar({ name, photoUrl, size = 32 }: { name: string; photoUrl?: string | null; size?: number }) {
    return (
        <div className="shrink-0 overflow-hidden rounded-full bg-surface-elevated flex items-center justify-center" style={{ width: size, height: size }}>
            {photoUrl ? (
                <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
                <span className="font-bold text-accent" style={{ fontSize: size * 0.38 }}>{name.charAt(0).toUpperCase()}</span>
            )}
        </div>
    );
}

function LeftSidebar({ authUser, onUpload }: { authUser: { name: string; profile_photo_url?: string | null }; onUpload?: () => void }) {
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';

    // We infer active state based on simple URL checks 
    const navItems = [
        { icon: Home, label: 'Home', href: route('video.feed'), active: currentUrl === '/' || currentUrl.startsWith('/videos') },
        { icon: Search, label: 'Search', href: route('profile.show'), active: false, onClick: undefined },
        { icon: BookOpen, label: 'Lessons', href: route('lesson.index'), active: currentUrl.startsWith('/lessons') },
        { icon: PlusSquare, label: 'Upload', href: '#', active: false, onClick: onUpload },
        { icon: Heart, label: 'Liked', href: route('profile.show'), active: false, onClick: undefined },
    ];

    return (
        <aside className="fixed top-0 left-0 h-full w-16 xl:w-56 hidden md:flex flex-col border-r border-border bg-black/90 z-40 py-6 px-2 xl:px-4">
            <Link href={route('video.feed')} className="flex items-center gap-2.5 mb-8 px-1 xl:px-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent shadow-[0_0_14px_rgba(255,77,0,0.5)]">
                    <Music size={18} className="text-white" />
                </div>
                <span className="hidden xl:block text-base font-black tracking-tighter text-white">
                    GITAR<span className="text-accent">PRO</span>
                </span>
            </Link>
            <nav className="flex flex-col gap-1 flex-1">
                {navItems.map(({ icon: Icon, label, href, active, onClick }) => {
                    const cls = `flex items-center gap-3 rounded-lg px-2 py-2.5 xl:px-3 text-sm font-medium transition-colors ${active ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`;
                    return onClick ? (
                        <button key={label} onClick={(e) => { e.preventDefault(); onClick(); }} className={cls}>
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
            <Link href={route('profile.show')} className="flex items-center gap-3 rounded-lg px-2 py-2.5 xl:px-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                <Avatar name={authUser.name} photoUrl={authUser.profile_photo_url} size={28} />
                <span className="hidden xl:block truncate">{authUser.name}</span>
            </Link>
        </aside>
    );
}

function MobileBottomNav({ authUser, onUpload }: { authUser: { name: string; profile_photo_url?: string | null }; onUpload?: () => void }) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden items-center justify-around border-t border-border bg-black/90 backdrop-blur-md h-16 px-2">
            <Link href={route('video.feed')} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-zinc-400 hover:text-white">
                <Home size={24} />
                <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link href={route('profile.show')} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-zinc-400 hover:text-white">
                <Search size={24} />
                <span className="text-[10px] font-medium">Search</span>
            </Link>
            <button onClick={onUpload} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-zinc-400 hover:text-white">
                <PlusSquare size={24} />
                <span className="text-[10px] font-medium">Upload</span>
            </button>
            <Link href={route('lesson.index')} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-zinc-400 hover:text-white">
                <BookOpen size={24} />
                <span className="text-[10px] font-medium">Lessons</span>
            </Link>
            <Link href={route('profile.show')} className="flex flex-col items-center gap-0.5 flex-1 py-2 text-zinc-400 hover:text-white">
                <Avatar name={authUser.name} photoUrl={authUser.profile_photo_url} size={26} />
                <span className="text-[10px] font-medium">Profile</span>
            </Link>
        </nav>
    );
}

export default function AppLayout({ authUser, children, onUploadRequest }: { authUser: any; children: React.ReactNode; onUploadRequest?: () => void }) {
    return (
        <div className="h-screen w-full bg-black text-white flex overflow-hidden">
            <LeftSidebar authUser={authUser} onUpload={onUploadRequest} />
            <MobileBottomNav authUser={authUser} onUpload={onUploadRequest} />

            <main className="flex-1 w-full md:pl-16 xl:pl-56 relative h-full">
                {children}
            </main>
        </div>
    );
}
