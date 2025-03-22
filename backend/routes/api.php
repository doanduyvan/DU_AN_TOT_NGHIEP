<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;

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

Route::get('orders', [OrderController::class, 'index']);
Route::get('orders/{id}', [OrderController::class, 'getOrderById']);
Route::post('orders/update/{id}', [OrderController::class, 'update']);



Route::resource('roles', RoleController::class)->except(['create', 'show', 'destroy', 'update']);
Route::get('roles/permissions', [RoleController::class, 'showPermissions']);
Route::post('roles/create', [RoleController::class, 'create'])->middleware('check.permission:create-role');
Route::get('roles/showrole/{id}', [RoleController::class, 'show'])->middleware('check.permission:update-role');
Route::post('roles/update/{id}', [RoleController::class, 'update'])->middleware('check.permission:update-role');
Route::post('roles/destroy', [RoleController::class, 'destroy'])->middleware('check.permission:delete-role');

Route::get('permissions', [PermissionController::class, 'index']);
Route::post('permissions/create', [PermissionController::class, 'create'])->middleware('check.permission:create-permission');
Route::get('permissions/show/{id}', [PermissionController::class, 'show'])->middleware('check.permission:update-permission');
Route::post('permissions/update/{id}', [PermissionController::class, 'update'])->middleware('check.permission:update-permission');
Route::post('permissions/destroy', [PermissionController::class, 'destroy'])->middleware('check.permission:update-permission');


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route được bảo vệ bởi Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/users', [UserController::class, 'index']);
});
route::post('/users/destroy/{id}', [UserController::class, 'destroy'])->middleware('check.permission:delete-customer');
Route::middleware('check.permission:update-customer')->group(function () {
    Route::post('/users/updatestatus', [UserController::class, 'updateStatus']);
    Route::post('/users/update/{id}', [UserController::class, 'updateUser']);
    Route::get('/users/showroles', [UserController::class, 'showRoles']);
    route::get('/users/{id}', [UserController::class, 'getUserById']);
});



route::get('/categories/{id?}', [CategoriesController::class, 'index']);
route::post('/categories/create', [CategoriesController::class, 'create'])->middleware('check.permission:create-category');
route::post('/categories/delete', [CategoriesController::class, 'destroy'])->middleware('check.permission:delete-category');
route::post('/categories/update/{id}', [CategoriesController::class, 'update'])->middleware('check.permission:update-category');

route::get('/products', [ProductsController::class, 'index']);
route::post('/products/update/{id}', [ProductsController::class, 'update'])->middleware('check.permission:update-product');
route::get('/products/{id}', [ProductsController::class, 'getProductById'])->middleware('check.permission:update-product');

route::post('/products/create', [ProductsController::class, 'create'])->middleware('check.permission:create-product');
route::post('/products/delete', [ProductsController::class, 'destroy'])->middleware('check.permission:delete-product');


Route::get('/testapi', function () {
    return json_encode(['tinnhan' => 'ok roi api hoạt động 12']);
});
