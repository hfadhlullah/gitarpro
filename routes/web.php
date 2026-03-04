<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VideoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return redirect()->route('video.feed');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile: /profile → own profile, /profile/{user} → any user's profile
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/{user}', [ProfileController::class, 'show'])->name('profile.show.user');

    // Settings (was /profile edit before)
    Route::get('/settings', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/settings', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/settings/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo');
    Route::delete('/settings', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Video Upload
    Route::get('/upload', [VideoController::class, 'create'])->name('video.create');
    Route::post('/upload', [VideoController::class, 'store'])->name('video.store');

    // Video Feed
    Route::get('/feed', [VideoController::class, 'feed'])->name('video.feed');

    // Likes (toggle)
    Route::post('/videos/{video}/like', [VideoController::class, 'like'])->name('video.like');

    // Comments
    Route::post('/videos/{video}/comments', [CommentController::class, 'store'])->name('comment.store');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comment.destroy');

    // Lessons
    Route::get('/lessons', [LessonController::class, 'index'])->name('lesson.index');
    Route::post('/lessons', [LessonController::class, 'store'])->name('lesson.store');
});

require __DIR__.'/auth.php';
