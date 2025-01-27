"use client";
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../app/firebase";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileDown, Printer, Table2 } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";

const AllAttendess = () => {
  const [users, setUsers] = useState([]);
  const [attendess, setAttendess] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = () => {
    const usersRef = collection(db, "users");
    onSnapshot(usersRef, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    }, (err) => {
      setError("Foydalanuvchilarni olishda xato yuz berdi.");
    });
  };

  const fetchAttendess = (date) => {
    setLoading(true);
    setError(null);
    const attendessRef = collection(db, "attendess");
    const q = query(attendessRef, where("date", "==", date));
    onSnapshot(q, (snapshot) => {
      const attendessData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAttendess(attendessData);
      setLoading(false);
    }, (err) => {
      setError("Ma'lumotlarni olishda xato yuz berdi.");
      setLoading(false);
    });
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
  };

  useEffect(() => {
    fetchUsers();
    fetchAttendess(selectedDate);
  }, [selectedDate]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} soat ${minutes} daqiqa ${seconds} soniya`;
  };

  const vaqtniTekshir = (grafikVaqti, kelganVaqti) => {
    if (!kelganVaqti) {
      return {
        status: "Hali kelmadi",
        bgColor: "",
      };
    }
    const [grafikSoat, grafikDaqiqa] = grafikVaqti.split(":").map(Number);
    const [kelganSoat, kelganDaqiqa] = kelganVaqti.split(":").map(Number);
    const grafikVaqtMinutlarda = grafikSoat * 60 + grafikDaqiqa;
    const kelganVaqtMinutlarda = kelganSoat * 60 + kelganDaqiqa;
    const farq = kelganVaqtMinutlarda - grafikVaqtMinutlarda;
    console.log(farq > 6);
    

    if (farq > 0) {
      return {
        status: formatTime(farq * 60),
        bgColor: "bg-red-500",
      };
    } else if (farq < 0) {
      return {
        status: `${Math.abs(farq)} daqiqa erta keldi.`,
        bgColor: "bg-green-500",
      };
    } else {
      return {
        status: `O'z vaqtida keldi.`,
        bgColor: "",
      };
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Xodimlarning davomatlari - ${selectedDate}`, 14, 10);
    doc.autoTable({
      head: [
        [
          "№",
          "Ism Familiyasi",
          "Kelgan vaqti",
          "Ketkan vaqti",
          "Ishlagan soati",
        ],
      ],
      body: attendess.map((user, i) => [
        i + 1 || "-",
        user.user || "-",
        user.arrivel_time || "-",
        user.gone_time || "-",
        user.ishlagan_soati || "-",
      ]),
    });
    doc.save("Xodimlar-davomati.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      attendess.map((record) => ({
        Sana: record.date || "-",
        Xodim: record.user || "-",
        "Kelgan Vaqti": record.arrivel_time || "-",
        "Ketgan Vaqti": record.gone_time || "-",
        "Ishlagan Soati": record.ishlagan_soati || "-",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Davomatlar");
    XLSX.writeFile(workbook, "Xodimlarning davomatlari.xlsx");
  };

  const handlePrint = () => {
    const printContent = document.getElementById("table-content").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Hamma Xodimlar</h1>
      <div className="mb-4 flex gap-2 w-[250px]">
        <Input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
        <Button onClick={exportToPDF}>
          <FileDown />
        </Button>
        <Button onClick={exportToExcel}>
          <Table2 />
        </Button>
        <Button onClick={handlePrint}>
          <Printer />
        </Button>
      </div>

      {loading ? (
        <div className="text-center">Yuklanmoqda...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div
          className="overflow-x-auto rounded-lg overflow-hidden"
          id="table-content"
        > 
          <Table className="table-auto border-collapse w-full overflow-x-scroll min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableCell className="bg-gray-400 font-bold">№</TableCell>
                <TableCell className="bg-gray-400 font-bold">Ism</TableCell>
                <TableCell className="bg-gray-400 font-bold">Email</TableCell>
                <TableCell className="bg-gray-400 font-bold">
                  Ish grafigi
                </TableCell>
                <TableCell className="bg-gray-400 font-bold">
                  Kelgan Vaqti
                </TableCell>
                <TableCell className="bg-gray-400 font-bold">
                  Ketgan Vaqti
                </TableCell>
                <TableCell className="bg-gray-400 font-bold">
                  Ishlagan Soati
                </TableCell>
                <TableCell className="bg-gray-400 font-bold">Status</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, i) => {
                const userAttendess =
                  attendess.find((a) => a.userId === user.id) || {};
                const arrivalStatus = vaqtniTekshir(
                  user.workSchedule?.defaultStartTime || "08:00",
                  userAttendess.arrivel_time || null
                );

                return (
                  <TableRow
                    key={user.id}
                    
                  >
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      <Link href={`/user/${user.id}`}>
                        {user.surname} {user.name}
                      </Link>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.workSchedule?.defaultStartTime} -{" "}
                      {user.workSchedule?.defaultEndTime}
                    </TableCell>
                    <TableCell className={arrivalStatus.bgColor}>
                      {userAttendess.arrivel_time || "Hali kelmadi"}
                    </TableCell>
                    <TableCell>{userAttendess.gone_time || "-"}</TableCell>
                    <TableCell>
                      {userAttendess.ishlagan_soati
                        ? formatTime(userAttendess.ishlagan_soati)
                        : "-"}
                    </TableCell>
                    <TableCell>{arrivalStatus.status}</TableCell>
                  </TableRow>
                );
              })}
              {users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan="7"
                    className="text-center py-4 text-gray-500"
                  >
                    Ma'lumotlar topilmadi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AllAttendess;
