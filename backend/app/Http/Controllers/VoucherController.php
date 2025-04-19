<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Voucher;
use App\Http\Requests\VoucherRequest;
class VoucherController extends Controller
{
    public function index()
    {
        $filters = request()->only(['per_page', 'sortorder', 'keyword']);
        $vouchers = Voucher::search($filters['keyword'])->applyFilters($filters);
        return response()->json($vouchers);
    }
    public function create(VoucherRequest $request){
        $user = auth()->user();
        $validatedData = $request->validated();
        $validatedData['user_id'] = $user->id;
        $voucher = Voucher::create($validatedData);
        return response()->json([
            'voucher' => $voucher,
            'status' => 201,
        ], 201);
    }
    public function updateStatus(request $request)
    {
        $validatedData = $request->validate([
            'status' => 'required',
        ]);
        $id = $request->id;
        $posts = Voucher::where('id', $id);
        $data = $validatedData['status'];
        $posts->update(['status' => $data]);
        return response()->json(['message' => 'Cập nhật trạng thái thành công', 'status' => 200], 200);
    }
}
