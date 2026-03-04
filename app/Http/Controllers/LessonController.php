<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    /** Browse published lessons (all authenticated users) */
    public function index(Request $request): Response
    {
        $query = Lesson::with('user:id,name')
            ->where('status', 'published');

        if ($request->filled('level')) {
            $query->where('level', $request->level);
        }

        $lessons = $query->latest()->get()->map(fn (Lesson $l) => [
            'id' => $l->id,
            'title' => $l->title,
            'description' => $l->description,
            'level' => $l->level,
            'tags' => $l->tags ?? [],
            'user' => $l->user ? ['id' => $l->user->id, 'name' => $l->user->name] : null,
            'video_url' => $l->storage_key
                ? Storage::disk('s3')->temporaryUrl($l->storage_key, now()->addMinutes(60))
                : null,
            'created_at' => $l->created_at->diffForHumans(),
        ]);

        return Inertia::render('Lesson/Index', [
            'lessons' => $lessons,
            'activeLevel' => $request->level ?? null,
        ]);
    }

    /** Submit a new lesson (users) */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('submit_lesson');

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'level' => 'required|in:beginner,intermediate,pro',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'video' => 'required|file|mimetypes:video/mp4,video/quicktime,video/x-msvideo|max:512000',
        ]);

        $path = $request->file('video')->store('lessons', 's3');

        Lesson::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'level' => $validated['level'],
            'tags' => $validated['tags'] ?? [],
            'storage_key' => $path,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Lesson submitted for review.');
    }
}
