<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Voucher;
use App\Http\Requests\VoucherRequest;
use Illuminate\Database\QueryException;

class VoucherController extends Controller
{
    public function index()
    {
        $filters = request()->only(['per_page', 'sortorder', 'keyword']);
        $vouchers = Voucher::search($filters['keyword'])->applyFilters($filters);
        $vouchers->load('user');
        $vouchers->getCollection()->transform(function ($voucher) {
            $voucher->user_name = $voucher->user ? $voucher->user->fullname : null;
            return $voucher;
        });
        return response()->json($vouchers);
    }

    public function getVoucherById($id){
        $voucher = Voucher::find($id);
        if ($voucher) {
            return response()->json($voucher, 200);
        } else {
            return response()->json(['message' => 'Vocher không tồn tại'], 404);
        }
    }
    public function create(VoucherRequest $request)
    {
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

    public function update(VoucherRequest $request, $id)
    {
        $validatedData = $request->validated();
    
        try {
            $voucher = Voucher::findOrFail($id);
            $voucher->update($validatedData);
            return response()->json([
                'message' => 'Cập nhật voucher thành công',
                'status' => 200,
                'voucher' => $voucher,
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Cập nhật voucher thất bại. Vui lòng thử lại sau.',
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            // Xử lý các lỗi khác
            return response()->json([
                'message' => 'Đã xảy ra lỗi không xác định.',
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        $ids = $request->ids;
        if (is_array($ids) && !empty($ids)) {
            try {
                Voucher::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Xóa voucher thành công', 'status' => 200], 200);
            } catch (QueryException $e) {
                return response()->json(['message' => 'Xóa voucher thất bại: ' . $e->getMessage(), 'status' => 'error'], 500);
            }
        } else {
            return response()->json(['message' => 'Xóa voucher thất bại', 'status' => 'error'], 400);
        }
    }
}
