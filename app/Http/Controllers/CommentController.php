<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Video;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Store a new comment on a video.
     */
    public function store(Request $request, Video $video)
    {
        $request->validate([
            'content' => ['required', 'string', 'max:500'],
        ]);

        $video->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $request->content,
        ]);

        return back();
    }

    /**
     * Delete a comment (owner only).
     */
    public function destroy(Request $request, Comment $comment)
    {
        if ($comment->user_id !== $request->user()->id) {
            abort(403);
        }

        $comment->delete();

        return back();
    }
}
