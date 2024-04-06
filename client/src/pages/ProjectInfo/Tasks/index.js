import { Button } from "antd";
import React from "react";
import TaskForm from "./TaskForm";

function Tasks({ project }) {
  const [showTaskForm, setShowTaskForm] = React.useState(false);
  return (
    <div>
      <div className="flex justify-end">
        <Button type="default" onClick={() => setShowTaskForm(true)}>
          Add Task
        </Button>
      </div>
      {showTaskForm && (
        <TaskForm
          showTaskForm={showTaskForm}
          setShowTaskForm={setShowTaskForm}
          project={project}
        />
      )}
    </div>
  );
}

export default Tasks;
