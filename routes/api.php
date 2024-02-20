<?php

use App\Http\Controllers\Api\StarController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/stars', [StarController::class, 'index']);
Route::get('/stars/{star}', [StarController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/stars', [StarController::class, 'store']);
    Route::put('/stars/{star}', [StarController::class, 'update']);
    Route::delete('/stars/{star}', [StarController::class, 'destroy']);
});
