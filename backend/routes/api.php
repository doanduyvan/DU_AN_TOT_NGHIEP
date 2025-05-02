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
use App\Http\Controllers\BannerController;
use App\Http\Controllers\NotificationController;
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
route::group(['prefix' => 'notifications'], function () {
    Route::get('order', [NotificationController::class, 'notificationOrder']);
    Route::get('product', [NotificationController::class, 'notificationProduct']);
});

route::group(['prefix' => 'vouchers'], function () {
    Route::get('/', [VoucherController::class, 'index'])->middleware('auth:sanctum');
    Route::get('/get-voucher/{id}', [VoucherController::class, 'getVoucherById'])->middleware('auth:sanctum');
    Route::post('/updatestatus', [VoucherController::class, 'updateStatus'])->middleware('check.permission:update-voucher');
    Route::post('/update/{id}', [VoucherController::class, 'update'])->middleware('check.permission:update-voucher');
    Route::post('/create', [VoucherController::class, 'create'])->middleware('check.permission:create-voucher');
    route::post('/destroy', [VoucherController::class, 'destroy'])->middleware('check.permission:delete-voucher');
});

route::group(['prefix' => 'banners'], function () {
    Route::get('/', [BannerController::class, 'index'])->middleware('auth:sanctum');
    Route::get('/get-banner/{id}', [BannerController::class, 'getBannerById'])->middleware('auth:sanctum');
    Route::post('/create', [BannerController::class, 'create'])->middleware('check.permission:create-banner');
    Route::post('/update/{id}', [BannerController::class, 'update'])->middleware('check.permission:update-banner');
    Route::post('/destroy', [BannerController::class, 'destroy'])->middleware('check.permission:delete-banner');
});

Route::get('/provinces', [LocationController::class, 'getProvinces']);
Route::get('/districts/{provinceCode}', [LocationController::class, 'getDistrictsByProvince']);
Route::get('/wards/{districtCode}', [LocationController::class, 'getWardsByDistrict']);

Route::group(['prefix' => 'statisticals'], function () {
    Route::get('product-performance', [ChartDataController::class, 'getProductPerformance']);
    Route::get('get-order-year', [ChartDataController::class, 'getOrderYear']);
    Route::get('get-order-statistics/{year}', [ChartDataController::class, 'getOrderStatistics']);
});

Route::group(['prefix' => 'orders'], function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::get('get-product-variant', [OrderController::class, 'getProductVariant']);
    Route::get('get-order-count', [OrderController::class, 'getOrderCount']);
    Route::get('category-products', [OrderController::class, 'getCategoryProducts']);
    Route::post('update/{id}', [OrderController::class, 'update'])->middleware('check.permission:update-order');
    route::post('search-variant-product', [ProductsController::class, 'searchVariantProduct'])->middleware('check.permission:update-order,create-order');
    Route::post('destroy', [OrderController::class, 'destroy'])->middleware('check.permission:delete-order');
    Route::post('create', [OrderController::class, 'create'])->middleware('check.permission:create-order');
    Route::post('create-user', [OrderController::class, 'createUser'])->middleware('check.permission:create-order');
    Route::post('update-order-status/{id}', [OrderController::class, 'updateOrderStatus'])->middleware('check.permission:update-order');
    Route::post('update-payment-status/{id}', [OrderController::class, 'updatePaymentStatus'])->middleware('check.permission:update-order');
    Route::post('update-shipping-status/{id}', [OrderController::class, 'updateShippingStatus'])->middleware('check.permission:update-order');
    Route::post('update-order-detail', [OrderController::class, 'updateOrderDetail'])->middleware('check.permission:update-order');
    Route::post('destroy-order-detail/{id}', [OrderController::class, 'deleteOrderDetail'])->middleware('check.permission:update-order');
    Route::post('update-quantities', [OrderController::class, 'updateQuantities'])->middleware('check.permission:update-order');
    Route::get('getbyid/{id}', [OrderController::class, 'getOrderById'])->middleware('check.permission:update-order');
    route::post('search-by-phone', [OrderController::class, 'searchByPhone'])->middleware('check.permission:update-order');
    route::get('trash', [TrashedOrderController::class, 'index'])->middleware('check.permission:delete-order');
    route::get('trash/{id}', [TrashedOrderController::class, 'getOrderTrashById'])->middleware('check.permission:delete-order');
    route::post('restore', [TrashedOrderController::class, 'restore'])->middleware('check.permission:delete-order');
    route::delete('force-delete/{id}', [TrashedOrderController::class, 'forceDelete'])->middleware('check.permission:delete-order');

    Route::get('getorderlimit', [OrderController::class, 'getOrderLimit']);
});

