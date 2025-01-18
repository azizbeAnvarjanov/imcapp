"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table2, Printer, FileDown, Pen, Settings2 } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Input } from "@/components/ui/input";

import EditShedule from "../../components/EditShedule";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");

  const fetchUsers = async () => {
    try {
      const usersCollectionRef = collection(db, "users");
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

  const startEditing = (user) => {
    setEditingUser(user.id);
    setStartTime(user.workSchedule?.defaultStartTime || "08:00");
    setEndTime(user.workSchedule?.defaultEndTime || "17:00");
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setStartTime("08:00");
    setEndTime("17:00");
  };

  const saveSchedule = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        "workSchedule.defaultStartTime": startTime,
        "workSchedule.defaultEndTime": endTime,
      });
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setError("Ish grafigini yangilashda xato yuz berdi.");
      console.error(err);
    } finally {
      cancelEditing();
    }
  };

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">
          Barcha foydalanuvchilar - {users.length}
        </h1>
        {/* Export buttons here */}
      </div>
      {users.length > 0 ? (
        <div className="overflow-x-auto" id="table-content">
          <Table className="w-full border-collapse border border-gray-200 overflow-x-scroll min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableCell className="bg-gray-500 text-white font-bold">
                  №
                </TableCell>
                <TableCell className="bg-gray-500 text-white font-bold">
                  Ismi
                </TableCell>
                <TableCell className="bg-gray-500 text-white font-bold">
                  Familiyasi
                </TableCell>
                <TableCell className="bg-gray-500 text-white font-bold">
                  Email
                </TableCell>
                <TableCell className="bg-gray-500 text-white font-bold">
                  Ro'li
                </TableCell>
                <TableCell className="bg-gray-500 text-white font-bold">
                  Ish grafigi
                </TableCell>
                <TableCell className="bg-gray-500 text-white font-bold">
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
                  <TableCell className="border-none p-2 flex items-center justify-between">
                    {user.workSchedule.defaultStartTime || "Ma'lumot yo'q"}
                    {` - `}
                    {user.workSchedule.defaultEndTime || "Ma'lumot yo'q"}
                  </TableCell>
                  <TableCell className="border p-2 text-center">
                    <Link
                      href={`/user/${user.id}`}
                      className="text-blue-500 underline hover:text-blue-700 ml-2"
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
