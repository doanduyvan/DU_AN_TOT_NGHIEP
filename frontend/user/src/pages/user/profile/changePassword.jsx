import React,{ useState} from 'react';
import { Input, Button, Form, message } from 'antd';
import AxiosUser from '../../../utils/axios_user';
import { FullScreenLoader } from '../../../utils/helpersjsx';

const urlChangePassword = "customer/profile/change-password";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await AxiosUser.post(urlChangePassword, values , { useToken: true });
      message.success(res.message);
      form.resetFields();
    } catch (error) {
      const messageError = error.response?.data?.message || 'Có lỗi xảy ra!';
      message.error(messageError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="bg-gray-100 p-4 rounded">
      <h2 className="text-lg font-semibold mb-4">Thay đổi mật khẩu</h2>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="current_password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' },
            { min: 6, message: 'Ít nhất 6 ký tự' },
            { max: 255, message: 'Không vượt quá 255 ký tự' },
          ]}
        >
          <Input.Password placeholder="Mật khẩu hiện tại" />
        </Form.Item>
        <Form.Item
          name="new_password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            { min: 6, message: 'Ít nhất 6 ký tự' },
            { max: 255, message: 'Không vượt quá 255 ký tự' },
          ]}
        >
          <Input.Password placeholder="Mật khẩu mới" />
        </Form.Item>
        <Form.Item
          name="confirm_password"
          dependencies={['new_password']}
          rules={[
            { required: true, message: 'Vui lòng nhập lại mật khẩu mới' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('Mật khẩu nhập lại không khớp');
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu mới" />
        </Form.Item>
        <Button type="primary" htmlType="submit" className="w-full bg-green-600">
          Đổi mật khẩu
        </Button>
      </Form>
    </div>
    <FullScreenLoader visible={loading} tip='Vui lòng đợi trong giây lát...' />
    </>
  );
};

export default ChangePassword;