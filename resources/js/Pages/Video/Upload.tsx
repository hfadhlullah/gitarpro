import { FormEventHandler, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Upload as UploadIcon, FileVideo, Music, X } from 'lucide-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function Upload() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors, progress } = useForm({
        title: '',
        video: null as File | null,
        has_tab: false,
        tab_format: 'text',
        tab_content: '',
    });

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
            setData((prev) => ({
                ...prev,
                video: file,
                title: prev.title || nameWithoutExt,
            }));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('video.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-white flex items-center gap-2">
                    <UploadIcon className="text-accent" />
                    Upload Cover
                </h2>
            }
        >
            <Head title="Upload Video" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
                        <div className="p-8">
                            <form onSubmit={submit} className="space-y-8">

                                {/* Drag & Drop Area */}
                                <div>
                                    <InputLabel value="Video File" className="text-text-primary mb-3 text-lg font-semibold" />
                                    <div
                                        onClick={triggerFileSelect}
                                        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-all ${data.video
                                            ? 'border-accent bg-accent/5'
                                            : 'border-border bg-surface hover:border-accent hover:bg-surface-elevated'
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
                                            <div className="flex flex-col items-center space-y-4">
                                                <div className="rounded-full bg-accent/20 p-4 shadow-[0_0_20px_rgba(255,77,0,0.2)]">
                                                    <FileVideo className="h-10 w-10 text-accent" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{data.video.name}</p>
                                                    <p className="text-sm text-text-secondary italic">
                                                        {data.video.size >= 1048576
                                                            ? `${(data.video.size / 1048576).toFixed(2)} MB`
                                                            : `${(data.video.size / 1024).toFixed(2)} KB`}
                                                    </p>
                                                    {data.video.size === 0 && (
                                                        <p className="text-[10px] text-red-500 font-bold uppercase mt-1 animate-pulse">Warning: Empty file selected</p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setData('video', null); }}
                                                    className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center space-y-4">
                                                <div className="rounded-full bg-surface-elevated p-4 group-hover:bg-accent/10 group-hover:shadow-[0_0_15px_rgba(255,77,0,0.2)] transition-all">
                                                    <UploadIcon className="h-10 w-10 text-text-secondary group-hover:text-accent transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white mb-1">Click to browse or drag & drop</p>
                                                    <p className="text-sm text-text-secondary">MP4, MOV, AVI up to 200MB</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.video} className="mt-2 text-red-500" />
                                </div>

                                {/* Title Input */}
                                <div>
                                    <InputLabel htmlFor="title" value="Title" className="text-text-primary" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-2 block w-full bg-background border-border text-white focus:border-accent focus:ring-accent py-3"
                                        placeholder="e.g. Master of Puppets - Guitar Solo Cover"
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2 text-red-500" />
                                </div>

                                {/* Tab Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-accent/20 p-2">
                                                <Music className="h-5 w-5 text-accent" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">Attach Musical Tab</h3>
                                                <p className="text-sm text-text-secondary">Help others play along with your cover</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={data.has_tab}
                                                onChange={(e) => setData('has_tab', e.target.checked)}
                                            />
                                            <div className="peer h-6 w-11 rounded-full bg-surface-elevated border border-border after:absolute after:top-[2px] after:left-[2px] after:h-5 after:after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                                        </label>
                                    </div>

                                    {data.has_tab && (
                                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="rounded-xl border border-border bg-background p-4">
                                                <InputLabel value="Tab Content (ASCII / Text)" className="text-text-primary mb-2 text-sm" />
                                                <textarea
                                                    className="w-full h-48 bg-surface-elevated border-border rounded-lg text-text-primary font-mono text-sm focus:border-accent focus:ring-accent p-4 scrollbar-hide"
                                                    placeholder={`e|------------------|\nB|------------------|\nG|------------------|\nD|------------------|\nA|---7---7h9p7------|\nE|-0---0-------10---|`}
                                                    value={data.tab_content}
                                                    onChange={(e) => setData('tab_content', e.target.value)}
                                                ></textarea>
                                                <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-text-secondary font-bold">
                                                    <span>Format: ASCII TEXT</span>
                                                    <span>Character Alignment Matters</span>
                                                </div>
                                                <InputError message={errors.tab_content} className="mt-2 text-red-500" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Progress Bar & Submit Button */}
                                <div className="pt-8 border-t border-border flex items-center justify-between">
                                    <div className="flex-1 mr-8">
                                        {progress && (
                                            <div className="w-full bg-surface-elevated rounded-full h-2">
                                                <div
                                                    className="bg-accent h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(255,77,0,0.5)]"
                                                    style={{ width: `${progress.percentage}%` }}
                                                ></div>
                                                <p className="text-xs text-text-secondary mt-2 w-full text-left">{progress.percentage}% Uploaded</p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || !data.video}
                                        className="flex items-center gap-2 rounded-xl bg-accent px-8 py-3 font-bold text-white shadow-[0_0_20px_rgba(255,77,0,0.3)] transition-all hover:bg-accent-hover hover:shadow-[0_0_25px_rgba(255,77,0,0.5)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        <Music size={20} />
                                        {processing ? 'Uploading...' : 'Publish Cover'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
