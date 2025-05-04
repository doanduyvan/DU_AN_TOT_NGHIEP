import { Input, Select, Radio, Divider, Button,Modal, message, Empty } from "antd";
import React, { useState, useEffect } from "react";
import AddAddress from "/src/components/address/addaddress";
import { FullScreenLoader } from "../../../utils/helpersjsx";
import { useUserContext } from "../../../context/user/userContext";
import { formatCurrency } from "../../../utils/helpers";
import AxiosUser from "../../../utils/axios_user";
import { Link, useNavigate, Navigate,useLocation  } from "react-router-dom";

const { Option } = Select;

const baseUrlImg = import.meta.env.VITE_URL_IMG;
const urlAddAddress = "customer/profile/get-address";
const urlCheckOut = "customer/checkout";
const urlGetVouchers = "customer/checkout/get-voucher";
const urlCheckVoucher = "customer/checkout/check-voucher";

const Checkout = () => {

  const location = useLocation();

  const { cartItems,setCart,setCartItems, isLoggedIn } = useUserContext();

  const [showModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [voucherCode, setVoucherCode] = useState("");
  const [addaddress, setAddAddress] = useState([]);
  const [modalChangeAddress, setModalChangeAddress] = useState(false);
  const [note, setNote] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [vouchersModal, setVouchersModal] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [isApplyVoucher, setIsApplyVoucher] = useState(null);
  const [totalDiscount, setTotalDiscount] = useState(null);
  const [discountValue, setDiscountValue] = useState(null);

  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.qty,
    0
  );


  const handleFomatAddress = (item) => {
    const dataFormatted = {
      id: item.id,
      name: item.fullname,
      phone: item.phone,
      address: `${item.addresses}, ${item.wards}, ${item.districts}, ${item.provinces}`,
      is_default: item.is_default
    };
    return dataFormatted;
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoadingCheckout(true);
        const res = await AxiosUser.get(urlAddAddress, { useToken: true });
        const data = res.addresses;
        const dataFormatted = data.map((item) => handleFomatAddress(item));
        setAddAddress(dataFormatted);
        if (dataFormatted.length > 0) {
          const defaultAddress = dataFormatted.find(item => item.is_default === 1);
          setSelectedAddress(defaultAddress ? defaultAddress : dataFormatted[0]);
        }
      } catch (error) {
        const message2 = error.response?.data?.message || "Có lỗi xảy ra khi tải địa chỉ.";
        message.error(message2);
      }finally{
        setLoadingCheckout(false);
      }
    };
    if(isLoggedIn) fetchAddresses();
  },[isLoggedIn,location]);

  const onAfterAddAddress = (address) => {
    const newAddress = handleFomatAddress(address);
    setAddAddress((prev) => [...prev, newAddress]);
    if(selectedAddress === null){
      setSelectedAddress(newAddress);
    }
  }

  const onSubmit = async () => {
    const dataReq = {
      address: selectedAddress,     // ID địa chỉ đã chọn
      note: note || null,                          // ghi chú đơn hàng (lưu qua useState)
      payment_method: paymentMethod,       // "cod" hoặc "vnpay"
      voucher_code: voucherCode || null,   // mã giảm giá (nếu có)
      cartItems,
    };

    if (!selectedAddress) {
      message.error("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }
    
    if (!cartItems.length) {
      message.error("Giỏ hàng của bạn đang trống.");
      return;
    }

    if(isApplyVoucher === false){
      message.error("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      return;
    }
    
    try{
      setLoadingCheckout(true);
      const res = await AxiosUser.post(urlCheckOut, dataReq, { useToken: true });
      localStorage.removeItem("cart");
      setCart([]);
      setCartItems([]);
      if(res.payment_method == "vnpay"){
        const urlVnPay = res.payment_url;
        window.location.href = urlVnPay;
      }else{
        setShowSuccessModal(true);
      }
    }catch(err){
      const message2 = err.response?.data?.message || "Có lỗi xảy khi đặt hàng.";
      message.error(message2);
      console.log(err);
    }finally{
      setLoadingCheckout(false);
    }
  }

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await AxiosUser.get(urlGetVouchers, { useToken: true });
        const data = res.vouchers;
        setVouchers(data);
      } catch (error) {
        const message2 = error.response?.data?.message || "Có lỗi xảy ra khi tải mã giảm giá.";
        message.error(message2);
      }
    };
    if(isLoggedIn) fetchVouchers();
  },[isLoggedIn,location]);

  const onCheckVoucher = async (chooseVoucher = null) => {

    let voucher_code = voucherCode;
    if(chooseVoucher !== null){
      voucher_code = chooseVoucher;
    }
    voucher_code = voucher_code.trim();
    if(voucher_code == "") return;

    try {
      setLoadingCheckout(true);
      const res = await AxiosUser.get(urlCheckVoucher, { params: { voucher_code: voucher_code , total: total}, useToken: true });
      const total_discount = res.total_discount;
      const discount_value = res.discount;
      const message2 = res.message;
      setIsApplyVoucher(true);
      setDiscountValue(discount_value);
      setTotalDiscount(total_discount);
      message.success(message2);
    }catch(err){
        setIsApplyVoucher(false);
        const message2 = err.response?.data?.message || "Có lỗi xảy ra khi kiểm tra mã giảm giá.";
        setTotalDiscount(null);
        message.error(message2);
    }finally{
      setLoadingCheckout(false);
    }
  }

  const onCancelVoucher = () => {
    setIsApplyVoucher(null);
    setTotalDiscount(null);
    setDiscountValue(null);
    setVoucherCode("");
  }

  if (!isLoggedIn) return <Navigate to="/login" />;

  return (
    <>
      <div className="pt-[90px]"></div>
      <div className="px-3 pb-8">
        <div className="swapper grid grid-cols-12 gap-2">
          {/* LEFT CONTENT */}
          <div className="col-span-12 md:col-span-7 lg:col-span-8 bg-white p-4 rounded-md shadow">
            <h2 className="text-2xl font-semibold mb-4">Thanh toán</h2>

            {/* Địa chỉ giao hàng */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Chọn địa chỉ giao hàng</p>
                <Button type="primary" onClick={() => setShowModal(true)}>
                  Thêm địa chỉ
                </Button>
              </div>

              {selectedAddress ? (
                <div className="border rounded p-2">
                  <div className="flex flex-col">
                    <p className="font-medium">{selectedAddress.name}</p>
                    <p className="text-sm">{selectedAddress.phone}</p>
                    <p className="text-sm"> {selectedAddress.address} </p>
                  </div>
                  <div className="mt-2">
                    <Button
                      type="primary"
                      onClick={() => setModalChangeAddress(true)}
                    >
                      Đổi địa chỉ
                    </Button>
                    <ChangeAddress
                      open={modalChangeAddress}
                      onClose={setModalChangeAddress}
                      addaddress={addaddress}
                      setSelectedAddress={setSelectedAddress}
                    />
                  </div>
                </div>
              ) : (
                <div className="border rounded p-2">
                  <p className="text-gray-500">
                    Bạn chưa có địa chỉ giao hàng nào.
                  </p>
                </div>
              )}

              <AddAddress
                open={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={onAfterAddAddress}
              />
            </div>

            {/* Danh sách đơn hàng */}
            <div>
              <Divider>Đơn hàng</Divider>
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-4 border-b py-3">
                  <img
                    src={baseUrlImg + item.image}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.qty}
                    </p>
                    <div className="flex gap-2 items-center">
                      <p className="text-red-500 font-semibold">
                        {formatCurrency(item.price)}
                      </p>
                      {item.price_delete && (
                        <p className="line-through text-gray-400">
                          {formatCurrency(item.price_delete)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Link
                to="/cart"
                className="text-sm text-blue-400 hover:text-blue-500 whitespace-nowrap"
              >
                &larr; Quay lại giỏ hàng
              </Link>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4 bg-white p-4 rounded-md shadow">
            <Divider orientation="left">Ghi chú đơn hàng</Divider>

            <Input.TextArea
              placeholder="Nhập ghi chú đơn hàng"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></Input.TextArea>

            <Divider orientation="left">Khuyến mãi</Divider>

            <div>
            <div>
              <Button type="primary" onClick={()=> setVouchersModal(true)}>Chọn mã khuyến mãi</Button>
            </div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Nhập mã khuyến mãi"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  allowClear={true}
                  disabled={isApplyVoucher !== null}
                  className={`${isApplyVoucher !== null ? isApplyVoucher ? "!border-green-500" : "!border-red-500" : ""}`}
                />
                {isApplyVoucher === null ? (
                <Button type="primary" onClick={()=> onCheckVoucher()}>Áp dụng</Button>
                ):(
                <Button type="primary" danger onClick={onCancelVoucher}>Hủy</Button>
                )}
              </div>
            </div>

            <Divider orientation="left">Phương thức thanh toán</Divider>
            <Radio.Group
              onChange={(e) => setPaymentMethod(e.target.value)}
              value={paymentMethod}
              className="flex flex-col gap-2"
            >
              <Radio value="cod">Thanh toán khi nhận hàng (COD)</Radio>
              <Radio value="vnpay">VNPAY</Radio>
            </Radio.Group>

            <Divider />

            <div className="text-sm font-medium mb-4">
              <div className="flex flex-col">
              {totalDiscount !== null ? (
                <>
                <div className="flex gap-2 items-center justify-between">
                  <span className="text-sm">Tạm tính:</span>
                  <span className="text-gray-400 text-sm line-through">{formatCurrency(total)}</span>
                </div>
                <div className="flex gap-2 items-center justify-between">
                  <span className="text-sm">Đã giảm:</span>
                  <span className="text-green-500">{formatCurrency(discountValue)}</span>
                </div>
                <div className="flex gap-2 items-center justify-between">
                  <span className="text-lg">Tổng cộng:</span>
                  <span className="text-red-500 text-lg">{formatCurrency(totalDiscount)}</span>
                </div>
                </>
              ) : (
                <div className="flex gap-2 items-center justify-between">
                  <span className="text-lg">Tổng cộng:</span>
                  <span className="text-red-500 text-lg">{formatCurrency(total)}</span>
                </div>
              )}
              </div>
            </div>

            <Button type="primary" className="w-full h-10" onClick={onSubmit}>
              Đặt hàng
            </Button>
          </div>
        </div>
      </div>
      <SuccessModal open={showSuccessModal} onClose={setShowSuccessModal} />
      <VoucherModal open={vouchersModal} onClose={setVouchersModal} vouchers={vouchers} onCheckVoucher={onCheckVoucher} setVoucherCode={setVoucherCode} />
      <FullScreenLoader visible={loadingCheckout} tip="Vui lòng chờ..." />
    </>
  );
};

export default Checkout;


const ChangeAddress = ({open,onClose,addaddress, setSelectedAddress}) => {

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    onClose(false);
  }

  return (
    <>
      <Modal
        title="Chọn địa chỉ giao hàng"
        open={open}
        footer={null}
        onCancel={() => onClose(false)}
      >
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px]">
          {addaddress.map((item, i) => (
            <div
              key={`k1${i}`}
              className="flex gap-4 border p-2 rounded items-center"
            >
              <div className="flex flex-col flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm">{item.phone}</p>
                <p className="text-sm">{item.address}</p>
              </div>
              <div>
                <Button type="primary" onClick={()=> handleSelectAddress(item)}>Chọn</Button>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );

}

const SuccessModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    onClose();
    navigate("/");
  };

  const handleGoOrder = () => {
    onClose();
    navigate("/profile?tab=4");
  };

  return (
    <Modal
      open={open}
      footer={null} 
      closable={false} 
      centered
      maskClosable={false}
    >
      <div className="text-center">
        <h2 className="text-xl font-semibold text-green-600">
          🎉 Đặt hàng thành công!
        </h2>
        <p className="mt-2 text-gray-600">
          Cảm ơn bạn đã mua hàng tại MesSkin.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Button type="primary" onClick={handleGoHome}>
            Về trang chủ
          </Button>
          <Button onClick={handleGoOrder}>Xem đơn hàng</Button>
        </div>
      </div>
    </Modal>
  );
};

const VoucherModal = ({ open, onClose, vouchers, onCheckVoucher,setVoucherCode }) => {

  const onSelectVoucher = (voucher) => {
    onCheckVoucher(voucher.code);
    setVoucherCode(voucher.code);
    onClose(false);
  }

  return (
    <Modal
      title="Chọn mã giảm giá"
      open={open}
      footer={null} 
      onCancel={() => onClose(false)}
    >
 <div className="space-y-4 max-h-[450px] overflow-y-auto">
        {vouchers.length === 0 ? (
          <Empty description="Không có mã giảm giá nào" />
        ) : (
          vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="border border-gray-300 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition"
            >
              <div>
                <div className="font-semibold text-lg">{voucher.title}</div>
                <div className="text-sm text-gray-500">
                  Mã: {voucher.code}
                </div>
                <div className="text-sm text-gray-500">
                  Hạn sử dụng: {new Date(voucher.expiry_date).toLocaleString('vi-VN')}
                </div>
                <div className="text-sm text-gray-500">
                  Giá trị: {voucher.discount_type === 0 ? `${formatCurrency(voucher.discount_value)}` : `${voucher.discount_value}%`}
                </div>
                <div className="text-sm text-gray-500">
                  Lượt sử dụng: {voucher.quantity_used} / {voucher.quantity}
                </div>
              </div>
              <Button type="primary" onClick={() => onSelectVoucher(voucher)}>
                Chọn
              </Button>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};