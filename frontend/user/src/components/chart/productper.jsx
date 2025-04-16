import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { ChartService } from '../../services/api-chart';
import { AntNotification } from "../../components/notification";

// Đăng ký Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Cấu hình font mặc định
ChartJS.defaults.font.family = "'Roboto', sans-serif";
ChartJS.defaults.font.size = 14;

const ProductPerformanceChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // Cấu hình biểu đồ
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'PHÂN TÍCH HIỆU SUẤT SẢN PHẨM THEO DANH MỤC',
        font: { size: 18, weight: 'bold' },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const { dataset, raw } = context;
            if (dataset.label.includes('Đánh giá')) return `${dataset.label}: ${raw}/5 ★`;
            if (dataset.label.includes('Số lượng')) return `${dataset.label}: ${raw} SP`;
            return `${dataset.label}: ${raw} lượt${dataset.label.includes('Lượt review') ? '/sản phẩm' : ''}`;
          },
        },
        bodyFont: { size: 13 }
      },
      legend: {
        labels: { padding: 20 }
      }
    },
    scales: {
      x: {
        ticks: { maxRotation: 0, autoSkip: true }
      },
      y1: {
        position: 'left',
        title: {
          display: true,
          text: 'Số lượng (SP) và Lượt review/sản phẩm',
          font: { size: 14, weight: 'bold' }
        },
        grid: { drawOnChartArea: true }
      },
      y2: {
        position: 'right',
        title: {
          display: true,
          text: 'Đánh giá (★)',
          font: { size: 14, weight: 'bold' }
        },
        min: 0,
        max: 5,
        grid: { drawOnChartArea: false }
      }
    },
    interaction: { mode: 'index', intersect: false }
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await ChartService.getProductPerformance();

        setChartData({
          labels: data.map(item => item.category),
          datasets: [
            {
              type: 'bar',
              label: 'Số lượng sản phẩm',
              data: data.map(item => item.productCount),
              backgroundColor: 'rgba(53, 162, 235, 0.7)',
              borderColor: 'rgba(53, 162, 235, 1)',
              borderWidth: 1,
              yAxisID: 'y1',
            },
            {
              type: 'line',
              label: 'Đánh giá trung bình (5 sao)',
              data: data.map(item => item.avgRating),
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 3,
              tension: 0.3,
              yAxisID: 'y2',
            },
            {
              type: 'bar',
              label: 'Lượt review/sản phẩm',
              data: data.map(item => Number(item.reviewPerProduct.toFixed(2))),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              yAxisID: 'y1',
            }
          ]
        });
      } catch (error) {
        AntNotification.handleError(error);
        setChartData({ labels: [], datasets: [] });
      }
    };

    fetchChartData();
  }, []);

  return (
    <div className="pt-20 px-4 lg:ml-64">
      <nav className="rounded-md w-full">
        <ol className="list-reset flex items-center">
          <li>
            <Link to="/admin" className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600">
              Quản Trị
            </Link>
          </li>
          <li className="mx-2 text-neutral-500 dark:text-neutral-400">/</li>
          <li className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600">Hiệu Suất Sản Phẩm</li>
        </ol>
      </nav>

      <div className="bg-white shadow-md my-4 sm:rounded-lg ">
        <div>
          <div
            className="w-full p-4"
            style={{
              height: '550px',
              minWidth: '600px',
            }}
          >
            <Chart
              type="bar"
              data={chartData}
              options={chartOptions}
            />
          </div>
          <p className="text-center text-gray-600 p-4 italic">
            Dữ liệu cập nhật mới nhất: {new Date().toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProductPerformanceChart;