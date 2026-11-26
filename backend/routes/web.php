<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ResourceController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/courses', [CourseController::class, 'index'])->name('courses');
Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::get('/resources', [ResourceController::class, 'index'])->name('resources');
Route::get('/resources/download/{id}', [ResourceController::class, 'download'])->name('resources.download');

// Admin Routes
Route::prefix('admin')->name('admin.')->group(function () {
     Route::middleware('admin.guest')->group(function () {
          Route::get('/login', [App\Http\Controllers\Admin\AuthController::class, 'showLoginForm'])->name('login');
          Route::post('/login', [App\Http\Controllers\Admin\AuthController::class, 'login'])->name('login.submit');
     });
Route::middleware('admin.auth')->group(function () {
          Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
          Route::post('/logout', [App\Http\Controllers\Admin\AuthController::class, 'logout'])->name('logout');

          // Enquiries
          Route::resource('enquiries', App\Http\Controllers\Admin\EnquiryController::class)->except(['create', 'store', 'edit'])->middleware('can:manage-enquiries,admin');

          // Gallery
          Route::resource('gallery', App\Http\Controllers\Admin\GalleryController::class)->names('gallery')->middleware('can:manage-gallery,admin');

          // Hero Media
          Route::resource('hero', App\Http\Controllers\Admin\HeroController::class)->names('hero')->middleware('can:manage-hero,admin');

          // Media Manager
          Route::resource('media', App\Http\Controllers\Admin\MediaController::class)->names('media')->except(['show', 'edit', 'update', 'create'])->middleware('can:manage-media,admin');

          // Courses
          Route::resource('courses', App\Http\Controllers\Admin\CourseController::class)->names('courses')->middleware('can:manage-gallery,admin');

          // Admin Users (Super Admin Only)
          Route::resource('users', App\Http\Controllers\Admin\AdminUserController::class)->names('users')->middleware('can:manage-users,admin');

          // Activity Logs
          Route::get('activity-logs', [App\Http\Controllers\Admin\ActivityLogController::class, 'index'])->name('activity.index')->middleware('can:manage-users,admin');
     });
});

// Redirect default /login to /admin/login to avoid 404
Route::redirect('/login', '/admin/login');
