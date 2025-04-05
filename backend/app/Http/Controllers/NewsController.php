<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\NewsRequest;
use App\Models\News;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;
class NewsController extends Controller
{
    public function index()
    {
        $news = News::orderBy('id', 'desc')->get();
        return response()->json($news);
    }

    public function getNewsById($id)
    {
        $news = News::where('id', $id)->first();
        return response()->json([
            'news' => $news,
        ]);
    }

    public function create(NewsRequest $request)
    {
        try {
            $path = $request->file('avatar')->storePublicly('uploads/news', 'public');
            $validateData = $request->validated();
            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'message' => 'Người dùng chưa đăng nhập',
                    'status' => 'error'
                ], 401);
            }
            $validateData['user_id'] = $user->id;
            $validateData['avatar'] = $path;
            $News = News::create($validateData);

            return response()->json([
                'message' => 'Thêm tin tức thành công',
                'status' => 200,
                'news' => $News,
                'image_url' => asset('storage/' . $path)
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Thêm tin tức thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                News::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Xóa tin tức thành công', 'status' => 200], 200);
            } catch (QueryException $e) {
                if ($e->getCode() == '23000') {
                    return response()->json(['message' => 'Không thể xóa tin tức vì có dữ liệu liên quan', 'status' => 'error'], 400);
                }
                return response()->json(['message' => 'Xóa tin tức thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Xóa tin tức thất bại', 'status' => 'error'], 400);
        }
    }

    public function update(NewsRequest $request, $id)
    {
        try {
            $news = News::findOrFail($id);
            $validateData = $request->validated();
            if ($request->hasFile('avatar')) {
                if ($news->avatar) {
                    Storage::disk('public')->delete($news->avatar);
                }

                $path = $request->file('avatar')->storePublicly('uploads/news', 'public');
                $validateData['avatar'] = $path;
            }
            $news->update($validateData);
            return response()->json([
                'message' => 'Cập nhật tin tức thành công',
                'status' => 200,
                'news' => $news,
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Cập nhật tin tức thất bại: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }



}
