"use client";
import React from "react";
import withIpCheck from "../app/hoc/withIpCheck";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "./ui/button";

const MainPage = ({ user, role }) => {
  
  return (
    <div>
      Hello {user ? <>{user.family_name}</>:<></>} <br />
      Role {role ? <>{role}</>:<></>} <br />
      <LogoutLink>
        <Button variant="destructive">Log out</Button>
      </LogoutLink>
    </div>
  );
};

export default withIpCheck(MainPage);
