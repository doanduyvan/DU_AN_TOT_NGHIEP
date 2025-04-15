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

const ProductsChart = () => {
  // Dữ liệu mẫu từ cơ sở dữ liệu (có thể lấy từ API)
  const [productData, setProductData] = useState({
    productCategories: [],
    productSales: [],
  });

  useEffect(() => {
    // Giả sử bạn gọi API hoặc lấy dữ liệu từ cơ sở dữ liệu
    const fetchData = () => {
      const productCategories = ['Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm D', 'Sản phâm1', 'sanpham2' ,'Sản phâm1', 'sanpham2','Sản phâm1', 'sanpham2','Sản phâm1', 'sanpham2','Sản phâm1', 'sanpham2','Sản phâm1', 'sanpham2','Sản phâm1', 'sanpham2','Sản phâm1', 'sanpham2','Sản phâm1', 'sanpham2']; // Tên sản phẩm
      const productQuantities = [100, 150, 200, 120]; // Số lượng của từng sản phẩm
      const productSales = ['Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm D','Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm D','Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm D','Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm D','Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm D','Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm D']; // Tên sản phẩm
      const salesData = [2000, 3000, 4000, 2500,2000, 3000, 4000, 2500,2000, 3000, 4000, 2500,2000, 3000, 4000, 2500,2000, 3000, 4000, 2500,2000, 3000, 4000, 2500,2000, 3000, 4000, 2500,2000, 3000, 4000, 2500]; // Doanh thu từ từng sản phẩm

      setProductData({
        productCategories,
        productQuantities,
        productSales,
        salesData,
      });
    };

    fetchData();
  }, []);

  // Biểu đồ số lượng sản phẩm theo loại (Bar chart)
  const quantityData = {
    labels: productData.productCategories,
    datasets: [
      {
        label: 'Số lượng sản phẩm',
        data: productData.productQuantities,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const quantityOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Số lượng sản phẩm theo loại',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tên sản phẩm',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Số lượng',
        },
      },
    },
  };

  // Biểu đồ doanh thu từ sản phẩm (Pie chart)
  const salesData = {
    labels: productData.productSales,
    datasets: [
      {
        label: 'Doanh thu từ sản phẩm',
        data: productData.salesData,
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Doanh thu từ các sản phẩm',
      },
    },
  };

  return (
    <div className="pt-8 px-4 lg:ml-64">
            <nav className="rounded-md w-full max-w-5xl bg-white shadow-md mt-12 p-4">
    <div>
      <h2>Biểu đồ Sản phẩm và Doanh thu</h2>
      
      <div style={{ marginBottom: '50px' }}>
        <h3>Số lượng sản phẩm theo loại</h3>
        <Bar data={quantityData} options={quantityOptions} />
      </div>

      <div>
        <h3>Doanh thu từ sản phẩm</h3>
        <Pie data={salesData} options={salesOptions} />
      </div>
    </div>
    </nav>
    </div>
  );
};

export default ProductsChart;
