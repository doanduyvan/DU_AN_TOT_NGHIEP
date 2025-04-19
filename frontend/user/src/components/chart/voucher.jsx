import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Đăng ký các phần tử của Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const VouchersChart = () => {
    // Dữ liệu mẫu từ cơ sở dữ liệu (có thể lấy từ API)
    const [voucherData, setVoucherData] = useState({
        vouchers: [],
        usedQuantity: [],
        totalQuantity: [],
    });

    useEffect(() => {
        // Giả sử bạn gọi API hoặc lấy dữ liệu từ cơ sở dữ liệu
        const fetchData = () => {
            const vouchers = ['DISCOUNT10', 'SUMMER20', 'NEWYEAR25', 'BLACKFRIDAY50']; // Mã voucher
            const totalQuantity = [500, 300, 150, 100]; // Tổng số voucher được tạo
            const usedQuantity = [400, 200, 100, 50]; // Số voucher đã được sử dụng

            setVoucherData({
                vouchers,
                usedQuantity,
                totalQuantity,
            });
        };

        fetchData();
    }, []);

    // Biểu đồ số lượng voucher đã sử dụng (Bar chart)
    const usageData = {
        labels: voucherData.vouchers,
        datasets: [
            {
                label: 'Số lượng voucher đã sử dụng',
                data: voucherData.usedQuantity,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const usageOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Số lượng voucher đã sử dụng',
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Mã Voucher',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Số lượng voucher',
                },
            },
        },
    };

    // Biểu đồ phần trăm voucher đã sử dụng (Pie chart)
    const percentageData = {
        labels: ['Voucher đã sử dụng', 'Voucher còn lại'],
        datasets: [
            {
                label: 'Tình trạng voucher',
                data: voucherData.usedQuantity.map((used, index) => used / voucherData.totalQuantity[index] * 100),
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const percentageOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Phần trăm voucher đã sử dụng',
            },
        },
    };

    return (
        <div className="pt-8 px-4 lg:ml-64">
            <nav className="rounded-md w-full max-w-5xl bg-white shadow-md mt-12 p-4">
                <h2>Biểu đồ Voucher</h2>

                <div style={{ marginBottom: '50px' }}>
                    <h3>Số lượng voucher đã sử dụng</h3>
                    <Bar data={usageData} options={usageOptions} />
                </div>

                <div>
                    <h3>Phần trăm voucher đã sử dụng</h3>
                    <Pie data={percentageData} options={percentageOptions} />
                </div>
            </nav>
        </div>

    );
};

export default VouchersChart;
