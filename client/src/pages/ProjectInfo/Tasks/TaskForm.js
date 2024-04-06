import { Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";

function TaskForm({ showTaskForm, setShowTaskForm, project }) {
  const formRef = React.useRef(null);
  const [email, setEmail] = React.useState(null);
  const onFinish = (values) => {
    console.log("success: ", values);
  };

  const validateEmail = () => {
    const employeesInProject = project.members.filter(
      (member) => member.role === "employee"
    );
    const isEmailValid = employeesInProject.find(
      (employee) => employee.user.email === email
    );
    return isEmailValid ? true : false;
  };
  return (
    <Modal
      title="Add Task"
      open={showTaskForm}
      onCancel={() => setShowTaskForm(false)}
      centered
      onOk={() => {
        formRef.current.submit();
      }}
    >
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Form.Item label="Task Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Task Description" name="description">
          <TextArea />
        </Form.Item>
        <Form.Item label="Assing to" name="assingedTo">
          <Input
            placeholder="Enter email of the employee"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        {email && !validateEmail() && (
          <div className="bg-red-500 text-sm p-2 rounded">
            <span className="text-white">
              Email is not valid or empleoyee is not in the project
            </span>
          </div>
        )}
      </Form>
    </Modal>
  );
}

export default TaskForm;
