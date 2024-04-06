import React from "react";
import { Form, Modal, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../../utils/helpers";
import { AddMemberToProject } from "../../../apicalls/projects";

function MemberForm({
  showMemberForm,
  setShowMemberForm,
  reloadData,
  project,
}) {
  console.log(project.members);
  const formRef = React.useRef(null);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      //check if user is alreay on project
      const emailExists = project.members.find(
        (member) => member.user.email === values.email
      );
      if (emailExists) {
        throw new Error("User is already assing to the project");
      } else {
        dispatch(SetLoading(true));
        const response = await AddMemberToProject({
          projectId: project._id,
          email: values.email,
          role: values.role,
        });
        dispatch(SetLoading(false));
        if (response.success) {
          message.success(response.message);
          reloadData();
          setShowMemberForm(false);
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    } finally{
        dispatch(SetLoading(false));
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
        <Form.Item label="Email" name="email" rules={getAntdFormInputRules}>
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item label="Role" name="role" rules={getAntdFormInputRules}>
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
