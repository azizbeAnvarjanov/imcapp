"use client";
import { collection, onSnapshot, query, where, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ReportPage = () => {
  const [attendess, setAttendess] = useState([]);
  const [groupedAttendess, setGroupedAttendess] = useState({});
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData = {};
      usersSnapshot.forEach((doc) => {
        usersData[doc.id] = doc.data();
      });
      setUsers(usersData);
    };

    const fetchAttendess = () => {
      const attendessRef = collection(db, "attendess");
      const q = query(attendessRef, where("month", "==", 1));
      onSnapshot(q, (snapshot) => {
        const attendessData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const groupedData = {};
        attendessData.forEach((item) => {
          const userInfo = users[item.userId] || { user: "Noma’lum" };
          const fullName = userInfo.user;

          if (!groupedData[fullName]) {
            groupedData[fullName] = [];
          }
          groupedData[fullName].push({
            date: item.date,
            timeIn: item.arrivel_time,
            timeOut: item.gone_time,
            ishlagansoati: item.ishlagan_soati,
            status: item.status,
          });
        });

        Object.keys(groupedData).forEach((key) => {
          groupedData[key].sort((a, b) => new Date(a.date) - new Date(b.date));
        });

        setGroupedAttendess(groupedData);
      });
    };

    fetchUsers().then(fetchAttendess);
  }, []);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours} soat ${minutes} daqiqa`;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Attendance Report", 14, 10);

    const tableData = [];
    Object.entries(groupedAttendess).forEach(([fullName, records]) => {
      records.forEach((record) => {
        tableData.push([
          fullName,
          record.date,
          record.timeIn,
          record.timeOut,
          formatTime(record.ishlagansoati),
        ]);
      });
    });

    doc.autoTable({
      head: [["Ism Familiya", "Sana", "Kelish vaqti", "Ketish vaqti", "Ishlagan soati"]],
      body: tableData,
    });

    doc.save("attendance_report.pdf");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Attendance Report</h2>
      <button onClick={downloadPDF} className="mb-4 p-2 bg-blue-500 text-white rounded">
        PDF yuklab olish
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Ism Familiya</th>
              <th className="border p-2 text-left">Sanalar</th>
              <th className="border p-2 text-left">Umumiy Ishlagan Soati</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedAttendess).map(([fullName, records]) => {
              const totalWorkedSeconds = records.reduce((acc, rec) => acc + Number(rec.ishlagansoati), 0);
              return (
                <tr key={fullName}>
                  <td className="border p-2 align-top font-medium">{fullName}</td>
                  <td className="border p-2">
                    {records.map((record, index) => (
                      <div key={index} className="mb-1">
                        <span className="font-semibold">
                          <strong>{record.date}</strong>:
                        </span>{"   - "}
                        {record.timeIn} - {record.timeOut}
                      </div>
                    ))}
                  </td>
                  <td className="border p-2 align-top">{formatTime(totalWorkedSeconds)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportPage;
