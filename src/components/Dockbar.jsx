import Link from "next/link";
import React from "react";
import {
  MessageCircleQuestion,
  House,
  UsersRound,
  Tool,
  CalendarCheck,
  LayoutDashboard,
  CircleUserRound,
  ListTodo,
  DollarSign,
  Wallet,
  BookMarked,
} from "lucide-react";

const Dockbar = ({ role, user }) => {
  return (
    <div className="fixed bg-white bottom-5 p-3 md:p-4 border shadow-lg left-[50%] -translate-x-[50%] rounded-xl flex items-center gap-2 md:gap-4">
      {role ? (
        <>
          {role[0]?.name === "Admin" ? (
            <>
              <Link
                className="h-[38px] border w-[38px] md:w-[50px] md:h-[50px] rounded-lg flex items-center justify-center hover:-translate-y-3 hover:shadow-lg transition-all"
                href="/"
              >
                <House />
              </Link>
              <Link
                className="h-[38px] border w-[38px] md:w-[50px] md:h-[50px] rounded-lg flex items-center justify-center hover:-translate-y-3 hover:shadow-lg transition-all"
                href="/dashboard"
              >
                <LayoutDashboard />
              </Link>
              <Link
                className="h-[38px] border w-[38px] md:w-[50px] md:h-[50px] rounded-lg flex items-center justify-center hover:-translate-y-3 hover:shadow-lg transition-all"
                href="/my-attendess"
              >
                <CalendarCheck />
              </Link>
              <Link
                className="h-[38px] border w-[38px] md:w-[50px] md:h-[50px] rounded-lg flex items-center justify-center hover:-translate-y-3 hover:shadow-lg transition-all"
                href="/cust-dev"
              >
                <MessageCircleQuestion />
              </Link>
              <Link
                className="h-[38px] border w-[38px] md:w-[50px] md:h-[50px] rounded-lg flex items-center justify-center hover:-translate-y-3 hover:shadow-lg transition-all"
                href="/all-attendess"
              >
                <ListTodo />
              </Link>
              <Link
                className="h-[38px] border w-[38px] md:w-[50px] md:h-[50px] rounded-lg flex items-center justify-center hover:-translate-y-3 hover:shadow-lg transition-all"
                href="/all-users"
              >
                <UsersRound />
              </Link>
              <Link
                className="h-[38px] border w-[38px] md:w-[50px] md:h-[50px] rounded-lg flex items-center justify-center hover:-translate-y-3 hover:shadow-lg transition-all"
                href="/my-profile"
              >
                <CircleUserRound />
              </Link>
              <Link
                className="h-[38px] border w-[38px] md:w-[50px] md:h-[50px] rounded-lg flex items-center justify-center hover:-translate-y-3 hover:shadow-lg transition-all"
                href="/kassa"
              >
                <Wallet />
              </Link>
            </>
          ) : (
            <>
              <Link
                className="h-[38px] border w-[38px] md:w-[50px] md:h-[50px] rounded-lg flex items-center justify-center hover:-translate-y-3 hover:shadow-lg transition-all"
                href="/"
              >
                <House />
              </Link>

              <Link
                className="h-[38px] border w-[38px] md:w-[50px] md:h-[50px] rounded-lg flex items-center justify-center hover:-translate-y-3 hover:shadow-lg transition-all"
                href="/my-attendess"
              >
                <CalendarCheck />
              </Link>
              {user?.email === "imamaliyevaaziza0@gmail.com" && (
                <>
                  <Link
                    className="h-[38px] border w-[38px] md:w-[50px] md:h-[50px] rounded-lg flex items-center justify-center hover:-translate-y-3 hover:shadow-lg transition-all"
                    href="/kassa"
                  >
                    <Wallet />
                  </Link>
                  <Link
                    className="h-[38px] border w-[38px] md:w-[50px] md:h-[50px] rounded-lg flex items-center justify-center hover:-translate-y-3 hover:shadow-lg transition-all"
                    href="/hisobotlarim"
                  >
                    <BookMarked />
                  </Link>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Dockbar;
