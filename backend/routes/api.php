<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\CategoryNewsController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\customer\HomeController;
use App\Http\Controllers\customer\ProductdetailController;
use App\Http\Controllers\customer\ShopController;
use App\Http\Controllers\customer\NewsController as CustomerNewsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CommentProductController;
use App\Http\Controllers\CommentNewsController;
use App\Http\Controllers\customer\CartController;
use App\Http\Controllers\customer\NewsdetailController;
use App\Http\Controllers\customer\ProfileController;
use App\Http\Controllers\ChartDataController;
use App\Http\Controllers\customer\CheckoutController;
use App\Http\Controllers\Trashed\TrashedCategoryController;
use App\Http\Controllers\Trashed\TrashedCategoryNewsController;
use App\Http\Controllers\Trashed\TrashedUserController;
use App\Http\Controllers\Trashed\TrashedRoleController;
use App\Http\Controllers\Trashed\TrashedPermissionController;
use App\Http\Controllers\Trashed\TrashedProductController;
use App\Http\Controllers\Trashed\TrashedOrderController;
use App\Http\Controllers\Trashed\TrashedNewsController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\VoucherController;

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
route::group(['prefix' => 'vouchers'], function (){
    Route::get('/', [VoucherController::class, 'index']);
    Route::post('/updatestatus', [VoucherController::class, 'updateStatus']);
    Route::post('/create', [VoucherController::class, 'create']);

});

Route::get('/provinces', [LocationController::class, 'getProvinces']);
Route::get('/districts/{provinceCode}', [LocationController::class, 'getDistrictsByProvince']);
Route::get('/wards/{districtCode}', [LocationController::class, 'getWardsByDistrict']);

route::post('orders/search-by-phone', [OrderController::class, 'searchByPhone']);


route::get('/users/trash', [TrashedUserController::class, 'index']);
route::post('/users/restore', [TrashedUserController::class, 'restore']);
route::delete('/users/force-delete/{id}', [TrashedUserController::class, 'forceDelete']);

route::get('/roles/trash', [TrashedRoleController::class, 'index']);
route::post('/roles/restore', [TrashedRoleController::class, 'restore']);
route::delete('/roles/force-delete/{id}', [TrashedRoleController::class, 'forceDelete']);

route::get('/products/trash', [TrashedProductController::class, 'index']);
route::post('/products/restore', [TrashedProductController::class, 'restore']);
route::delete('/products/force-delete/{id}', [TrashedProductController::class, 'forceDelete']);

route::get('/permissions/trash', [TrashedPermissionController::class, 'index']);
route::post('/permissions/restore', [TrashedPermissionController::class, 'restore']);
route::delete('/permissions/force-delete/{id}', [TrashedPermissionController::class, 'forceDelete']);

route::get('/orders/trash', [TrashedOrderController::class, 'index']);
route::post('/orders/restore', [TrashedOrderController::class, 'restore']);
route::delete('/orders/force-delete/{id}', [TrashedOrderController::class, 'forceDelete']);

route::get('/news/trash', [TrashedNewsController::class, 'index']);
route::post('/news/restore', [TrashedNewsController::class, 'restore']);
route::delete('/news/force-delete/{id}', [TrashedNewsController::class, 'forceDelete']);

route::get('/categorynews/trash', [TrashedCategoryNewsController::class, 'index']);
route::post('/categorynews/restore', [TrashedCategoryNewsController::class, 'restore']);
route::delete('/categorynews/force-delete/{id}', [TrashedCategoryNewsController::class, 'forceDelete']);


route::get('/categories/trash', [TrashedCategoryController::class, 'index']);
route::post('/categories/restore', [TrashedCategoryController::class, 'restore']);
route::delete('/categories/force-delete/{id}', [TrashedCategoryController::class, 'forceDelete']);


Route::get('/statisticals/product-performance', [ChartDataController::class, 'getProductPerformance']);
Route::get('/statisticals/get-order-year', [ChartDataController::class, 'getOrderYear']);
Route::get('/statisticals/get-order-statistics/{year}', [ChartDataController::class, 'getOrderStatistics']);


