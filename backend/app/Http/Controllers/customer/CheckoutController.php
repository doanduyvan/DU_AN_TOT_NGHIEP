<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\OrderPayment;
use App\Models\ProductVariant;
use App\Models\Voucher;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    //
    public function Store(Request $request)
    {
        $user = $request->user();
        DB::beginTransaction();

        try {
            $cartValidated = [];
            $total = 0;

            $shipping_address = $request['address']['address'];

            if (empty($shipping_address)) {
                throw new \Exception("Địa chỉ giao hàng không được để trống");
            }

            if (empty($request['cartItems'])) {
                throw new \Exception("Giỏ hàng không được để trống");
            }

            foreach ($request['cartItems'] as $item) {
                $variant = ProductVariant::with('product')
                    ->where('id', $item['variant_id'])
                    ->where('stock_quantity', '>=', $item['qty'])
                    ->first();

                if (!$variant || !$variant->product || $variant->product->status != 1) {
                    throw new \Exception("Sản phẩm không hợp lệ hoặc đã hết hàng");
                }

                $price = $variant->promotional_price ?? $variant->price;
                $subtotal = $price * $item['qty'];
                $total += $subtotal;

                $cartValidated[] = [
                    'variant_id' => $variant->id,
                    'price'      => $price,
                    'qty'        => $item['qty'],
                ];
            }

            // Kiểm tra và áp dụng voucher
            $discount = 0;
            if ($request->filled('voucher_code')) {
                $voucher = Voucher::where('code', $request['voucher_code'])->first();

                if (!$voucher || !$voucher->isValid()) {
                    throw new \Exception("Voucher không hợp lệ hoặc đã hết hạn");
                }

                $discount = $voucher->getDiscountAmount($total);
                $total = round(max(0, $total - $discount));
                $voucher->incrementUsage();
            }

            if($total <= 0) {
                $payment_status = 2;
            }else{
                $payment_status = $request['payment_method'] === 'cod' ? 3 : 1;
            }

            // Tạo đơn hàng
            $order = Order::create([
                'order_date'       => now(),
                'total_amount'     => $total,
                'payment_method'   => $request['payment_method'],
                'shipping_address' => $shipping_address,
                'user_id'          => $user->id,
                'fullname'         => $request['address']['name'],
                'phone'            => $request['address']['phone'],
                'payment_status'   => $payment_status,
                'shipping_status'  => 1,
                'status'           => 1,
                'note'            => $request['note'] ?? null,
            ]);

            // Tạo chi tiết đơn hàng
            foreach ($cartValidated as $item) {
                OrderDetail::create([
                    'order_id'           => $order->id,
                    'product_variant_id' => $item['variant_id'],
                    'price'              => $item['price'],
                    'quantity'           => $item['qty'],
                ]);

                // Trừ tồn kho
                $variant = ProductVariant::find($item['variant_id']);
                $variant->decrement('stock_quantity', $item['qty']);
                $variant->increment('sold_quantity', $item['qty']);
            }

            

            DB::commit();


            $dataRes = [];

            // Xử lý thanh toán VNPAY
            if ($request['payment_method'] === 'vnpay') {
                if ($total <= 0) {
                    $dataRes['payment_method'] = 'cod';
                    $dataRes['payment_url'] = null;
                }else{
                    $paymentUrl = $this->VnPay_Payment_Create($order);
                    $dataRes['payment_method'] = 'vnpay';
                    $dataRes['payment_url'] = $paymentUrl;
                }
            }else{
                $dataRes['payment_method'] = 'cod';
                $dataRes['payment_url'] = null;
            }
            return response()->json($dataRes, 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function PaymentAgain(Request $request, $orderid)
    {
        $user = $request->user();
        $order = Order::where('id', $orderid)
            ->where('user_id', $user->id)
            ->first();
        if (!$order) {
            return response()->json(['message' => 'Đơn hàng không tồn tại.'], 404);
        }
        
        $dataRes = [];
        $paymentUrl = $this->VnPay_Payment_Create($order);
        $dataRes['payment_method'] = 'vnpay';
        $dataRes['payment_url'] = $paymentUrl;
        return response()->json($dataRes, 200);
    }



    private function VnPay_Payment_Create($order)
    {
        $vnp_TmnCode = env('VNPAY_TMN_CODE');
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');
        $vnp_Url = env('VNPAY_URL');
        $vnp_Returnurl = env('VNPAY_RETURN_URL');

        $vnp_TxnRef = $order->id;
        $vnp_OrderInfo = 'Thanh toan don hang MesSkin #' . $order->id;
        $vnp_OrderType = 'billpayment';
        $vnp_Amount = round($order->total_amount) * 100;
        $vnp_Locale = 'vn';
        $vnp_IpAddr = request()->header('X-Forwarded-For') ?? request()->ip();
        $vnp_ExpireDate = now()->addMinutes(15)->format('YmdHis');


        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => now()->format('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
            "vnp_ExpireDate" => $vnp_ExpireDate,
        ];

        ksort($inputData);
        $query = '';
        $hashdata = '';
        $i = 0;
        foreach ($inputData as $key => $value) {
            $hashdata .= ($i ? '&' : '') . urlencode($key) . "=" . urlencode($value);
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
            $i++;
        }
        $vnp_SecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
        $paymentUrl = $vnp_Url . "?" . $query . 'vnp_SecureHash=' . $vnp_SecureHash;

        return $paymentUrl;
    }

    public function VnPay_IPN(Request $request)
    {
        $inputData = [];
        foreach ($request->all() as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }
    
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');
        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';
        unset($inputData['vnp_SecureHash']);
    
        ksort($inputData);
        $hashData = urldecode(http_build_query($inputData));
        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
    
        $orderId = $request->input('vnp_TxnRef');
        $amount  = $request->input('vnp_Amount') / 100;

        if ($secureHash !== $vnp_SecureHash) {
            return response()->json([
                'RspCode' => '97',
                'Message' => 'Invalid signature'
            ]);
        }


        $orderId = (int)$orderId;
        $order = Order::find($orderId);
    
        if (!$order) {
            return response()->json([
                'RspCode' => '01',
                'Message' => 'Order not found'
            ]);
        }
    
        $isSuccess = $inputData['vnp_TransactionStatus'] === '00';
        $order->payment_status = $isSuccess ? 2 : 1;
        $order->save();

        $payDate = Carbon::createFromFormat('YmdHis', $inputData['vnp_PayDate']);

        $paymentData = [
            'order_id'       => $order->id,
            'transaction_no' => $inputData['vnp_TransactionNo'],
            'bank_code'      => $inputData['vnp_BankCode'],
            'amount'         => $amount,
            'status'         => $isSuccess ? 1 : 0,
            'method'         => 'vnpay',
            'pay_date'       => $payDate,
        ];

        OrderPayment::create($paymentData);

        return response()->json([
            'RspCode' => '00',
            'Message' => $isSuccess ? 'Confirm Success' : 'Payment Failed',
        ]);
    }

    public function getVoucher()
    {
        $vouchers = Voucher::where('status', 1)
            ->where('expiry_date', '>=', Carbon::now())
            ->whereRaw('quantity > quantity_used')
            ->get();

        return response()->json([
            'vouchers' => $vouchers
        ]);
    }

    public function checkVoucher(Request $request)
    {
        $voucherCode = $request->input('voucher_code');
        $total = $request->input('total');

        if (empty($voucherCode)) {
            return response()->json(['message' => 'Vui lòng nhập mã khuyến mãi'], 400);
        }

        $voucher = Voucher::where('code', $voucherCode)->first();

        if (!$voucher) {
            return response()->json(['message' => 'Mã giảm giá không tồn tại'], 400);
        }

        if (!$voucher->isValid()) {
            return response()->json(['message' => 'Mã giảm giá đã hết hạn'], 400);
        }

        info('total_request: ' . $total);

        $discount = $voucher->getDiscountAmount($total);
        $totalDiscount = round(max(0, $total - $discount));

        return response()->json([
            'message' => 'Mã giảm giá hợp lệ',
            'voucher' => $voucher,
            'total_discount' => $totalDiscount,
            'discount' => $discount,
        ]);
    }
}
