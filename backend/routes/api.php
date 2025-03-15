<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

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

Route::resource('roles', RoleController::class)->except(['create', 'show', 'destroy', 'update']);
Route::post('roles/create', [RoleController::class, 'create']);
Route::get('roles/permissions', [RoleController::class, 'showPermissions']);
Route::get('roles/showrole/{id}', [RoleController::class, 'show']);
Route::post('roles/update/{id}', [RoleController::class, 'update']);
Route::post('roles/destroy', [RoleController::class, 'destroy']);

Route::get('permissions', [PermissionController::class, 'index']);
Route::post('permissions/create', [PermissionController::class, 'create']);
Route::get('permissions/show/{id}', [PermissionController::class, 'show']);
Route::post('permissions/destroy', [PermissionController::class, 'destroy']);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route được bảo vệ bởi Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/users', [UserController::class, 'index']);
    
});

route::get('/categories/{id?}',[CategoriesController::class,'index']);
route::post('/categories/create',[CategoriesController::class,'create']);
route::post('/categories/delete',[CategoriesController::class,'destroy']);
route::post('/categories/update/{id}',[CategoriesController::class,'update']);

route::get('/products',[ProductsController::class,'index']);
route::get('/products/{id}',[ProductsController::class,'getProductById']);
route::post('/products/update/{id}',[ProductsController::class,'update']);
route::post('/products/create',[ProductsController::class,'create']);
route::post('/products/delete',[ProductsController::class,'destroy']);


Route::get('/testapi',function(){
    return json_encode(['tinnhan' => 'ok roi api hoạt động 12']);
});