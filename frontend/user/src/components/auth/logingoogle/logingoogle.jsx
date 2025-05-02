import { Button, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";
import AxiosUser from "/src/utils/axios_user";

const urlLoginGoogle = "login-google";

const LoginGoogle = ({onSuccess}) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const access_token = tokenResponse.access_token;
      const res = await AxiosUser.post(urlLoginGoogle, { accessToken: access_token });
      onSuccess(res);
    },
    onError: () => {
        message.error("Đăng nhập thất bại, vui lòng thử lại sau");
    },
    flow: "implicit", // sử dụng access_token thay vì redirect
  });

  return (
    <Button shape="circle" icon={<GoogleOutlined />} onClick={() => login()} />
  );
};

export default LoginGoogle;
