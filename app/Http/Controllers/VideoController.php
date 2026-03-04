<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVideoRequest;
use App\Models\Like;
use App\Models\User;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class VideoController extends Controller
{
    /**
     * Show the video upload form.
     */
    public function create()
    {
        return Inertia::render('Video/Upload');
    }

    /**
     * TikTok-style vertical feed of all videos, newest first.
     */
    public function feed()
    {
        $userId = auth()->id();

        $videos = Video::with(['user', 'tab', 'comments.user'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->get()
            ->map(fn (Video $v) => [
                'id' => $v->id,
                'title' => $v->title,
                'url' => $v->signedUrl(),
                'likes_count' => $v->likes_count,
                'liked' => Like::where('user_id', $userId)->where('video_id', $v->id)->exists(),
                'user' => [
                    'id' => $v->user->id,
                    'name' => $v->user->name,
                    'profile_photo_url' => $v->user->profile_photo_path
                        ? Storage::disk('s3')->temporaryUrl($v->user->profile_photo_path, now()->addMinutes(60))
                        : null,
                ],
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

        // Suggested users: other users who have uploaded videos, excluding self, up to 5
        $suggestedUsers = User::where('id', '!=', $userId)
            ->has('videos')
            ->withCount('videos')
            ->inRandomOrder()
            ->take(5)
            ->get()
            ->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'profile_photo_path' => $u->profile_photo_path
                    ? Storage::disk('s3')->temporaryUrl($u->profile_photo_path, now()->addMinutes(60))
                    : null,
                'videos_count' => $u->videos_count,
            ]);

        return Inertia::render('Video/Feed', [
            'videos' => $videos,
            'suggestedUsers' => $suggestedUsers,
        ]);
    }

    /**
     * Toggle like on a video.
     */
    public function like(Request $request, Video $video)
    {
        $userId = $request->user()->id;

        $existing = Like::where('user_id', $userId)->where('video_id', $video->id)->first();

        if ($existing) {
            $existing->delete();
        } else {
            Like::create(['user_id' => $userId, 'video_id' => $video->id]);
        }

        return back();
    }

    /**
     * Store a newly created video in storage.
     */
    public function store(StoreVideoRequest $request)
    {
        $this->authorize('upload_video');

        return DB::transaction(function () use ($request) {
            $file = $request->file('video');
            $extension = $file->getClientOriginalExtension();
            $filename = Str::uuid().'.'.$extension;

            // Store directly to s3 disk (MinIO)
            $path = $file->storeAs('videos', $filename, 's3');

            if ($path === false) {
                throw new \RuntimeException('Could not write video to storage.');
            }

            // Create DB record
            $video = Video::create([
                'user_id' => $request->user()->id,
                'storage_key' => $path,
                'title' => $request->title,
            ]);

            // Create Tab if provided
            if ($request->has_tab) {
                $video->tab()->create([
                    'format' => $request->tab_format,
                    'content' => $request->tab_content,
                ]);
            }

            return redirect()->route('video.feed')->with('success', 'Video uploaded successfully!');
        });
    }
}
