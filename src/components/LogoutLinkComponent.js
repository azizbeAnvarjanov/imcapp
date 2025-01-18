import React from "react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
const LogoutLinkComponent = () => {
  return (
    <LogoutLink>
      <Button className="w-[47px] h-[47px] text-2xl" variant="destructive">
        <LogOut />
      </Button>
    </LogoutLink>
  );
};

export default LogoutLinkComponent;
