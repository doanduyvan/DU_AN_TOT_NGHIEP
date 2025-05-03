<?php

namespace App\Http\Controllers\customer;

use App\Http\Controllers\Controller;
use App\Models\CommentProduct;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductdetailController extends Controller
{
    function getProductById($id)
    {
        $product = Product::with(['variants','images'])
        ->where('id', $id)
        ->whereNull('deleted_at')
        ->where('status', 1)
        ->first();

        return response()->json([
            'product' => $product
        ]);
    }

    function getRelatedProducts($id){
        $product = Product::findOrFail($id);

        $productSelect = ['id', 'avatar', 'product_name', 'rating_avg','total_reviews'];

        $related = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $id) 
            ->where('status', 1)
            ->whereNull('deleted_at')
            ->with(['variants' => function ($query) {
                $variantSelect = ['id', 'product_id', 'size', 'price', 'promotional_price','sold_quantity'];
                $query->select($variantSelect);
            }])
            ->select($productSelect)
            ->limit(10)
            ->get();
    
        return response()->json([
            'related' => $related
        ]);
    }

    public function Comment(Request $request)
    {
        $productId = $request->input('product_id');
        $comment = $request->input('comment');
        $rating = $request->input('rating', 5);
        $commentId = $request->input('comment_product_id', null);

        $message = [
            'comment.required' => 'Vui lòng nhập bình luận',
            'comment.string' => 'Bình luận không hợp lệ',
            'comment.max' => 'Bình luận vượt quá độ dài cho phép',
            'rating.integer' => 'Đánh giá không hợp lệ',
            'rating.min' => 'Đánh giá không hợp lệ',
            'rating.max' => 'Đánh giá không hợp lệ',
        ];
        // Validate the input
        $request->validate([
            'comment' => 'required|string|max:1000',
            'rating' => 'nullable|integer|min:1|max:5',
        ], $message);

        $user = $request->user();
        $isAdmin = $user->getAllPermissions()->isNotEmpty();
        $isBought = $user->hasPurchasedProduct($productId);
        if($commentId !== null){
            $rating = null;
        }

        if(!$isAdmin && $commentId === null){
            if (!$isBought) {
                return response()->json([
                    'message' => 'Bạn chưa mua sản phẩm này, không thể đánh giá'
                ], 403);
            }
        }

        $newComment = CommentProduct::create([
            'user_id'            => $user->id,
            'product_id'         => $productId,
            'content'            => $comment,
            'rating'             => $rating,
            'is_verified_buyer'  => $isBought,
            'is_admin'           => $isAdmin,
            'comment_product_id' => $commentId,
        ]);
        $newComment->load(['user:id,fullname,avatar']);

        return response()->json([
            'message' => 'Bình luận thành công',
            'data' => $newComment
        ], 201);
    }

    public function getComment(Request $request, $id)
    {
        $perPage = $request->input('per_page', 10);
        $user = $request->user();
    
        $comments = CommentProduct::with([
            'user:id,avatar,fullname',
            'replies.user:id,avatar,fullname'
        ])
        ->where('product_id', $id)
        ->whereNull('comment_product_id')
        ->orderBy('created_at', 'desc')
        ->paginate($perPage);

        $comments->getCollection()->transform(function ($comment) use ($user) {
            $comment->is_mycomment = $user && $user->id === $comment->user_id;
    
            $comment->replies->transform(function ($reply) use ($user) {
                $reply->is_mycomment = $user && $user->id === $reply->user_id;
                return $reply;
            });
    
            return $comment;
        });
    
        return response()->json([
            'comments' => $comments
        ]);
    }

    public function deleteComment(Request $request, $id)
    {
        $user = $request->user();
        $comment = CommentProduct::findOrFail($id);
        if ($comment->user_id !== $user->id) {
            return response()->json([
                'message' => 'Bạn không có quyền xóa bình luận này'
            ], 403);
        }
        $comment->delete();

        return response()->json([
            'message' => 'Xóa bình luận thành công'
        ]);
    }
}
