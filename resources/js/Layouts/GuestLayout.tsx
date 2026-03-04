import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Music } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-background pt-6 sm:justify-center sm:pt-0 pb-12">
            <div>
                <Link href="/" className="group flex items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent shadow-[0_0_20px_rgba(255,77,0,0.5)] transition-all group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(255,77,0,0.6)]">
                        <Music className="text-white" size={28} />
                    </div>
                </Link>
            </div>

            <div className="mt-8 w-full overflow-hidden border border-border bg-surface p-8 shadow-2xl sm:max-w-md sm:rounded-2xl">
                {children}
            </div>
        </div>
    );
}
