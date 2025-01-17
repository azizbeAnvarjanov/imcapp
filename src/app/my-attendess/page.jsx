import React from "react";
import GetUserFS from "../../components/GetUserFS";
import MyAttendess from "../../components/MyAttendess";

const MyAttendessPage = async () => {
  const user = await GetUserFS();
  return (
    <div>
      <MyAttendess currentUser={user} />
    </div>
  );
};

export default MyAttendessPage;
