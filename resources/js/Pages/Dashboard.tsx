import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
                        <div className="p-8">
                            <h3 className="mb-2 text-2xl font-bold text-white">Welcome back!</h3>
                            <p className="text-text-secondary">
                                Share your guitar covers or explore what the community is playing.
                            </p>

                            <div className="mt-8 flex gap-4">
                                <Link
                                    href={route('video.create')}
                                    className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(255,77,0,0.3)] transition-all hover:bg-accent-hover active:scale-95"
                                >
                                    Upload Video
                                </Link>
                                <Link
                                    href={route('video.feed')}
                                    className="rounded-lg border border-border bg-transparent px-6 py-2.5 text-sm font-semibold text-text-primary transition-all hover:bg-surface-elevated"
                                >
                                    Explore Feed
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
