import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Join GitarPro</h2>
                <p className="text-sm text-text-secondary">Create an account to share your covers</p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" className="text-text-primary" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full bg-surface-elevated border-border text-text-primary focus:border-accent focus:ring-accent"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2 text-red-500" />
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="email" value="Email" className="text-text-primary" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-surface-elevated border-border text-text-primary focus:border-accent focus:ring-accent"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2 text-red-500" />
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="password" value="Password" className="text-text-primary" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-surface-elevated border-border text-text-primary focus:border-accent focus:ring-accent"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2 text-red-500" />
                </div>

                <div className="mt-6">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="text-text-primary"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full bg-surface-elevated border-border text-text-primary focus:border-accent focus:ring-accent"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 text-red-500"
                    />
                </div>

                <div className="mt-8">
                    <button
                        disabled={processing}
                        className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-accent hover:bg-accent-hover shadow-[0_0_20px_rgba(255,77,0,0.3)] hover:shadow-[0_0_25px_rgba(255,77,0,0.5)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                    >
                        Sign up
                    </button>

                    <div className="mt-6 text-center text-sm text-text-secondary">
                        Already registered?{' '}
                        <Link href={route('login')} className="font-semibold text-accent hover:text-accent-hover transition-colors">
                            Log in
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
