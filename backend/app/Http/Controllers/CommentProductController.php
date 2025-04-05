<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CommentProduct;
use App\Http\Requests\CommentProductRequest;
use Illuminate\Database\QueryException;

class CommentProductController extends Controller
{
    public function index (){
        $comments = CommentProduct::WithRelations()->Sort(['sort'=> 'desc'])->paginate();
        return response()->json($comments);
    }
    public function create (CommentProductRequest $request){
        $validatedData = $request->validated();
        $comment = CommentProduct::create($validatedData);
        return response()->json([
            'message' => 'Thêm bình luận thành công',
            'status' => 200,
            'data' => $comment
        ], 200);
    }
    public function update (CommentProductRequest $request, $id){
        $validatedData = $request->validated();
        $comment = CommentProduct::find($id);
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
                CommentProduct::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Xóa bình luận tin tức thành công.', 'status' => 200], 200);
            } catch (QueryException $e) {
                return response()->json(['message' => 'Xóa bình luận tin tức thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Xóa bình luận tin tức thất bại', 'status' => 'error'], 400);
        }
    }
    public function getById ($id){
        $comment = CommentProduct::find($id);
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
}
