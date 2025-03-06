<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

route::get('/categories/{id?}',[CategoriesController::class,'index']);
route::post('/categories/create',[CategoriesController::class,'create']);
route::post('/categories/delete',[CategoriesController::class,'destroy']);
route::post('/categories/update/{id}',[CategoriesController::class,'update']);


Route::get('/testapi',function(){
    return json_encode(['tinnhan' => 'ok roi api hoạt động']);
});