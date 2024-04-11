import { Button, Form, Input, Modal, Tabs, Upload, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { CreateTask, UpdateTask, UploadImage } from "../../../apicalls/tasks";
import { AddNotification } from "../../../apicalls/notifications";

function TaskForm({
  showTaskForm,
  setShowTaskForm,
  project,
  task,
  reloadData,
}) {
  const [selectedTab = "1", setSelectedTab] = React.useState("1");
  const formRef = React.useRef(null);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [email, setEmail] = React.useState(null);
  const [file = null, setFile] = React.useState(null);

  const onFinish = async (values) => {
    try {
      let response = null;
      const assingedToMember = project.members.find(
        (member) => member.user.email === email
      );
      const assingedToUserId = assingedToMember.user._id;
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
        const assingedBy = user._id;
        response = await CreateTask({
          ...values,
          project: project._id,
          assingedTo: assingedToUserId,
          assingedBy,
        });
      }
      if (response.success) {
        if (!task) {
          //send notification to the assinged employee
          AddNotification({
            title: `You have been assinged a new task in ${project.name}`,
            user: assingedToUserId,
            onClick: `/project/${project._id}`,
            description: values.description,
          });
        }

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

  const uplaodImage = async () => {
    try {
      dispatch(SetLoading(true));
      const formData = new FormData();
      formData.append("file", file);
      formData.append("taskId", task._id);
      const response = await UploadImage(formData);
      if (response.success) {
        message.success(response.message);
        reloadData();
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
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
      width={800}
      {...(selectedTab === "2" && { footer: null })}
    >
      <Tabs activeKey={selectedTab} onChange={(key) => setSelectedTab(key)}>
        <Tabs.TabPane tab="Task Details" key="1">
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
        </Tabs.TabPane>
        <Tabs.TabPane tab="Attachments" key="2" disabled={!task}>
          <Upload
            beforeUpload={() => false}
            onChange={(info) => {
              setFile(info.file);
            }}
            listType="picture"
          >
            <Button type="dashed">Uplaod Images</Button>
          </Upload>
          <div className="flex justify-end mt-4 gap-5">
            <Button type="default" onClick={()=>setShowTaskForm(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={uplaodImage} disabled={!file}>
              Uplaod
            </Button>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}

export default TaskForm;
