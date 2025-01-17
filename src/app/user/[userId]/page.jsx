"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import MyAttendess from "../../../components/MyAttendess";
import EditSchedule from "@/components/EditShedule";

const UserInfos = () => {
  const params = useParams();
  const userId = params.userId;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [attendances, setAttendances] = useState([]);

  // Real-time listener for user data
  useEffect(() => {
    if (userId) {
      const userDocRef = doc(db, "users", userId);
      const unsubscribe = onSnapshot(
        userDocRef,
        (doc) => {
          if (doc.exists()) {
            setUser(doc.data());
          } else {
            setError("Foydalanuvchi topilmadi.");
          }
          setLoading(false);
        },
        (err) => {
          setError("Ma'lumotlarni olishda xato yuz berdi.");
          setLoading(false);
        }
      );

      // Cleanup the listener on component unmount
      return () => unsubscribe();
    }
  }, [userId]);

  // Fetch user attendances
  const fetchUserAttendances = async (id, month) => {
    try {
      const attendancesQuery = query(
        collection(db, "attendances"),
        where("userId", "==", id),
        where("month", "==", month)
      );
      const querySnapshot = await getDocs(attendancesQuery);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAttendances(data);
    } catch (err) {
      console.error("Davomatlarni olishda xato yuz berdi:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserAttendances(userId, selectedMonth);
    }
  }, [userId, selectedMonth]);

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Foydalanuvchi haqida ma'lumotlar
      </h1>
      {user ? (
        <div>
          <div className="bg-gray-100 p-4 rounded shadow mb-4">
            <p>
              <strong>Ismi:</strong> {user.name || "Ma'lumot yo'q"}
            </p>
            <p>
              <strong>Familiyasi:</strong> {user.surname || "Ma'lumot yo'q"}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "Ma'lumot yo'q"}
            </p>
            <p>
              <strong>Ro'li:</strong> {user.role || "Ma'lumot yo'q"}
            </p>
            <p>
              <strong>Ish grafigi:</strong>{" "}
              {user.workSchedule?.defaultStartTime || "Ma'lumot yo'q"} -{" "}
              {user.workSchedule?.defaultEndTime || "Ma'lumot yo'q"}
            </p>
          </div>

          {/* Edit Schedule Component */}
          <EditSchedule userId={userId} />

          <MyAttendess currentUser={user} />
        </div>
      ) : (
        <div>Foydalanuvchi ma'lumotlari topilmadi.</div>
      )}
    </div>
  );
};

export default UserInfos;
