import React from "react";
import { Form, Modal, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";

function MemberForm({
  showMemberForm,
  setShowMemberForm,
  reloadData,
  project,
}) {
  console.log(project.members);
  const formRef = React.useRef(null);
  const dispatch = useDispatch();
  const onFinish = (values) => {
    try {
      dispatch(SetLoading(true));
      //check if user is alreay on project
      const emailExists = project.members.find(
        (member) => member.user.email === values.email
      );
      if (emailExists) {
        throw new Error("User is already assing to the project");
      } else {
        //add member
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };
  return (
    <Modal
      title="Add Member"
      open={showMemberForm}
      onCancel={() => setShowMemberForm(false)}
      centered
      okText="Add"
      onOk={() => {
        formRef.current.submit();
      }}
    >
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Form.Item label="Email" name="email">
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item label="Role" name="role">
          <select name="role">
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MemberForm;