Route::resource('roles', RoleController::class)->except(['create', 'show', 'destroy', 'update']);
Route::group(['prefix' => 'roles'], function () {
    Route::get('permissions', [RoleController::class, 'showPermissions']);
    Route::post('create', [RoleController::class, 'create'])->middleware('check.permission:create-role');
    Route::get('showrole/{id}', [RoleController::class, 'show'])->middleware('check.permission:update-role');
    Route::post('update/{id}', [RoleController::class, 'update'])->middleware('check.permission:update-role');
    Route::post('destroy', [RoleController::class, 'destroy'])->middleware('check.permission:delete-role');
    route::get('trash', [TrashedRoleController::class, 'index'])->middleware('check.permission:delete-role');
    route::post('restore', [TrashedRoleController::class, 'restore'])->middleware('check.permission:delete-role');
    route::delete('force-delete/{id}', [TrashedRoleController::class, 'forceDelete'])->middleware('check.permission:delete-role');
});


Route::group(['prefix' => 'permissions'], function () {
    Route::get('/', [PermissionController::class, 'index']);
    Route::post('create', [PermissionController::class, 'create'])->middleware('check.permission:create-permission');
    Route::get('show/{id}', [PermissionController::class, 'show'])->middleware('check.permission:update-permission');
    Route::post('update/{id}', [PermissionController::class, 'update'])->middleware('check.permission:update-permission');
    Route::post('destroy', [PermissionController::class, 'destroy'])->middleware('check.permission:update-permission');
    route::get('trash', [TrashedPermissionController::class, 'index'])->middleware('check.permission:delete-permission');
    route::post('restore', [TrashedPermissionController::class, 'restore'])->middleware('check.permission:delete-permission');
    route::delete('force-delete/{id}', [TrashedPermissionController::class, 'forceDelete'])->middleware('check.permission:delete-permission');
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login-google', [AuthController::class, 'loginGoogle']);
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
});

Route::group(['prefix' => 'users'], function () {
    route::get('/', [UserController::class, 'index']);
    route::post('/create', [UserController::class, 'create'])->middleware('check.permission:create-customer');
    route::get('get-user-count', [UserController::class, 'getUserCount']);
    route::post('destroy', [UserController::class, 'destroy'])->middleware('check.permission:delete-customer');
    Route::post('updatestatus', [UserController::class, 'updateStatus'])->middleware('check.permission:update-customer');
    Route::post('rolelevel/{id}', [UserController::class, 'roleLevel'])->middleware('check.permission:update-customer');
    Route::post('update/{id}', [UserController::class, 'updateUser'])->middleware('check.permission:update-customer');
    Route::get('showroles', [UserController::class, 'showRoles'])->middleware('check.permission:update-customer');
    route::get('/getbyid/{id}', [UserController::class, 'getUserById'])->middleware('check.permission:update-customer');
    route::get('trash', [TrashedUserController::class, 'index'])->middleware('check.permission:delete-customer');
    route::post('restore', [TrashedUserController::class, 'restore'])->middleware('check.permission:delete-customer');
    route::delete('force-delete/{id}', [TrashedUserController::class, 'forceDelete'])->middleware('check.permission:delete-customer');

    Route::get('getuserlimit', [UserController::class, 'getUserLimit']);
});

Route::group(['prefix' => 'categories'], function () {
    route::post('create', [CategoriesController::class, 'create'])->middleware('check.permission:create-category');
    route::post('destroy', [CategoriesController::class, 'destroy'])->middleware('check.permission:delete-category');
    route::post('update/{id}', [CategoriesController::class, 'update'])->middleware('check.permission:update-category');
    route::get('/', [CategoriesController::class, 'index']);
    route::get('getbyid/{id}', [CategoriesController::class, 'getCategoyById'])->middleware('check.permission:update-category');
    route::get('trash', [TrashedCategoryController::class, 'index'])->middleware('check.permission:delete-category');
    route::post('restore', [TrashedCategoryController::class, 'restore'])->middleware('check.permission:delete-category');
    route::delete('force-delete/{id}', [TrashedCategoryController::class, 'forceDelete'])->middleware('check.permission:delete-category');
});


