import React, { useState,useEffect } from "react";
import { Popconfirm, Button, List, Card, Select, message } from "antd";
import  AddAddress  from "/src/components/address/addaddress";
import AxiosUser from "../../../utils/axios_user";
import { FullScreenLoader } from "../../../utils/helpersjsx";
import { useUserContext } from "../../../context/user/userContext";
const { Option } = Select;

const urlAddAddress = "customer/profile/get-address";
const urlDeleteAddress = "customer/profile/delete-address/";
const urlSetDefaultAddress = "customer/profile/set-default-address/";

const AddressBook = () => {

    const { isLoggedIn } = useUserContext();

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [forceReload, setForceReload] = useState(false);
    const [handleDefaultLoading, setHandleDefaultLoading] = useState(false);


  const [addresses, setAddresses] = useState([]);
  

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
        setLoading(true);
        const res = await AxiosUser.get(urlAddAddress, { useToken: true });
        const data = res.addresses;
        const dataFormatted = data.map((item) => handleFomatAddress(item));
        setAddresses(dataFormatted);
      } catch (error) {
        const message = error.response?.data?.message || "Có lỗi xảy ra khi tải địa chỉ.";
        message.error(message);
      }finally{
        setLoading(false);
      }
    };
    fetchAddresses();
  },[forceReload,isLoggedIn]);

  const handleDeleteAddress = async (id) => {
    try {
      setLoading(true);
      await AxiosUser.post(urlDeleteAddress + id,{},{ useToken: true });
      setAddresses((prev) => prev.filter((item) => item.id !== id));
      message.success("Xoá địa chỉ thành công!");
    }
    catch (error) {
      message.error("Có lỗi xảy ra khi xoá địa chỉ.");
    }finally{
      setLoading(false);
    }
  }

  const handleSetDefaultAddress = async (id) => {
    try {
      setHandleDefaultLoading(true);
      const res = await AxiosUser.post(urlSetDefaultAddress + id,{}, { useToken: true });
      setAddresses(prev =>
        prev.map(item => ({
          ...item,
          is_default: item.id === id,
        }))
      );
      message.success("Đặt địa chỉ mặc định thành công!");
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra khi đặt địa chỉ mặc định.");
    } finally {
      setHandleDefaultLoading(false);
    }
  }

  const onSuccess = (address) => {
    const newAddress = handleFomatAddress(address);
    setAddresses((prev) => [...prev, newAddress]);
  }

  return (
    <>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">Sổ địa chỉ nhận hàng</h2>

        {/* Nút mở form thêm địa chỉ */}
        <Button
          type="primary"
          className="mb-4"
          onClick={() => setShowModal(true)}
        >
          Thêm địa chỉ mới
        </Button>

        <AddAddress
          open={showModal}
          onClose={setShowModal}
          onSuccess={onSuccess}
        />

        {/* Danh sách địa chỉ đã có */}
        <List
          className="bg-white p-4 rounded shadow"
          header={<h3 className="text-md font-semibold">Danh sách địa chỉ</h3>}
          dataSource={addresses}
          renderItem={(item, i) => (
            <List.Item key={`address-${i}`}>
              <Card className="w-full relative">
                {/* Nút Xoá đặt góc trên phải */}
                <Popconfirm
                  title="Bạn có chắc muốn xoá địa chỉ này không?"
                  okText="Xoá"
                  cancelText="Hủy"
                  onConfirm={() => handleDeleteAddress(item.id)}
                >
                  <Button
                    danger
                    type="text"
                    size="small"
                    className="absolute top-2 right-2"
                  >
                    Xoá
                  </Button>
                </Popconfirm>

                {/* Nội dung địa chỉ */}
                <p className="font-semibold">{item.name}</p>
                <p>{item.phone}</p>
                <p>{item.address}</p>
                <div className="mt-2">
                  {item.is_default ? (
                    <Button type="primary" color="green" variant="filled">
                      Mặc định
                    </Button>
                  ) : (
                    <Button type="primary" loading={handleDefaultLoading} onClick={()=>{handleSetDefaultAddress(item.id)}}>Đặt làm địa chỉ mặc định</Button>
                  )}
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
      <FullScreenLoader
        visible={loading}
        tip="Vui lòng đợi trong giây lát..."
      />
    </>
  );
};

export default AddressBook;