Route::get('orders', [OrderController::class, 'index']);
Route::get('orders/get-product-variant', [OrderController::class, 'getProductVariant']);
Route::get('orders/category-products', [OrderController::class, 'getCategoryProducts']);
Route::post('orders/update/{id}', [OrderController::class, 'update']);
Route::post('orders/destroy', [OrderController::class, 'destroy']);
Route::post('orders/create', [OrderController::class, 'create']);
Route::post('orders/create-user', [OrderController::class, 'createUser']);
Route::post('orders/update-order-status/{id}', [OrderController::class, 'updateOrderStatus']);
Route::post('orders/update-payment-status/{id}', [OrderController::class, 'updatePaymentStatus']);
Route::post('orders/update-shipping-status/{id}', [OrderController::class, 'updateShippingStatus']);
Route::post('orders/update-order-detail', [OrderController::class, 'updateOrderDetail']);
Route::post('orders/destroy-order-detail/{id}', [OrderController::class, 'deleteOrderDetail']);
Route::post('orders/update-quantities', [OrderController::class, 'updateQuantities']);
Route::get('orders/{id}', [OrderController::class, 'getOrderById']);



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
Route::get('/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/forgot-password', [AuthController::class, 'sendResetPasswordEmail']);
Route::get('/check-reset-token', [AuthController::class, 'checkResetToken']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/resend-verify-email', [AuthController::class, 'resendVerifyEmail']);


// Route được bảo vệ bởi Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/users', [UserController::class, 'index']);
});
route::post('/users/destroy', [UserController::class, 'destroy'])->middleware('check.permission:delete-customer');

Route::middleware('check.permission:update-customer')->group(function () {
    route::post('/users/search-users', [UserController::class, 'searchUser']);
    Route::post('/users/updatestatus', [UserController::class, 'updateStatus']);
    Route::post('/users/rolelevel/{id}', [UserController::class, 'roleLevel']);
    Route::post('/users/update/{id}', [UserController::class, 'updateUser']);
    Route::get('/users/showroles', [UserController::class, 'showRoles']);
    route::get('/users/{id}', [UserController::class, 'getUserById']);
});


route::post('/categories/create', [CategoriesController::class, 'create'])->middleware('check.permission:create-category');
route::post('/categories/destroy', [CategoriesController::class, 'destroy'])->middleware('check.permission:delete-category');
route::post('/categories/update/{id}', [CategoriesController::class, 'update'])->middleware('check.permission:update-category');
route::get('/categories', [CategoriesController::class, 'index']);
route::get('/categories/getbyid/{id}', [CategoriesController::class, 'getCategoyById']);


route::get('/categorynews', [CategoryNewsController::class, 'index']);
route::get('/categorynews/getbyid/{id}', [CategoryNewsController::class, 'getCategoyById']);
route::post('/categorynews/create', [CategoryNewsController::class, 'create'])->middleware('check.permission:create-category-news');
route::post('/categorynews/destroy', [CategoryNewsController::class, 'destroy'])->middleware('check.permission:delete-category-news');
route::post('/categorynews/update/{id}', [CategoryNewsController::class, 'update'])->middleware('check.permission:update-category-news');

route::get('/products', [ProductsController::class, 'index']);
route::get('/products/getcategories', [ProductsController::class, 'getAllCategories']);
route::post('/products/search-variant-product', [ProductsController::class, 'searchVariantProduct']);
route::post('/products/search-product', [ProductsController::class, 'searchProduct']);
route::post('/products/update/{id}', [ProductsController::class, 'update'])->middleware('check.permission:update-product');
route::post('/products/create', [ProductsController::class, 'create'])->middleware('check.permission:create-product');
route::post('/products/destroy', [ProductsController::class, 'destroy'])->middleware('check.permission:delete-product');
route::get('/products/{id}', [ProductsController::class, 'getProductById'])->middleware('check.permission:update-product');


route::get('/news', [NewsController::class, 'index']);
route::get('/news/get-category-news', [NewsController::class, 'getCategoryNews']);
route::post('/news/update/{id}', [NewsController::class, 'update'])->middleware('check.permission:update-news');
route::post('/news/create', [NewsController::class, 'create'])->middleware('check.permission:create-news');
route::post('/news/destroy', [NewsController::class, 'destroy'])->middleware('check.permission:delete-news');
route::get('/news/{id}', [NewsController::class, 'getNewsById'])->middleware('check.permission:update-news');


