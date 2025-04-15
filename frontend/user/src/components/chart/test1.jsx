import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các phần tử của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MyChart = () => {
  // Dữ liệu mẫu cho biểu đồ (có thể thay đổi theo dữ liệu từ cơ sở dữ liệu của bạn)
  const data = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'], // Các tháng trong năm
    datasets: [
      {
        label: 'Doanh thu (VND)', // Tên của dữ liệu
        data: [1500, 2000, 2500, 3000, 3500, 4000, 3900, 3700, 4000, 4200, 3600, 5000], // Dữ liệu doanh thu theo các tháng
        borderColor: 'rgba(75, 192, 192, 1)', // Màu viền của đường
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Màu nền cho các điểm
        fill: true, // Điền màu dưới đường
        tension: 0.1, // Độ cong của đường
      },
    ],
  };

  // Các tùy chỉnh cho biểu đồ
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Biểu đồ doanh thu hàng tháng',
      },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tháng',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Doanh thu (VND)',
        },
      },
    },
  };

  return (
    <div className="pt-8 px-4 lg:ml-64">
            <nav className="rounded-md w-full max-w-5xl bg-white shadow-md mt-12 p-4">
      <h2>Biểu đồ Doanh thu</h2>
      <Line data={data} options={options} />
      </nav>
    </div>
  );
};

export default MyChart;
