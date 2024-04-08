import { Form, Input, Modal, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { CreateTask, UpdateTask } from "../../../apicalls/tasks";

function TaskForm({
  showTaskForm,
  setShowTaskForm,
  project,
  task,
  reloadData,
}) {
  const formRef = React.useRef(null);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [email, setEmail] = React.useState(null);
  const onFinish = async (values) => {
    try {
      let response = null;
      dispatch(SetLoading(true));
      if (task) {
        //update task
        response = await UpdateTask({
          ...values,
          project: project._id,
          _id: task._id,
          assingedTo: task.assingedTo._id,
        });
      } else {
        const assingedToMember = project.members.find(
          (member) => member.user.email === email
        );
        const assingedToUserId = assingedToMember.user._id;
        const assingedBy = user._id;
        response = await CreateTask({
          ...values,
          project: project._id,
          assingedTo: assingedToUserId,
          assingedBy,
        });
      }
      if (response.success) {
        reloadData();
        message.success(response.message);
        setShowTaskForm(false);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
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
      title={task ? "Update Task" : "Add Task"}
      open={showTaskForm}
      onCancel={() => setShowTaskForm(false)}
      centered
      onOk={() => {
        formRef.current.submit();
      }}
      okText={task ? "UPDATE" : "CREATE"}
    >
      <Form
        layout="vertical"
        ref={formRef}
        onFinish={onFinish}
        initialValues={{
          ...task,
          assingedTo: task ? task.assingedTo.email : "",
        }}
      >
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
            disabled={task ? true : false}
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
