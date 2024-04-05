import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetProjectsByRole } from "../../apicalls/projects";
import { SetLoading } from "../../redux/loadersSlice";
import { message } from "antd";

function Home() {
  const { user } = useSelector((state) => state.users);
  const [projects, setProjects] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetProjectsByRole();
      dispatch(SetLoading(false));
      if (response.success) {
        setProjects(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      Home
      <br />
      <span>
        Heyy {user?.firstName} {user?.lastName}, welcome to The Tracker
      </span>
    </div>
  );
}

export default Home;
