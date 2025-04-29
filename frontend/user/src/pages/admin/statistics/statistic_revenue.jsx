import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import Revenue from '../../../components/chart/revenue';
const StatisticRevenue = () => {

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
            <Revenue/>
            </div>
        </div>
    );
};
export default StatisticRevenue;

