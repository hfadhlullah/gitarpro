<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Like;
use App\Models\User;
use App\Models\Video;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Public-facing TikTok-style profile page for any user.
     * When no user is provided, shows the authenticated user's own profile.
     */
    public function show(Request $request, ?User $user = null): Response
    {
        $user = $user ?? $request->user();
        $authId = $request->user()->id;

        // Videos this user uploaded
        $videos = $user->videos()
            ->withCount(['likes', 'comments'])
            ->with(['tab', 'comments.user'])
            ->latest()
            ->get()
            ->map(fn (Video $v) => [
                'id' => $v->id,
                'title' => $v->title,
                'url' => $v->signedUrl(),
                'likes_count' => $v->likes_count,
                'liked' => Like::where('user_id', $authId)->where('video_id', $v->id)->exists(),
                'created_at' => $v->created_at->diffForHumans(),
                'tab' => $v->tab ? ['format' => $v->tab->format, 'content' => $v->tab->content] : null,
                'comments_count' => $v->comments_count,
                'comments' => $v->comments->sortByDesc('created_at')->take(50)->values()->map(fn ($c) => [
                    'id' => $c->id,
                    'content' => $c->content,
                    'user_id' => $c->user_id,
                    'user' => ['id' => $c->user->id, 'name' => $c->user->name],
                    'created_at' => $c->created_at->diffForHumans(),
                ]),
            ]);

        // Videos this user liked
        $liked = Video::whereHas('likes', fn ($q) => $q->where('user_id', $user->id))
            ->with(['user', 'tab', 'comments.user'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->get()
            ->map(fn (Video $v) => [
                'id' => $v->id,
                'title' => $v->title,
                'url' => $v->signedUrl(),
                'likes_count' => $v->likes_count,
                'liked' => Like::where('user_id', $authId)->where('video_id', $v->id)->exists(),
                'created_at' => $v->created_at->diffForHumans(),
                'user' => ['id' => $v->user->id, 'name' => $v->user->name],
                'tab' => $v->tab ? ['format' => $v->tab->format, 'content' => $v->tab->content] : null,
                'comments_count' => $v->comments_count,
                'comments' => $v->comments->sortByDesc('created_at')->take(50)->values()->map(fn ($c) => [
                    'id' => $c->id,
                    'content' => $c->content,
                    'user_id' => $c->user_id,
                    'user' => ['id' => $c->user->id, 'name' => $c->user->name],
                    'created_at' => $c->created_at->diffForHumans(),
                ]),
            ]);

        return Inertia::render('Profile/Show', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'profile_photo_url' => $user->profile_photo_path
                    ? Storage::disk('s3')->temporaryUrl($user->profile_photo_path, now()->addMinutes(60))
                    : null,
                'videos_count' => $user->videos()->count(),
                'likes_received' => Like::whereIn('video_id', $user->videos()->pluck('id'))->count(),
            ],
            'videos' => $videos,
            'likedVideos' => $liked,
            'isOwner' => $authId === $user->id,
        ]);
    }

    /**
     * Display the user's profile settings form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'profile_photo_url' => $request->user()->profile_photo_path
                ? Storage::disk('s3')->temporaryUrl($request->user()->profile_photo_path, now()->addMinutes(60))
                : null,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Upload / replace the user's profile photo.
     */
    public function updatePhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $user = $request->user();

        // Delete old photo
        if ($user->profile_photo_path) {
            Storage::disk('s3')->delete($user->profile_photo_path);
        }

        $path = $request->file('photo')->store('avatars', 's3');
        $user->update(['profile_photo_path' => $path]);

        return Redirect::route('profile.edit')->with('status', 'photo-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
