import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ProductStatsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Giả lập dữ liệu từ API (thay bằng API thực tế của bạn)
    const mockData = [
      { category_id: 1, category_name: 'Điện tử', product_count: 50, avg_rating: 4.2 },
      { category_id: 2, category_name: 'Thời trang', product_count: 30, avg_rating: 3.8 },
      { category_id: 3, category_name: 'Gia dụng', product_count: 20, avg_rating: 4.5 },
    ];

    setChartData({
      labels: mockData.map(item => item.category_name),
      datasets: [
        {
          type: 'bar', // Loại biểu đồ
          label: 'Số lượng sản phẩm',
          data: mockData.map(item => item.product_count),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: 'y1', // Gắn với trục bên trái
        },
        {
          type: 'line', // Loại biểu đồ
          label: 'Đánh giá trung bình',
          data: mockData.map(item => item.avg_rating),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          tension: 0.4, // Làm mượt đường line
          yAxisID: 'y2', // Gắn với trục bên phải
        },
      ],
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'THỐNG KÊ SẢN PHẨM THEO DANH MỤC',
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            if (label.includes('Số lượng')) {
              return `${label}: ${context.raw} sản phẩm`;
            } else {
              return `${label}: ${context.raw}/5 sao`;
            }
          },
        },
      },
    },
    scales: {
      y1: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Số lượng sản phẩm' },
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Đánh giá trung bình' },
        min: 0,
        max: 5,
        grid: { drawOnChartArea: false }, // Ẩn grid line để tránh rối
      },
    },
  };

  return (
    <div style={{ width: '800px', margin: '0 auto' }}>
      <Bar data={chartData} options={options} />
      <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
        Dữ liệu giả lập - Thay bằng API thực tế từ backend
      </p>
    </div>
  );
};

export default ProductStatsChart;