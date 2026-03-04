import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { Music, Menu, X, User } from 'lucide-react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-accent selection:text-white">
            <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="group flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent shadow-[0_0_15px_rgba(255,77,0,0.5)] transition-all group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(255,77,0,0.6)]">
                                        <Music className="text-white" size={24} />
                                    </div>
                                    <span className="text-xl font-black tracking-tighter text-white">
                                        GITAR<span className="text-accent">PRO</span>
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('video.feed')}
                                    active={route().current('video.feed')}
                                    className="!text-text-primary hover:!text-accent data-[active=true]:!border-accent data-[active=true]:!text-accent"
                                >
                                    Feed
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm font-medium leading-4 text-text-primary transition duration-150 ease-in-out hover:bg-border focus:outline-none"
                                            >
                                                <User size={16} className="text-text-secondary" />
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content contentClasses="py-1 bg-surface-elevated border border-border">
                                        <Dropdown.Link
                                            href={route('profile.show')}
                                            className="text-text-primary hover:bg-border hover:text-white"
                                        >
                                            My Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="text-text-primary hover:bg-border hover:text-white"
                                        >
                                            Settings
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="text-accent hover:bg-border/50 hover:text-accent-hover"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-text-secondary transition duration-150 ease-in-out hover:bg-surface-elevated hover:text-white focus:bg-surface-elevated focus:text-white focus:outline-none"
                            >
                                {showingNavigationDropdown ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-surface-elevated border-b border-border absolute w-full'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('video.feed')}
                            active={route().current('video.feed')}
                            className="!text-text-primary hover:!bg-border hover:!text-white data-[active=true]:!border-accent data-[active=true]:!bg-accent/10 data-[active=true]:!text-accent"
                        >
                            Feed
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-border pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-white">{user.name}</div>
                            <div className="text-sm font-medium text-text-secondary">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink
                                href={route('profile.show')}
                                className="!text-text-primary hover:!bg-border hover:!text-white"
                            >
                                My Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('profile.edit')}
                                className="!text-text-primary hover:!bg-border hover:!text-white"
                            >
                                Settings
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="!text-accent hover:!bg-border/50"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-surface border-b border-border shadow-md">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
