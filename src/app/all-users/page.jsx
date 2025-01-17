"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
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
import { Table2, Printer, FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Foydalanuvchilarni olish
  const fetchUsers = async () => {
    try {
      const usersCollectionRef = collection(db, "users"); // "users" - kolleksiya nomi
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (err) {
      setError("Foydalanuvchilarni olishda xato yuz berdi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Xodimlar", 14, 10);
    doc.autoTable({
      head: [["№", "Ismi", "Familiyasi", "Email", "Ro'li"]],
      body: users.map((user, i) => [
        i + 1 || "-",
        user.name || "-",
        user.surname || "-",
        user.email || "-",
        user.role || "-",
      ]),
    });

    doc.save("Xodimlar.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      users.map((user, i) => ({
        "№": i + 1 || "-",
        Ismi: user.name || "-",
        Familiyasi: user.surname || "-",
        Email: user.email || "-",
        Roli: user.role || "-",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Xodimlar");
    XLSX.writeFile(workbook, "xodimlar.xlsx");
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
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">
          Barcha foydalanuvchilar - {users.length}
        </h1>
        <div className="flex gap-2">
          <Button onClick={handlePrint}>
            <Printer />
          </Button>
          <Button onClick={exportToExcel}>
            <Table2 />
          </Button>
          <Button onClick={exportToPDF}>
            <FileDown />
          </Button>
        </div>
      </div>
      {users.length > 0 ? (
        <div className="overflow-x-auto" id="table-content">
          <Table className="w-full border-collapse border border-gray-200">
            <TableHeader>
              <TableRow>
                <TableCell className="bg-gray-500 text-white">№</TableCell>
                <TableCell className="bg-gray-500 text-white">Ismi</TableCell>
                <TableCell className="bg-gray-500 text-white">
                  Familiyasi
                </TableCell>
                <TableCell className="bg-gray-500 text-white">Email</TableCell>
                <TableCell className="bg-gray-500 text-white">Ro'li</TableCell>
                <TableCell className="bg-gray-500 text-white">
                  Amallar
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="border p-2 text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell className="border p-2">
                    {user.name || "Ma'lumot yo'q"}
                  </TableCell>
                  <TableCell className="border p-2">
                    {user.surname || "Ma'lumot yo'q"}
                  </TableCell>
                  <TableCell className="border p-2">
                    {user.email || "Ma'lumot yo'q"}
                  </TableCell>
                  <TableCell className="border p-2">
                    {user.role || "Ma'lumot yo'q"}
                  </TableCell>
                  <TableCell className="border p-2 text-center">
                    <Link
                      href={`/user/${user.id}`}
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      Batafsil
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div>Foydalanuvchilar mavjud emas.</div>
      )}
    </div>
  );
};

export default AllUsers;
