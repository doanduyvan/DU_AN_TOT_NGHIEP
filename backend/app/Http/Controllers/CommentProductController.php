<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CommentProduct;
use App\Http\Requests\CommentProductRequest;

class CommentProductController extends Controller
{
    public function index (){
        $comments = CommentProduct::WithRelations()->Sort(['sort'=> 'desc'])->paginate(5);
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
}
