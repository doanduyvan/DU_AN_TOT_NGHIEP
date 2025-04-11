import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần Chart.js
ChartJS.register(ArcElement, Title, Tooltip, Legend);

const ProductStatusChart = () => {
    const [statusChartData, setStatusChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        // Dữ liệu giả từ API
        const dataFromAPI = [
            { status: 1, product_count: 70 },  // Active
            { status: 0, product_count: 30 },  // Deleted
        ];

        const statuses = dataFromAPI.map(item => (item.status === 1 ? 'Active' : 'Deleted'));
        const productCounts = dataFromAPI.map(item => item.product_count);

        setStatusChartData({
            labels: statuses,
            datasets: [
                {
                    label: 'Product Status',
                    data: productCounts,
                    backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                    borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                    borderWidth: 2,
                },
            ],
        });
    }, []);

    return (
        <div className="pt-8 px-4 lg:ml-64">
            <nav className="rounded-md w-full max-w-xs bg-white shadow-md p-4">
                <h2 className="text-center text-lg font-semibold mb-4">Product Status Distribution</h2>
                <Pie
                    className="w-64 h-64 mx-auto"  // Kích thước nhỏ hơn
                    data={statusChartData}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Product Status',
                                font: {
                                    size: 16,  // Font nhỏ hơn cho tiêu đề
                                },
                            },
                            tooltip: {
                                callbacks: {
                                    label: (tooltipItem) => {
                                        return `${tooltipItem.label}: ${tooltipItem.raw} products`;
                                    },
                                },
                            },
                        },
                    }}
                />
            </nav>
        </div>
    );
};

export default ProductStatusChart;