Route::group(['prefix' => 'categorynews'], function () {
    route::get('/', [CategoryNewsController::class, 'index']);
    route::get('getbyid/{id}', [CategoryNewsController::class, 'getCategoyById'])->middleware('check.permission:update-category-news');
    route::post('create', [CategoryNewsController::class, 'create'])->middleware('check.permission:create-category-news');
    route::post('destroy', [CategoryNewsController::class, 'destroy'])->middleware('check.permission:delete-category-news');
    route::post('update/{id}', [CategoryNewsController::class, 'update'])->middleware('check.permission:update-category-news');
    route::get('trash', [TrashedCategoryNewsController::class, 'index'])->middleware('check.permission:delete-category-news');
    route::post('restore', [TrashedCategoryNewsController::class, 'restore'])->middleware('check.permission:delete-category-news');
    route::delete('force-delete/{id}', [TrashedCategoryNewsController::class, 'forceDelete'])->middleware('check.permission:delete-category-news');
});

Route::group(['prefix' => 'products'], function () {
    route::get('/', [ProductsController::class, 'index']);
    route::get('get-product-count', [ProductsController::class, 'getProductCount']);
    route::get('getcategories', [ProductsController::class, 'getAllCategories']);
    route::post('update/{id}', [ProductsController::class, 'update'])->middleware('check.permission:update-product');
    route::post('create', [ProductsController::class, 'create'])->middleware('check.permission:create-product');
    route::post('destroy', [ProductsController::class, 'destroy'])->middleware('check.permission:delete-product');
    route::get('/getbyid/{id}', [ProductsController::class, 'getProductById'])->middleware('check.permission:update-product');
    route::get('trash', [TrashedProductController::class, 'index'])->middleware('check.permission:delete-product');
    route::post('restore', [TrashedProductController::class, 'restore'])->middleware('check.permission:delete-product');
    route::delete('force-delete/{id}', [TrashedProductController::class, 'forceDelete'])->middleware('check.permission:delete-product');
});

route::group(['prefix' => 'news'], function () {
    route::get('/', [NewsController::class, 'index']);
    route::get('get-category-news', [NewsController::class, 'getCategoryNews']);
    route::post('update/{id}', [NewsController::class, 'update'])->middleware('check.permission:update-news');
    route::post('create', [NewsController::class, 'create'])->middleware('check.permission:create-news');
    route::post('destroy', [NewsController::class, 'destroy'])->middleware('check.permission:delete-news');
    route::get('getbyid/{id}', [NewsController::class, 'getNewsById'])->middleware('check.permission:update-news');
    route::get('trash', [TrashedNewsController::class, 'index'])->middleware('check.permission:delete-news');
    route::post('restore', [TrashedNewsController::class, 'restore'])->middleware('check.permission:delete-news');
    route::delete('force-delete/{id}', [TrashedNewsController::class, 'forceDelete'])->middleware('check.permission:delete-news');
});

Route::group(['prefix' => 'comment-products'], function () {
    route::get('/', [CommentProductController::class, 'index'])->middleware('check.permission:view-comment-product');
    route::post('destroy', [CommentProductController::class, 'destroy'])->middleware('check.permission:delete-comment-product');
});

route::group(['prefix' => 'comment-news'], function () {
    route::get('/', [CommentNewsController::class, 'index'])->middleware('check.permission:view-comment-news');
    route::post('destroy', [CommentNewsController::class, 'destroy'])->middleware('check.permission:delete-comment-news');
});


Route::get('/testapi', function () {
    return json_encode(['tinnhan' => 'ok roi api hoạt động 12']);
});


// route cho người dùng  

Route::get('/vnpay/ipn', [CheckoutController::class, 'VnPay_IPN']);

