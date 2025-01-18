import { ShieldX } from "lucide-react";
import React from "react";

const AccessDenied = () => {
  return (
    <div className="flex items-center justify-center flex-col h-screen p-4 text-center">
      <ShieldX color="red" size="200px" />
      <h1 className="text-red-500 font-bold text-3xl">Ruxsat yo'q</h1>
      <p>
        Iltimos ishhona borib ishhonaning wiri tarmog'i orqali tizimga kiring !
      </p>
    </div>
  );
};

export default AccessDenied;
