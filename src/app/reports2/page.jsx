"use client";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const daysShort = ["ya", "du", "se", "ch", "pa", "ju", "sh"];

const AttendanceTable = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), currentMonth, 0).getDate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 🏃‍♂️ **Barcha xodimlarni bitta so'rovda olish**
      const employeesSnapshot = await getDocs(collection(db, "users"));
      const employeesList = employeesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(employeesList);

      // 🏃‍♂️ **Barcha davomatlarni bitta so'rovda olish**
      const attendanceQuery = query(
        collection(db, "attendess"),
        where("month", "==", currentMonth) // 🔥 Firestore indekslash shart!
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);
      const attendanceList = attendanceSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 🔥 **Xodimlarning ID bilan bog‘lash**
      const attendanceMap = {};
      attendanceList.forEach(
        ({
          userId,
          date,
          arrivel_time,
          gone_time,
          additional_info,
          ishlagan_soati,
        }) => {
          const dayNumber = new Date(date).getDate();
          if (!attendanceMap[userId]) attendanceMap[userId] = {};
          attendanceMap[userId][dayNumber] = {
            arrivel_time,
            gone_time,
            ishlagan_soati,
          };
        }
      );

      setAttendanceData(attendanceMap);
      setLoading(false);
    } catch (error) {
      console.error("Ma’lumotlarni yuklashda xatolik:", error);
      setLoading(false);
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} soat ${minutes} daqiqa ${seconds} soniya`;
  };

  const renderTableHeader = () => {
    return (
      <tr>
        <th className="border p-2 min-w-[200px] bg-gray-300 sticky left-0 z-10 top-0">
          Xodim
        </th>
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = new Date(today.getFullYear(), currentMonth - 1, i + 1);
          const dayName = daysShort[date.getDay()];
          const isSunday = date.getDay() === 0;
          const isToday = i + 1 === currentDay;

          return (
            <th
              key={i}
              className={`border p-2 text-center min-w-[250px] 
                ${isSunday ? "bg-red-400 text-white" : "bg-gray-100"} 
                ${isToday ? "bg-green-400 text-white" : ""}`}
            >
              {i + 1} <br /> {dayName}
            </th>
          );
        })}
      </tr>
    );
  };

  const renderTableData = () => {
    return employees.map((employee) => (
      <tr key={employee.kindeId} className="hover:bg-gray-100">
        <td className="border p-2 font-medium bg-white sticky left-0 z-50 min-w-[200px]">
          {employee.surname} {employee.name}
        </td>
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dayData = attendanceData[employee.kindeId]?.[day];

          return (
            <td key={day} className="border p-2">
              {dayData ? (
                <Dialog>
                  <DialogTrigger className="bg-blue-500 text-white px-2 py-1 rounded">
                    {dayData.arrivel_time} - {dayData.gone_time}
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Qo'shimcha ma'lumot - {day}</DialogTitle>
                      <br />
                      <p>
                        <strong>Kelgan vaqti:</strong> {dayData.arrivel_time}
                      </p>
                      <p>
                        <strong>Ketgan vaqti:</strong> {dayData.gone_time}
                      </p>
                      <p>
                        <strong>Qo'shimcha ma'lumot:</strong>{" "}
                        {formatTime(dayData.ishlagan_soati) || "Mavjud emas"}
                      </p>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="text-red-500">Kelmagan</div>
              )}
            </td>
          );
        })}
      </tr>
    ));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Xodimlar Davomat Jadvali</h1>
      {loading ? (
        <div className="text-center text-xl font-semibold">
          ⏳ Yuklanmoqda...
        </div>
      ) : (
        <div className="overflow-auto max-h-[80vh] border rounded-lg shadow-md">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-white sticky top-0 z-50">
              {renderTableHeader()}
            </thead>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;