Route::group(['prefix' => 'customer'], function () {
    Route::get('checklogin', function (Request $request) {
        return response()->json(['message' => 'Token hợp lệ'], 200);
    })->middleware('auth:sanctum');
    Route::get('home/getnewproducts', [HomeController::class, 'getNewProducts']);
    Route::get('home/getbestsellingproducts', [HomeController::class, 'getBestSellingProducts']);
    Route::get('home/getcategory', [HomeController::class, 'getCategory']);
    Route::get('home/get3news', [HomeController::class, 'get3News']);
    Route::get('home/getbanner', [HomeController::class, 'getBanner']);
    Route::get('shop/getcategory', [ShopController::class, 'getCategory']);
    Route::get('shop/getproducts', [ShopController::class, 'getProducts']);
    Route::get('shop/getvariantfilter', [ShopController::class, 'getVariantFilter']);
    Route::get('productdetail/getproductbyid/{id}',[ProductdetailController::class, 'getProductById']);
    Route::get('productdetail/getrelatedproducts/{id}',[ProductdetailController::class, 'getRelatedProducts']);
    Route::post('productdetail/add-comment',[ProductdetailController::class, 'Comment'])->middleware('auth:sanctum');
    Route::get('productdetail/get-comment/{id}',[ProductdetailController::class, 'getComment']);
    Route::post('productdetail/delete-comment/{id}',[ProductdetailController::class, 'deleteComment'])->middleware('auth:sanctum');
    Route::get('news/categorynews',[CustomerNewsController::class, 'getCategoryNews']);
    Route::get('news/getnews',[CustomerNewsController::class, 'getNews']);
    Route::get('newsdetail/getnewsbyid/{id}',[NewsdetailController::class, 'getNewsById']);
    Route::get('newsdetail/getnewsrelated/{id}',[NewsdetailController::class, 'getNewsRelated']);
    Route::post('newsdetail/add-comment',[NewsdetailController::class, 'Comment'])->middleware('auth:sanctum');
    Route::get('newsdetail/get-comment/{id}',[NewsdetailController::class, 'getComment']);
    Route::post('newsdetail/delete-comment/{id}',[NewsdetailController::class, 'deleteComment'])->middleware('auth:sanctum');
    Route::get('productdetail/getproductbyid/{id}', [ProductdetailController::class, 'getProductById']);
    Route::get('productdetail/getrelatedproducts/{id}', [ProductdetailController::class, 'getRelatedProducts']);
    Route::post('profile/update-avatar', [ProfileController::class, 'updateAvatar'])->middleware('auth:sanctum');
    Route::post('profile/update-info', [ProfileController::class, 'updateInfo'])->middleware('auth:sanctum');
    Route::get('profile/get-address', [ProfileController::class, 'getAddress'])->middleware('auth:sanctum');
    Route::post('profile/add-address', [ProfileController::class, 'addAddress'])->middleware('auth:sanctum');
    Route::post('profile/delete-address/{id}', [ProfileController::class, 'deleteAddress'])->middleware('auth:sanctum');
    Route::post('profile/set-default-address/{id}', [ProfileController::class, 'setDefaultAddress'])->middleware('auth:sanctum');
    Route::get('profile/getorders', [ProfileController::class, 'getOrders'])->middleware('auth:sanctum');
    Route::post('profile/cancel-order/{id}', [ProfileController::class, 'CancelOrder'])->middleware('auth:sanctum');
    Route::post('profile/payment-again/{id}', [CheckoutController::class, 'PaymentAgain'])->middleware('auth:sanctum');
    Route::get('cart/checkqtyproductvariant/{id}', [CartController::class, 'checkQtyProductVariant']);
    Route::post('cart/getcart',[CartController::class, 'getCart']);
    Route::post('checkout', [CheckoutController::class, 'Store'])->middleware('auth:sanctum');
    Route::post('profile/set-default-address/{id}', [ProfileController::class, 'setDefaultAddress'])->middleware('auth:sanctum'); 
    Route::get('profile/getorders',[ProfileController::class, 'getOrders'])->middleware('auth:sanctum');
    Route::post('profile/cancel-order/{id}',[ProfileController::class, 'CancelOrder'])->middleware('auth:sanctum');
    Route::post('profile/payment-again/{id}',[CheckoutController::class, 'PaymentAgain'])->middleware('auth:sanctum');
    Route::post('profile/change-password',[ProfileController::class, 'ChangePassword'])->middleware('auth:sanctum');
    Route::get('cart/checkqtyproductvariant/{id}',[CartController::class, 'checkQtyProductVariant']);
    // Route::post('cart/getcart',[CartController::class, 'getCart']);
    Route::post('checkout',[CheckoutController::class, 'Store'])->middleware('auth:sanctum');
    Route::get('checkout/get-voucher',[CheckoutController::class, 'getVoucher'])->middleware('auth:sanctum');
    Route::get('checkout/check-voucher',[CheckoutController::class, 'checkVoucher'])->middleware('auth:sanctum');
    Route::get('shop/searchsuggest',[ShopController::class, 'searchSuggest']);

});


// testapi
