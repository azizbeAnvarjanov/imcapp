"use client"
import React from "react";
import withIpCheck from "../app/hoc/withIpCheck";

const MainPage = ({ user }) => {
  return <div>Hello {user?.family_name}</div>;
};

export default withIpCheck(MainPage);