route::get('/comment-products', [CommentProductController::class, 'index']);
route::post('/comment-products/create', [CommentProductController::class, 'create']);
route::post('/comment-products/update/{id}', [CommentProductController::class, 'update']);
route::post('/comment-products/destroy', [CommentProductController::class, 'destroy']);
route::get('/comment-products/{id}', [CommentProductController::class, 'getById']);

route::get('/comment-news', [CommentNewsController::class, 'index']);
route::post('/comment-news/search-news', [CommentNewsController::class, 'searchNews']);
route::get('/comment_news/get-allnews', [CommentNewsController::class, 'getAllNews']);
route::post('/comment-news/create', [CommentNewsController::class, 'create']);
route::post('/comment-news/update/{id}', [CommentNewsController::class, 'update']);
route::post('/comment-news/destroy', [CommentNewsController::class, 'destroy']);
route::get('/comment-news/{id}', [CommentNewsController::class, 'getById']);



Route::get('/testapi', function () {
    return json_encode(['tinnhan' => 'ok roi api hoạt động 12']);
});


// route cho người dùng  

Route::get('/vnpay/ipn',[CheckoutController::class, 'VnPay_IPN']);

Route::group(['prefix' => 'customer'],function(){
    Route::get('checklogin', function (Request $request) {
        return response()->json(['message' => 'Token hợp lệ'], 200);
    })->middleware('auth:sanctum');
    Route::get('home/getnewproducts', [HomeController::class, 'getNewProducts']);
    Route::get('home/getcategory', [HomeController::class, 'getCategory']);
    Route::get('home/get3news', [HomeController::class, 'get3News']);
    Route::get('shop/getcategory',[ShopController::class, 'getCategory']);
    Route::get('shop/getproducts',[ShopController::class, 'getProducts']);
    Route::get('shop/getvariantfilter', [ShopController::class, 'getVariantFilter']);
    Route::get('productdetail/getproductbyid/{id}',[ProductdetailController::class, 'getProductById']);
    Route::get('productdetail/getrelatedproducts/{id}',[ProductdetailController::class, 'getRelatedProducts']);
    Route::get('news/categorynews',[CustomerNewsController::class, 'getCategoryNews']);
    Route::get('news/getnews',[CustomerNewsController::class, 'getNews']);
    Route::get('newsdetail/getnewsbyid/{id}',[NewsdetailController::class, 'getNewsById']);
    Route::get('newsdetail/getnewsrelated/{id}',[NewsdetailController::class, 'getNewsRelated']);
    Route::post('profile/update-avatar', [ProfileController::class, 'updateAvatar'])->middleware('auth:sanctum');
    Route::post('profile/update-info', [ProfileController::class, 'updateInfo'])->middleware('auth:sanctum');
    Route::get('profile/get-address', [ProfileController::class, 'getAddress'])->middleware('auth:sanctum');
    Route::post('profile/add-address', [ProfileController::class, 'addAddress'])->middleware('auth:sanctum');
    Route::post('profile/delete-address/{id}', [ProfileController::class, 'deleteAddress'])->middleware('auth:sanctum');
    Route::post('profile/set-default-address/{id}', [ProfileController::class, 'setDefaultAddress'])->middleware('auth:sanctum'); 
    Route::get('profile/getorders',[ProfileController::class, 'getOrders'])->middleware('auth:sanctum');
    Route::post('profile/cancel-order/{id}',[ProfileController::class, 'CancelOrder'])->middleware('auth:sanctum');
    Route::post('profile/payment-again/{id}',[CheckoutController::class, 'PaymentAgain'])->middleware('auth:sanctum');
    Route::get('cart/checkqtyproductvariant/{id}',[CartController::class, 'checkQtyProductVariant']);
    Route::post('cart/getcart',[CartController::class, 'getCart']);
    Route::post('checkout',[CheckoutController::class, 'Store'])->middleware('auth:sanctum');


});


// testapi
