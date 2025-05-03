import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate  } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Result, Spin } from 'antd';
import AxiosUser from '../../../utils/axios_user';
import CryptoJS from "crypto-js";
import qs from "qs";

const urlIpn = "vnpay/ipn";

const VnpayReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [vnpData, setVnpData] = useState({});

  const getVnpayData = () => {
    // const result = {
    //   vnp_Amount: searchParams.get("vnp_Amount"),
    //   vnp_BankCode: searchParams.get("vnp_BankCode"),
    //   vnp_BankTranNo: searchParams.get("vnp_BankTranNo"),
    //   vnp_CardType: searchParams.get("vnp_CardType"),
    //   vnp_OrderInfo: searchParams.get("vnp_OrderInfo"),
    //   vnp_PayDate: searchParams.get("vnp_PayDate"),
    //   vnp_ResponseCode: searchParams.get("vnp_ResponseCode"),
    //   vnp_TmnCode: searchParams.get("vnp_TmnCode"),
    //   vnp_TransactionNo: searchParams.get("vnp_TransactionNo"),
    //   vnp_TransactionStatus: searchParams.get("vnp_TransactionStatus"),
    //   vnp_TxnRef: searchParams.get("vnp_TxnRef"),
    // };

    const result = {};
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith("vnp_")) {
        result[key] = value;
      }
    }
    return result;
  }

  const generateVnpSecureHash = (params, secretKey) => {
    // Bỏ vnp_SecureHash nếu có
    delete params.vnp_SecureHash;
  
    // Sắp xếp key theo thứ tự alphabet
    const sortedKeys = Object.keys(params).sort();
    const sortedParams = {};
    sortedKeys.forEach((key) => {
      sortedParams[key] = params[key];
    });
  
    const query = qs.stringify(sortedParams, { encode: false });
  
    const hash = CryptoJS.HmacSHA512(query, secretKey).toString();
    return hash;
  };



  useEffect(() => {
      const sendIpn = async () => {
        const dataIpn = getVnpayData();
        dataIpn.vnp_SecureHash = generateVnpSecureHash(dataIpn, "N0E4D2VI3WFV4LAAPZA8CCM7OIV7XRBV");
      try {
        const response = await AxiosUser.get(urlIpn, { params: dataIpn });
        console.log(response);
      } catch (error) {
        console.error("Error sending IPN:", error);
      }
    };
    sendIpn();

    const responseCode = searchParams.get("vnp_ResponseCode");
    if (responseCode === "00") {
      setSuccess(true);
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Result
        status={success ? 'success' : 'error'}
        title={success ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
        subTitle={success ? 'Cảm ơn bạn đã đặt hàng tại website của chúng tôi.' : 'Rất tiếc, giao dịch của bạn không thành công. Vui lòng thử lại.'}
        icon={success ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
        extra={[
          <Button type="primary" key="back-register" onClick={() => navigate('/')}>
            Trang chủ
          </Button>,
          <Button key="back-cart" onClick={() => navigate('/profile?tab=4')}>
            Xem đơn hàng
          </Button>
        ]}
      />
    </div>
  );
};

export default VnpayReturnPage;
