import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { notification as Notification } from "antd";
import { VoucherService } from "../../../services/api-vouchers";
import { DatePicker } from 'antd';
import { AntNotification } from "../../../components/notification";
import dayjs from 'dayjs';
import Select from "react-select";
export const Update_Voucher = () => {
    const { voucherId } = useParams();
    const navigate = useNavigate();
    const [voucher, setVoucher] = useState({});
    const [expiryDate, setExpiryDate] = useState(null);

    useEffect(() => {
        const fetchVoucher = async () => {
            const res = await VoucherService.getVoucherById(voucherId);
            console.log(res);
            if (res) {
                setVoucher(res);
                setExpiryDate(res.expiry_date);

            } else {
                AntNotification.handleError(error);
            }
        }
        fetchVoucher();
    }, [voucherId]);

    const handleDateChange = (date) => {
        setExpiryDate(date);
    };
    const handSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.forEach((value, key) => {
            console.log(key, value);
        }
        );
        try {
            const res = await VoucherService.update(voucherId, formData);
            if (res?.status === 200) {
                AntNotification.showNotification('Thành công', 'Cập nhật Voucher thành công', 'success');
                navigate("/admin/vouchers");
            } else {
                AntNotification.showNotification('Thất bại', 'Cập nhật Voucher thất bại', 'error');
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    }
    return (
        <div className="pt-20 px-4 lg:ml-64">
            <nav className="rounded-md w-full">
                <ol className="list-reset flex">
                    <li>
                        <Link
                            to="/admin"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản Trị
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li>
                        <Link
                            to="/admin/vouchers"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản lý phiếu giảm giá
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Cập nhật phiếu giảm giá
                    </li>
                </ol>
            </nav>
            <div className="bg-white shadow rounded-lg mb-4 mt-4 p-4 sm:p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Cập nhật phiếu giảm giá
                    </h5>
                </div>
                <form className="max-w-sm mt-5" onSubmit={handSubmit}>
                    <div className="mb-5">
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tiêu đề</label>
                        <input type="text"
                            name="title"
                            defaultValue={voucher?.title}
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập tiêu đề"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mã giảm giá</label>
                        <input type="text"
                            defaultValue={voucher?.code}
                            name="code"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập mã giảm giá"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Loại giảm giá</label>
                        <Select
                            defaultValue={voucher?.discount_type === '0' ? { value: '0', label: 'Số tiền cố định' } : { value: '1', label: 'Phần trăm' }}
                            name="discount_type"
                            options={[
                                { value: '0', label: 'Số tiền cố định' },
                                { value: '1', label: 'Phần trăm' },
                            ]}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Chọn loại mã giảm giá"
                            isClearable={true}
                            isSearchable={true}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    minHeight: '45px'
                                })
                            }}
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="discount_value" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Giá trị giảm giá</label>
                        <input type="text"
                            defaultValue={voucher?.discount_value}
                            name="discount_value"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập giá trị giảm giá"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số lượng mã giảm giá</label>
                        <input type="number"
                            defaultValue={voucher?.quantity}
                            name="quantity"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập số lượng"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="expiry_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                            Thời gian hết hạn
                        </label>
                        <DatePicker
                            value={expiryDate ? dayjs(expiryDate, 'YYYY-MM-DDTHH:mm:ss') : null}
                            onChange={handleDateChange}
                            name="expiry_date"
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Chọn ngày và giờ hết hạn"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
        </div>
    );
}