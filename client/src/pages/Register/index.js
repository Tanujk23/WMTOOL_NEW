import React, { useEffect } from "react";
import { Form, Button, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../components/Divider";
import { RegisterUser } from "../../apicalls/users";
import { useSelector, useDispatch } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";

function Register() {
  const navigate = useNavigate();
  const { buttonLoading } = useSelector((state) => state.loaders);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetButtonLoading(true));
      const response = await RegisterUser(values);
      dispatch(SetButtonLoading(false));
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetButtonLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="grid grid-cols-2">
      <div className="bg-primary h-screen flex flex-col justify-center items-center">
        <div>
          <h1 className="text-7xl text-white">THE TRACKER</h1>
          <span className="text-white">
            One place to track all your work progress
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-[420px]">
          <h1 className="text-2xl text-gray-700">LETS GET YOU STARTED</h1>
          <Divider />
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="First Name" name="firstName" rules={getAntdFormInputRules}>
              <Input />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" rules={getAntdFormInputRules}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={getAntdFormInputRules}>
              <Input />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={getAntdFormInputRules}>
              <Input type="password" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={buttonLoading}
            >
              Register
            </Button>
            <div className="flex justify-center mt-5">
              <span>
                Already have an account? <Link to="/login">Login</Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
