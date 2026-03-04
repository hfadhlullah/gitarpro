import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }: { className?: string }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-4 ${className}`}>
            <p className="text-sm text-text-secondary">
                Once your account is deleted, all videos, tabs, and data will be permanently removed. This action cannot be undone.
            </p>

            <button
                onClick={confirmUserDeletion}
                className="rounded-lg border border-red-800/60 bg-red-900/20 px-5 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-900/40 active:scale-95"
            >
                Delete Account
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 bg-surface rounded-2xl">
                    <h2 className="text-lg font-bold text-white">
                        Delete your account?
                    </h2>
                    <p className="mt-2 text-sm text-text-secondary">
                        This is permanent. All your data will be deleted. Enter your password to confirm.
                    </p>

                    <div className="mt-5">
                        <label htmlFor="delete_password" className="sr-only">Password</label>
                        <input
                            id="delete_password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Your password"
                            autoFocus
                            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-white placeholder-text-secondary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                        />
                        <InputError message={errors.password} className="mt-1.5 text-red-400 text-sm" />
                    </div>

                    <div className="mt-5 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-text-secondary transition hover:text-white hover:bg-border"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {processing ? 'Deleting…' : 'Delete Account'}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
