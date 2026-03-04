import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Music, Guitar, Star, Users, PlayCircle } from 'lucide-react';
import { MorphingText } from '@/components/ui/morphing-text';
import { BeamsBackground } from '@/components/ui/beams-background';
import { useEffect, useRef, useState, useCallback } from 'react';

// ─────────────────────────────────────────────
// Carousel slides
// ─────────────────────────────────────────────
const SLIDES = [
    { tag: '• Covers', title: 'Community Covers', sub: 'Watch guitarists cover your favourite songs', img: '/card_covers.png' },
    { tag: '• Lessons', title: 'Interactive Lessons', sub: 'Learn with tabs synced to every video', img: '/card_lessons.png' },
    { tag: '• Tabs', title: 'Viral Tab Library', sub: 'Discover chords and tabs from the community', img: '/card_tabs.png' },
    { tag: '• Challenges', title: 'Weekly Challenges', sub: 'Compete, get feedback, and level up', img: '/card_challenge.png' },
];

// ─────────────────────────────────────────────
// Single card
// ─────────────────────────────────────────────
function SlideCard({
    tag, title, sub, img,
    entering, leaving, dir,
}: {
    tag: string; title: string; sub: string; img: string;
    entering?: boolean; leaving?: boolean; dir: 'left' | 'right';
}) {
    const xIn = dir === 'right' ? '50px' : '-50px';
    const xOut = dir === 'right' ? '-50px' : '50px';
    return (
        <div
            className="relative h-full w-full overflow-hidden rounded-2xl"
            style={{
                opacity: leaving ? 0 : entering ? 0 : 1,
                transform: leaving ? `translateX(${xOut})` : entering ? `translateX(${xIn})` : 'translateX(0)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
        >
            <img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover" />
            {/* Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
            {/* Tag */}
            <span className="absolute left-4 top-4 z-10 inline-flex items-center rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                {tag}
            </span>
            {/* Bottom info */}
            <div className="absolute bottom-5 left-5 z-10 pr-14">
                <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
                <p className="mt-0.5 text-sm text-white/60">{sub}</p>
            </div>
            {/* + button */}
            <button
                aria-label={`Open ${title}`}
                className="absolute bottom-5 right-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/25 hover:scale-110"
            >
                <span className="text-xl font-light leading-none">+</span>
            </button>
        </div>
    );
}

// ─────────────────────────────────────────────
// Two-panel auto-carousel
// ─────────────────────────────────────────────
const INTERVAL = 4500;

function DuoCarousel() {
    const [page, setPage] = useState(0);
    const [anim, setAnim] = useState<'idle' | 'out' | 'in'>('idle');
    const [dir, setDir] = useState<'left' | 'right'>('right');
    const [paused, setPaused] = useState(false);
    const PAGES = Math.ceil(SLIDES.length / 2);

    const go = useCallback((nextPage: number, d: 'left' | 'right' = 'right') => {
        if (anim !== 'idle') return;
        setDir(d);
        setAnim('out');
        setTimeout(() => {
            setPage((nextPage + PAGES) % PAGES);
            setAnim('in');
            setTimeout(() => setAnim('idle'), 520);
        }, 280);
    }, [anim, PAGES]);

    useEffect(() => {
        if (paused || anim !== 'idle') return;
        const t = setInterval(() => go((page + 1) % PAGES, 'right'), INTERVAL);
        return () => clearInterval(t);
    }, [page, paused, anim, go, PAGES]);

    const left = SLIDES[page * 2];
    const right = SLIDES[page * 2 + 1] ?? SLIDES[0];

    return (
        <div
            className="w-full"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div
                className="grid gap-4"
                style={{ gridTemplateColumns: '1fr 1fr', height: 'clamp(380px, 45vw, 560px)' }}
            >
                <SlideCard {...left} entering={anim === 'in'} leaving={anim === 'out'} dir={dir} />
                <SlideCard {...right} entering={anim === 'in'} leaving={anim === 'out'} dir={dir} />
            </div>

            {/* Dots */}
            <div className="mt-5 flex items-center justify-center gap-2">
                {Array.from({ length: PAGES }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => go(i, i > page ? 'right' : 'left')}
                        aria-label={`Go to page ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === page ? 'w-6 bg-accent' : 'w-1.5 bg-white/20 hover:bg-white/50'
                            }`}
                    />
                ))}
            </div>

            {/* Progress bar */}
            {!paused && anim === 'idle' && (
                <div
                    key={`${page}-progress`}
                    className="mt-2 h-px w-full origin-left bg-accent/50"
                    style={{ animation: `progressBar ${INTERVAL}ms linear forwards` }}
                />
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
const MORPH_TEXTS = [
    'Share your Sound.',
    'Master the Fretboard.',
    'Discover Viral Tabs.',
    'Share your Skills.',
    'Join the Community.',
];

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="GitarPro – Show your Skills. Share your Sound." />

            <style>{`
                @keyframes progressBar {
                    from { transform: scaleX(0); }
                    to   { transform: scaleX(1); }
                }
            `}</style>

            <div className="relative overflow-x-hidden bg-background text-text-primary selection:bg-accent selection:text-white">

                {/* ══════════════════════════
                    STICKY HEADER
                ══════════════════════════ */}
                <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
                    <div className="container mx-auto flex h-16 items-center justify-between px-6">
                        <Link href="/" className="flex items-center gap-2.5 shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent shadow-[0_0_14px_rgba(255,77,0,0.45)]">
                                <Music className="text-white" size={16} />
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                Gitar<span className="text-accent">Pro</span>
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-text-secondary">
                            <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
                            <a href="#community" className="hover:text-text-primary transition-colors">Community</a>
                            <a href="#lessons" className="hover:text-text-primary transition-colors">Lessons</a>
                            <a href="#pricing" className="hover:text-text-primary transition-colors">Pricing</a>
                        </nav>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={route('video.feed')}
                                    className="rounded-full border border-border bg-surface px-5 py-1.5 text-sm font-semibold hover:bg-surface-elevated transition-colors"
                                >
                                    Go to Feed
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-accent px-5 py-1.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(255,77,0,0.35)] hover:bg-accent-hover transition-all hover:shadow-[0_0_22px_rgba(255,77,0,0.5)]"
                                    >
                                        Get started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* ══════════════════════════
                    HERO  — BeamsBackground wraps the full hero viewport
                ══════════════════════════ */}
                <BeamsBackground
                    intensity="medium"
                    className="max-h-screen min-h-[calc(100svh-4rem)]"
                >
                    <section
                        className="flex flex-col items-center justify-center px-6 pb-10 pt-8 text-center h-full min-h-[calc(100svh-4rem)]"
                        aria-label="Hero"
                    >
                        {/* Static headline */}
                        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-text-secondary/50">
                            The guitar community platform
                        </p>

                        <h1 className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-extrabold leading-[1.1] tracking-tight">
                            Show your skills.
                        </h1>

                        {/* Morphing line — orange, sized relative to h1 */}
                        <div className="w-full max-w-3xl">
                            <MorphingText
                                texts={MORPH_TEXTS}
                                className="
                                text-accent
                                h-[1.3em]
                                text-[clamp(2.4rem,5.5vw,4.5rem)]
                                md:h-[1.3em]
                                lg:text-[clamp(2.4rem,5.5vw,4.5rem)]
                            "
                            />
                        </div>

                        {/* Subtitle */}
                        <p className="mt-4 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">
                            Upload covers, share tabs, and level up your skills with a global community of guitarists.
                        </p>

                        {/* CTAs */}
                        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                            {auth.user ? (
                                <Link
                                    href={route('login')}
                                    id="hero-cta-explore"
                                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-8 py-3.5 text-base font-semibold transition-all hover:bg-surface-elevated hover:border-accent/30 hover:scale-[1.02] active:scale-95"
                                >
                                    <PlayCircle size={18} className="text-accent" />
                                    Explore feed
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register')}
                                        id="hero-cta-register"
                                        className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-base font-bold text-white shadow-[0_0_24px_rgba(255,77,0,0.4)] transition-all hover:bg-accent-hover hover:shadow-[0_0_32px_rgba(255,77,0,0.55)] hover:scale-[1.03] active:scale-95"
                                    >
                                        <Guitar size={18} className="transition-transform group-hover:-rotate-12" />
                                        Explore feed
                                    </Link>
                                </>
                            )}
                        </div>
                    </section>
                </BeamsBackground>

                {/* ══════════════════════════
                    CAROUSEL SECTION
                ══════════════════════════ */}
                <section className="relative z-10 px-6 pb-20" id="features" aria-label="Feature showcase">
                    <DuoCarousel />
                </section>

                {/* ══════════════════════════
                    STATS
                ══════════════════════════ */}
                <section className="relative z-10 px-6 pb-24" id="pricing">
                    <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-surface p-10">
                        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
                            {[
                                { icon: Users, value: '10k+', label: 'Guitarists joined' },
                                { icon: Star, value: '50k+', label: 'Tabs shared' },
                                { icon: PlayCircle, value: '200k+', label: 'Videos watched' },
                            ].map(({ icon: Icon, value, label }, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                                        <Icon size={22} />
                                    </div>
                                    <span className="text-3xl font-extrabold tracking-tight">{value}</span>
                                    <span className="text-sm text-text-secondary">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════
                    FOOTER
                ══════════════════════════ */}
                <footer className="relative z-10 border-t border-border/40 py-8">
                    <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 sm:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent">
                                <Music className="text-white" size={12} />
                            </div>
                            <span className="text-sm font-bold">
                                Gitar<span className="text-accent">Pro</span>
                            </span>
                        </div>
                        <p className="text-xs text-text-secondary">
                            © {new Date().getFullYear()} GitarPro. Built for musicians, by musicians.
                        </p>
                        <div className="flex gap-5 text-xs text-text-secondary">
                            <a href="#" className="hover:text-accent transition-colors uppercase tracking-widest font-mono">Privacy</a>
                            <a href="#" className="hover:text-accent transition-colors uppercase tracking-widest font-mono">Terms</a>
                            <a href="#" className="hover:text-accent transition-colors uppercase tracking-widest font-mono">GitHub</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
