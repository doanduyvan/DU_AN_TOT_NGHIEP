<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CommentNews;
use App\Http\Requests\CommentNewsRequest;
use Illuminate\Database\QueryException;
use App\Models\News;

class CommentNewsController extends Controller
{

    public function index()
    {
        $filters = request()->only(['per_page', 'sortorder', 'keyword']);
        $categories = CommentNews::search($filters['keyword'] ?? null)
        ->withRelations()
        ->applyFilters($filters);
        return response()->json($categories);
    }
    public function create(CommentNewsRequest $request)
    {
        $validatedData = $request->validated();
        $comment = CommentNews::create($validatedData);
        return response()->json([
            'message' => 'Thêm bình luận thành công',
            'status' => 200,
            'data' => $comment
        ], 200);
    }
    public function update(CommentNewsRequest $request, $id)
    {
        $validatedData = $request->validated();
        $comment = CommentNews::find($id);
        if (!$comment) {
            return response()->json([
                'message' => 'Bình luận không tồn tại',
                'status' => 404,
            ], 404);
        }
        $comment->update($validatedData);
        return response()->json([
            'message' => 'Câp nhật bình luận thành công',
            'status' => 200,
            'data' => $comment
        ], 200);
    }
    public function destroy(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                CommentNews::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Xóa bình luận tin tức thành công.', 'status' => 200], 200);
            } catch (QueryException $e) {
                return response()->json(['message' => 'Xóa bình luận tin tức thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Xóa bình luận tin tức thất bại', 'status' => 'error'], 400);
        }
    }
    public function getById($id)
    {
        $comment = CommentNews::find($id);
        if (!$comment) {
            return response()->json([
                'message' => 'Bình luận không tồn tại',
                'status' => 404,
            ], 404);
        }
        return response()->json([
            'message' => 'Lấy bình luận thành công',
            'status' => 200,
            'data' => $comment
        ], 200);
    }

    public function getAllNews(){
        $news = News::orderBy('created_at', 'desc')->get();
        return response()->json($news, 200);
    }

    public function searchNews(Request $request)
    {
        $query = $request->input('search_news');
        $news = News::where('title', 'like', '%' . $query . '%')->get();
        return response()->json($news);
    }
}
