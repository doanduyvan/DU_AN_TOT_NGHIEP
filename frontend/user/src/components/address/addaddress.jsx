import { useEffect, useState } from "react";
import { Modal, Input, Select, Button, Form, message } from "antd";
import axios from "axios";
import AxiosUser from "../../utils/axios_user";
import { useNavigate } from "react-router-dom";
import { FullScreenLoader } from "../../utils/helpersjsx";

const { Option } = Select;

const urlAddAddress = "customer/profile/add-address";

const AddAddress = ({ open, onClose, onSuccess }) => {
    const navigate = useNavigate();
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

    const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/p").then((res) => {
      setProvinces(res.data);
    });
  }, []);

  const handleProvinceChange = (value) => {
    const province = provinces.find((item) => item.code === value);
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setWards([]);
    axios.get(`https://provinces.open-api.vn/api/p/${value}?depth=2`).then((res) => {
      setDistricts(res.data.districts);
    });
    form.setFieldsValue({ districts: undefined, wards: undefined });
  };

  const handleDistrictChange = (value) => {
    const district = districts.find((item) => item.code === value);
    setSelectedDistrict(district);
    axios.get(`https://provinces.open-api.vn/api/d/${value}?depth=2`).then((res) => {
      setWards(res.data.wards);
    });
    form.setFieldsValue({ wards: undefined });
  };

  const sendToServer = async (payload) => {
    try {
        setLoading(true);
      const response = await AxiosUser.post(urlAddAddress, payload, { useToken: true });
      return true;
    } catch (error) {
        console.log(error);
        const status = error?.status;
      if (status === 401) {
        message.error("Vui lòng đăng nhập để thực hiện thao tác này.");
        navigate("/login");
      }else {
          message.error("Có lỗi xảy ra khi thêm địa chỉ.");
      }
        return false;
    }finally{
        setLoading(false);
    }
  }

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      const payload = {
        ...values,
        provinces: selectedProvince.name,
        districts: selectedDistrict.name,
        wards: wards.find(w => w.code === values.wards)?.name,
      };

      const check = await sendToServer(payload);
      if (!check) return;
      message.success("Thêm địa chỉ thành công!");
      form.resetFields();
      onClose();
      if (onSuccess) {
        onSuccess(payload);
     }
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
    <Modal
      title="Thêm địa chỉ mới"
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="Lưu"
      cancelText="Hủy"
      className="md:max-w-[700px]"
      width="auto"
    >
      <Form layout="vertical" className="*:my-1" form={form}>
        <Form.Item
          name="fullname"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            {
              pattern: /^0\d{9}$/,
              message: "Số điện thoại không hợp lệ",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 *:m-0">
          <Form.Item
            name="provinces"
            label="Tỉnh/Thành"
            rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành" }]}
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              onChange={handleProvinceChange}
            >
              {provinces.map((item) => (
                <Option key={item.code} value={item.code}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="districts"
            label="Quận/Huyện"
            rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
          >
            <Select
              onChange={handleDistrictChange}
              disabled={!districts.length}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {districts.map((item) => (
                <Option key={item.code} value={item.code}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="wards"
            label="Phường/Xã"
            rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
          >
            <Select
              disabled={!wards.length}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {wards.map((item) => (
                <Option key={item.code} value={item.code}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Form.Item
          name="addresses"
          label="Địa chỉ chi tiết"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ chi tiết" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
    <FullScreenLoader visible={loading} tip="Vui lòng chờ..." />
    </>
  );
};

export default AddAddress;
