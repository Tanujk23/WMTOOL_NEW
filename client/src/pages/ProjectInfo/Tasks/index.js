import { Button, Table, message, Modal } from "antd";
import React from "react";
import TaskForm from "./TaskForm";
import { GetAllTasks, DeleteTask, UpdateTask } from "../../../apicalls/tasks";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { getDateFormat } from "../../../utils/helpers";
import Divider from "../../../components/Divider"

function Tasks({ project }) {
  const [showViewTask, setShowViewTask] = React.useState(false);
  const { user } = useSelector((state) => state.users);
  const [tasks, setTasks] = React.useState(null);
  const [task, setTask] = React.useState(null);
  const dispatch = useDispatch();
  const [showTaskForm, setShowTaskForm] = React.useState(false);
  const isEmployee = project.members.find(
    (member) => member.role === "employee" && member.user._id === user._id
  );

  const getTasks = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllTasks({ project: project._id });
      dispatch(SetLoading(false));
      if (response.success) {
        setTasks(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteTask(id);
      if (response.success) {
        getTasks();
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const onStatusUpdate = async (id, status) => {
    try {
      dispatch(SetLoading(true));
      const response = await UpdateTask({
        _id: id,
        status,
      });
      if (response.success) {
        getTasks();
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  React.useEffect(() => {
    getTasks();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span
          className="underline text-[14px] cursor-pointer"
          onClick={() => {
            setTask(record);
            setShowViewTask(true);
          }}
        >
          {record.name}
        </span>
      ),
    },
    {
      title: "Assinged To",
      dataIndex: "assingedTo",
      render: (text, record) =>
        record.assingedTo.firstName + " " + record.assingedTo.lastName,
    },
    {
      title: "Assinged By",
      dataIndex: "assingedBy",
      render: (text, record) =>
        record.assingedBy.firstName + " " + record.assingedBy.lastName,
    },
    {
      title: "Assinged On",
      dataIndex: "assingedOn",
      render: (text, record) => getDateFormat(text),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return (
          <select
            value={record.status}
            onChange={(e) => onStatusUpdate(record._id, e.target.value)}
            disabled={record.assingedTo._id !== user._id && isEmployee}
          >
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-2">
            <Button
              type="primary"
              onClick={() => {
                setTask(record);
                setShowTaskForm(true);
              }}
            >
              Edit
            </Button>
            {!isEmployee && (
              <Button
                type="primary"
                danger
                onClick={() => {
                  deleteTask(record._id);
                }}
              >
                Delete
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  if (isEmployee) {
    columns.pop();
  }

  return (
    <div>
      {!isEmployee && (
        <div className="flex justify-end">
          <Button type="default" onClick={() => setShowTaskForm(true)}>
            Add Task
          </Button>
        </div>
      )}

      <Table columns={columns} dataSource={tasks} className="mt-5" />

      {showTaskForm && (
        <TaskForm
          showTaskForm={showTaskForm}
          setShowTaskForm={setShowTaskForm}
          project={project}
          reloadData={getTasks}
          task={task}
        />
      )}
      {showViewTask && (
        <Modal
          title="Task Details"
          open={showViewTask}
          onCancel={() => setShowViewTask(false)}
          centered
          footer={null}
          width={700}
        >
          <Divider/>
          <h1 className="text-xl text-primary">{task.name}</h1>
          <span className='text=[14px] text-gray-500'>{task.description}</span>
        </Modal>
      )}
    </div>
  );
}

export default Tasks;
