import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { ChartService } from '../../services/api-chart';
import { AntNotification } from "../../components/notification";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

ChartJS.defaults.font.family = "'Roboto', sans-serif";
ChartJS.defaults.font.size = 14;
const Revenue = () => {
  // Dữ liệu mẫu cho các năm (2023 và 2024)


  // Trạng thái cho năm được chọn
  const [revenue, setRevenue] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [year, setYear] = useState([]);
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await ChartService.getOrderYear();
        setYear(data);
        if (data.length > 0) {
          setSelectedYear(data[0].year);
        }
      } catch (error) {
        AntNotification.handleError(error);
      }
    };
    fetchChartData();
  }, []);
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await ChartService.getOrderStatistics(selectedYear);
        setRevenue(data);
      } catch (error) {
        AntNotification.handleError(error);
      }
    };
    fetchChartData();
  }, [selectedYear]);

  // Cập nhật dữ liệu khi thay đổi năm
  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  const chartData = {
    labels: revenue.map(item => `Tháng ${item.month}`),
    datasets: [
      {
        label: 'Số lượng đơn hàng',
        data: revenue.map(item => item.total_orders),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Doanh thu (VND)',
        data: revenue.map(item => item.total_revenue),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        yAxisID: 'y2',
      },
    ],
  };

  // Dữ liệu cho biểu đồ

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Thống kê đơn hàng và doanh thu ${selectedYear}`,
      },
      tooltip: {
        mode: 'index',
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
          text: 'Số lượng đơn hàng',
        },
        position: 'left',
      },
      y2: {
        title: {
          display: true,
          text: 'Doanh thu (VND)',
        },
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };


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
          <li className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600">
            Thống kê doanh thu
          </li>
        </ol>
      </nav>
      <div className="bg-white shadow-md my-4 sm:rounded-lg p-4">
        <div className="mb-5">
          <label htmlFor="year" className="block text-lg font-medium text-gray-700 mb-2">
            Năm
          </label>
          <select
            name="year"
            onChange={handleYearChange}
            className="block p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          >
            {year.map((item) => (
              <option key={item.year} value={item.year}>
                {item.year}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-lg overflow-hidden">
          <div>
            {revenue ? (
              <div style={{ height: '550px', minWidth: '600px'}}>
                <Line data={chartData} options={options} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Dữ liệu thời điểm này chưa có.</p>
              </div>
            )}
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
    </div>
  );
};
export default Revenue;

