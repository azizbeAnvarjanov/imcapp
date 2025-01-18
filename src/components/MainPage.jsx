"use client";
import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import GetUserWorkSchedule from "./GetUserWorkSchedule";

import withIpCheck from "../app/hoc/withIpCheck";
import { db } from "../app/firebase";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const MainPage = ({ user, role }) => {
  const [loading, setLoading] = useState(false);
  const [isArriveDisabled, setIsArriveDisabled] = useState(false);
  const [isDepartDisabled, setIsDepartDisabled] = useState(false);
  const [todayStatus, setTodayStatus] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [defaultEndTime, setDefaultEndTime] = useState("");
  const [defaultStartTime, setDefaultStartTime] = useState("");

  const handleArrive = async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const time = new Date().toLocaleTimeString(); // HH:MM:SS format
    const attendessRef = collection(db, "attendess");

    try {
      const q = query(
        attendessRef,
        where("userId", "==", user?.id),
        where("date", "==", today)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error("Bugungi kunga kelish vaqti allaqachon yozilgan!");
        setIsArriveDisabled(true);
        return;
      }

      const currentMonth = new Date().getMonth() + 1;

      await addDoc(attendessRef, {
        arrivel_time: time,
        gone_time: null,
        user: `${user?.family_name} ${user?.given_name}`,
        email: user?.email,
        date: today,
        userId: user?.id,
        ishlagan_soati: null,
        month: currentMonth,
      });

      toast.success("Bazaga kelish vaqti yozildi.");
      setIsArriveDisabled(true);
    } catch (error) {
      toast.error("Xato yuz berdi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDepart = async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const time = new Date().toLocaleTimeString();
    const attendessRef = collection(db, "attendess");

    try {
      const q = query(
        attendessRef,
        where("userId", "==", user?.id),
        where("date", "==", today)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Bugungi kun uchun kelish vaqti yozilmagan!");
        return;
      }

      if (!querySnapshot.docs.length > 0) {
        return;
      }

      const docId = querySnapshot.docs[0].id;
      const docRef = doc(db, "attendess", docId);
      const data = querySnapshot.docs[0].data();

      const [
        arriveHours,
        arriveMinutes,
        arriveSeconds,
      ] = data.arrivel_time.split(":").map(Number);
      const [departHours, departMinutes, departSeconds] = time
        .split(":")
        .map(Number);

      const arriveInSeconds =
        arriveHours * 3600 + arriveMinutes * 60 + arriveSeconds;
      const departInSeconds =
        departHours * 3600 + departMinutes * 60 + departSeconds;
      const workedSeconds = departInSeconds - arriveInSeconds;

      await updateDoc(docRef, {
        gone_time: time,
        ishlagan_soati: workedSeconds,
      });

      toast.success(
        `Bazaga ketish vaqti yozildi. Siz ${Math.floor(
          workedSeconds / 3600
        )} soat, ${(workedSeconds % 3600) / 60} daqiqa, ${
          workedSeconds % 60
        } sekund ishladingiz.`
      );
      setIsDepartDisabled(true);
    } catch (error) {
      toast.error("Xato yuz berdi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkButtonState = async () => {
    const today = new Date().toISOString().split("T")[0];
    const attendessRef = collection(db, "attendess");

    try {
      const q = query(
        attendessRef,
        where("userId", "==", user?.id),
        where("date", "==", today)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setTodayStatus(data);

          if (data.arrivel_time) {
            setIsArriveDisabled(true);
          }
          if (data.gone_time) {
            setIsDepartDisabled(true);
          }
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Tugma holatini tekshirishda xato: ", error);
    }
  };

  const updateCurrentTime = () => {
    const now = new Date();
    setCurrentTime(
      now.toLocaleTimeString("en-US", { hour12: false }) // HH:MM:SS format
    );
  };
  const getuserTimes = async () => {
    const data = await GetUserWorkSchedule(user.id);
    setDefaultEndTime(data?.defaultEndTime);
    setDefaultStartTime(data?.defaultStartTime);
  };

  useEffect(() => {
    getuserTimes();
    checkButtonState();
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, [user]);
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} soat ${minutes} daqiqa ${seconds} soniya`;
  };

  const vaqtniTekshir = (grafikVaqti, kelganVaqti) => {
    if (!kelganVaqti) {
      return {
        status: "Hali kelmadingiz",
        bgColor: "",
      };
    }
    const [grafikSoat, grafikDaqiqa] = grafikVaqti.split(":").map(Number);
    const [kelganSoat, kelganDaqiqa] = kelganVaqti.split(":").map(Number);
    const grafikVaqtMinutlarda = grafikSoat * 60 + grafikDaqiqa;
    const kelganVaqtMinutlarda = kelganSoat * 60 + kelganDaqiqa;
    const farq = kelganVaqtMinutlarda - grafikVaqtMinutlarda;

    if (farq > 0) {
      return {
        status: `${formatTime(farq * 60)} kech qoldingiz`,
        color: "text-white",
        bg: "bg-red-500",
      };
    } else if (farq < 0) {
      return {
        status: `${Math.abs(farq)} daqiqa erta keldingiz.`,
        color: "text-white",
        bg: "bg-green-500",
      };
    } else {
      return {
        status: `O'z vaqtida keldingiz.`,
        color: "text-white",
        bg: "bg-green-500",
      };
    }
  };

  const arrivalStatus = vaqtniTekshir(
    defaultStartTime || "09:00",
    todayStatus?.arrivel_time || null
  );
  return (
    <div className="p-4 flex flex-col justify-center md:justify-start md:p-10  main_page h-[100vh] text-center">
      <h1 className="text-[3em] sm:text-[3em] md:text-[8em] font-bold text-white">
        {currentTime}
      </h1>
      <h1 className="text-[1.5em] sm:text-[2em] font-bold mb-4 text-wrap text-white">
        {user?.family_name} {user?.given_name}
      </h1>
      {todayStatus && (
        <div className="mb-4 mx-auto text-white lg:w-[900px] text-left grid lg:grid-cols-2 gap-4">
          <p className={` py-2 px-5 rounded-md shadow-lg ${arrivalStatus.bg}`}>
            <strong>Status:</strong>{" "}
            <span className={arrivalStatus.color}>{arrivalStatus.status}</span>
          </p>
          <p className="bg-white text-black py-2 px-5 rounded-md shadow-lg">
            <strong>Ish grafigi:</strong> {defaultStartTime} - {defaultEndTime}
          </p>
          <p className="bg-white text-black py-2 px-5 rounded-md shadow-lg">
            <strong>Keldingiz:</strong>{" "}
            {todayStatus.arrivel_time || "Hali kelmadingiz"}
          </p>
          <p className="bg-white text-black py-2 px-5 rounded-md shadow-lg">
            <strong>Ketdingiz:</strong>{" "}
            {todayStatus.gone_time || "Hali ketmadingiz"}
          </p>
          <p className="bg-white text-black py-2 px-5 rounded-md shadow-lg">
            <strong>Ishlagan soati:</strong>{" "}
            {todayStatus.ishlagan_soati ? (
              <>{formatTime(todayStatus.ishlagan_soati)}</>
            ) : (
              "Hali ma'lumot yo'q"
            )}
          </p>
        </div>
      )}

      <div className="flex gap-3 mx-auto items-center justify-center">
        <Button
          className={`${
            isArriveDisabled ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600"
          }`}
          onClick={handleArrive}
          disabled={isArriveDisabled || loading}
        >
          Keldim
        </Button>
        <Button
          className={`${
            isDepartDisabled ? "bg-gray-600 cursor-not-allowed" : "bg-red-600"
          }`}
          onClick={handleDepart}
          disabled={isDepartDisabled || loading}
        >
          Ketdim
        </Button>
      </div>
    </div>
  );
};

export default withIpCheck(MainPage);
