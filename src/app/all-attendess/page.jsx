"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
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

const AllAttendess = () => {
  const [users, setUsers] = useState([]);
  const [attendess, setAttendess] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const userDocs = await getDocs(usersRef);
      const usersData = userDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (err) {
      setError("Foydalanuvchilarni olishda xato yuz berdi.");
    }
  };

  const fetchAttendess = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const attendessRef = collection(db, "attendess");
      const q = query(attendessRef, where("date", "==", date));
      const attendessDocs = await getDocs(q);
      const attendessData = attendessDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAttendess(attendessData);
    } catch (err) {
      setError("Ma'lumotlarni olishda xato yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    fetchAttendess(newDate);
  };

  useEffect(() => {
    fetchUsers();
    fetchAttendess(selectedDate);
  }, [selectedDate]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600); // Soatlar
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Qolgan daqiqalar
    const seconds = totalSeconds % 60; // Qolgan sekundlar

    return `${hours}:${minutes}:${seconds}`;
  };
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Hamma Xodimlar</h1>
      <div className="mb-4">
        <label htmlFor="date" className="block font-medium mb-2">
          Sana tanlang:
        </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="border rounded-md p-2"
        />
      </div>

      {loading ? (
        <div className="text-center">Yuklanmoqda...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="table-auto border-collapse w-full">
            <TableHeader>
              <TableRow>
                <TableCell className="bg-gray-400">Ism</TableCell>
                <TableCell className="bg-gray-400">Email</TableCell>
                <TableCell className="bg-gray-400">Kelgan Vaqti</TableCell>
                <TableCell className="bg-gray-400">Ketgan Vaqti</TableCell>
                <TableCell className="bg-gray-400">Ishlagan Soati</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const userAttendess =
                  attendess.find((a) => a.userId === user.id) || {};
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Link href={`/user/${user.id}`}>
                        {user.surname} {user.name}
                      </Link>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{userAttendess.arrivel_time || "-"}</TableCell>
                    <TableCell>{userAttendess.gone_time || "-"}</TableCell>
                    <TableCell>
                      {userAttendess.ishlagan_soati
                        ? formatTime(userAttendess.ishlagan_soati)
                        : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
              {users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan="5"
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
