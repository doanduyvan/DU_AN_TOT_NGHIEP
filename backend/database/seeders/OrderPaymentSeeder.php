<?php

namespace Database\Seeders;

use App\Models\OrderPayment;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use App\Models\Order;
use App\Models\News;
class OrderPaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $payments = [
            [
                'transaction_no' => 'TRX001',
                'bank_code' => 'VCB',
                'amount' => 1500000,
                'status' => '2',
                'method' => 'bank_transfer',
                'pay_date' => Carbon::now()->subDays(0),
                'order_id' => Order::inRandomOrder()->first()->id,    
            ],
            [
                'transaction_no' => 'TRX002',
                'bank_code' => 'TCB',
                'amount' => 2500000,
                'status' => '1',
                'method' => 'credit_card',
                'pay_date' => Carbon::now()->subDays(1),
                'order_id' => Order::inRandomOrder()->first()->id,    

            ],
            [
                'transaction_no' => 'TRX003',
                'bank_code' => 'VIB',
                'amount' => 1800000,
                'status' => '1',
                'method' => 'bank_transfer',
                'pay_date' => Carbon::now()->subDays(0),
                'order_id' => Order::inRandomOrder()->first()->id,    

            ],
            [
                'transaction_no' => 'TRX004',
                'bank_code' => 'BIDV',
                'amount' => 3200000,
                'status' => '2',
                'method' => 'momo',
                'pay_date' => Carbon::now()->subDays(3),
                'order_id' => Order::inRandomOrder()->first()->id,    

            ],
            [
                'transaction_no' => 'TRX005',
                'bank_code' => 'ACB',
                'amount' => 2100000,
                'status' => '3',
                'method' => 'bank_transfer',
                'pay_date' => Carbon::now()->subDays(1),
                'order_id' => Order::inRandomOrder()->first()->id,    

            ],
        ];

        foreach ($payments as $payment) {
            OrderPayment::create($payment);
        }
    }
}