<?php

namespace App\Http\Controllers\customer;

use App\Http\Controllers\Controller;
use App\Models\CommentNews;
use App\Models\News;
use Illuminate\Http\Request;

class NewsdetailController extends Controller
{
    function getNewsById($id){
        $news = News::find($id);
        if ($news) {
            return response()->json([
                'message' => 'News found',
                'data' => $news
            ],200);
        } else {
            return response()->json([
                'message' => 'News not found'
            ], 404);
        }
    }

    function getNewsRelated($id){
        $news = News::findOrFail($id);
        $select = ['id', 'title', 'avatar', 'created_at'];
        // Lấy bài viết cùng danh mục
        $related = News::where('category_news_id', $news->category_news_id)
            ->where('id', '!=', $id)
            ->whereNull('deleted_at')
            ->select($select)
            ->limit(10)
            ->get();
        return response()->json([
            'related' => $related
        ]);
    }

    public function getComment(Request $request, $id)
    {
        $perPage = $request->input('per_page', 10);
        $user = $request->user();
    
        $comments = CommentNews::with([
            'user:id,avatar,fullname',
            'replies.user:id,avatar,fullname'
        ])
        ->where('news_id', $id)
        ->whereNull('comment_news_id')
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

    public function Comment(Request $request)
    {
        $productId = $request->input('news_id');
        $comment = $request->input('comment');
        $commentId = $request->input('comment_news_id', null);

        $message = [
            'comment.required' => 'Vui lòng nhập bình luận',
            'comment.string' => 'Bình luận không hợp lệ',
            'comment.max' => 'Bình luận vượt quá độ dài cho phép',
        ];
        $request->validate([
            'comment' => 'required|string|max:1000',
        ], $message);

        $user = $request->user();
        $isAdmin = $user->getAllPermissions()->isNotEmpty();

        $newComment = CommentNews::create([
            'user_id'            => $user->id,
            'news_id'         => $productId,
            'content'            => $comment,
            'is_admin'           => $isAdmin,
            'comment_news_id' => $commentId,
        ]);
        $newComment->load(['user:id,fullname,avatar']);

        return response()->json([
            'message' => 'Bình luận thành công',
            'data' => $newComment
        ], 201);
    }

    public function deleteComment(Request $request, $id)
    {
        $user = $request->user();
        $comment = CommentNews::findOrFail($id);
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
