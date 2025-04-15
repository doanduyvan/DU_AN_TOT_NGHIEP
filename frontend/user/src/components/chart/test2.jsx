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

const OrdersChart = () => {
  // Dữ liệu mẫu từ cơ sở dữ liệu (có thể lấy từ API)
  const [orderData, setOrderData] = useState({
    monthlyRevenue: [],
    orderStatusCounts: [],
  });

  useEffect(() => {
    // Giả sử bạn gọi API hoặc lấy dữ liệu từ cơ sở dữ liệu
    const fetchData = () => {
      const monthlyRevenue = [5000, 4000, 7000, 6000, 8000, 7500]; // Doanh thu theo các tháng
      const orderStatusCounts = {
        'Chưa xử lý': 10,
        'Đang xử lý': 20,
        'Đã giao': 30,
        'Đã hủy': 5,
      };

      setOrderData({
        monthlyRevenue,
        orderStatusCounts: Object.values(orderStatusCounts),
      });
    };

    fetchData();
  }, []);

  // Biểu đồ doanh thu theo tháng (Bar chart)
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Các tháng trong năm
    datasets: [
      {
        label: 'Tổng doanh thu (VND)',
        data: orderData.monthlyRevenue,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Doanh thu hàng tháng',
      },
      tooltip: {
        enabled: true,
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

  // Biểu đồ số lượng đơn hàng theo trạng thái (Pie chart)
  const statusData = {
    labels: ['Chưa xử lý', 'Đang xử lý', 'Đã giao', 'Đã hủy'],
    datasets: [
      {
        label: 'Trạng thái đơn hàng',
        data: orderData.orderStatusCounts,
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const statusOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Số lượng đơn hàng theo trạng thái',
      },
    },
  };

  return (
    <div className="pt-8 px-4 lg:ml-64">
            <nav className="rounded-md w-full max-w-5xl bg-white shadow-md mt-12 p-4">
    <div>
      <h2>Biểu đồ Doanh thu và Trạng thái Đơn hàng</h2>
      
      <div style={{ marginBottom: '50px' }}>
        <h3>Doanh thu hàng tháng</h3>
        <Bar data={revenueData} options={revenueOptions} />
      </div>

      <div>
        <h3>Số lượng đơn hàng theo trạng thái</h3>
        <Pie data={statusData} options={statusOptions} />
      </div>
    </div>
    </nav>
    </div>
  );
};

export default OrdersChart;
