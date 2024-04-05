import React from "react";
import { useSelector } from "react-redux";

function Home() {
  const { user } = useSelector((state) => state.users);
  return (
    <div>
      Home<br/>
      <span>
        Heyy {user?.firstName} {user?.lastName}, welcome to The Tracker
      </span>
    </div>
  );
}

export default Home;
