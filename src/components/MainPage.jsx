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
import withIpCheck from "../app/hoc/withIpCheck";
import KettimModal from "@/components/KettimModal";
import { db } from "../app/firebase";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Image from "next/image";
import GetUserWorkSchedule from "./GetUserWorkSchedule";
import { ClockArrowDown, ClockArrowUp } from "lucide-react";

const MainPage = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [todayStatus, setTodayStatus] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [defaultEndTime, setDefaultEndTime] = useState("");
  const [defaultStartTime, setDefaultStartTime] = useState("");

  const currentToday = new Date();
  const year = currentToday.getFullYear();
  const month = String(currentToday.getMonth() + 1).padStart(2, "0");
  const day = String(currentToday.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  const handleArrive = async () => {
    setLoading(true);
    const time = new Date().toLocaleTimeString();
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
        return;
      }

      await addDoc(attendessRef, {
        arrivel_time: time,
        gone_time: null,
        user: `${user?.family_name} ${user?.given_name}`,
        email: user?.email,
        date: today,
        userId: user?.id,
        ishlagan_soati: null,
        month: new Date().getMonth() + 1,
      });

      toast.success("Bazaga kelish vaqti yozildi.");
    } catch (error) {
      toast.error("Xato yuz berdi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDepart = async () => {
    setLoading(true);
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

      toast.success(`Bazaga ketish vaqti yozildi.`);
      setIsOpen(false);
    } catch (error) {
      toast.error("Xato yuz berdi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkButtonState = () => {
    setDataLoading(true);
    const attendessRef = collection(db, "attendess");

    try {
      const q = query(
        attendessRef,
        where("userId", "==", user?.id || user?.kindeId),
        where("date", "==", today)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          setTodayStatus(snapshot.docs[0].data());
          setDataLoading(false);
        } else {
          setTodayStatus(null);
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Tugma holatini tekshirishda xato: ", error);
    }
  };

  const updateCurrentTime = () => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));
  };

  const getuserTimes = async () => {
    setDataLoading(true);
    const data = await GetUserWorkSchedule(user.id);
    setDefaultEndTime(data?.defaultEndTime);
    setDefaultStartTime(data?.defaultStartTime);
  };

  useEffect(() => {
    checkButtonState();
    getuserTimes();
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const vaqtniTekshir = (
    grafigKelishvaqti,
    kelganVaqti,
    grafigKetishvaqti,
    ketkanvaqti
  ) => {
    if (!kelganVaqti) {
      return {
        status: "Hali kelmadingiz",
        status2: "Hali ketmadingiz",
        color: "",
        color2: "",
        bg: "",
      };
    }

    const [grafikKelishSoat, grafikKelishDaqiqa] = grafigKelishvaqti
      .split(":")
      .map(Number);
    const [kelganSoat, kelganDaqiqa] = kelganVaqti.split(":").map(Number);
    const grafikKelishVaqtMinutlarda =
      grafikKelishSoat * 60 + grafikKelishDaqiqa;
    const kelganVaqtMinutlarda = kelganSoat * 60 + kelganDaqiqa;
    const kelishFarq = kelganVaqtMinutlarda - grafikKelishVaqtMinutlarda;

    let status = "";
    let status2 = "";
    let color = "";
    let color2 = "";
    let bg = "";

    if (kelishFarq > 0) {
      status += `${formatTime(kelishFarq * 60)} kech keldingiz. `;
      color = "text-red-500";
      bg = "bg-red-500";
    } else if (kelishFarq < 0) {
      status += `${formatTime(Math.abs(kelishFarq) * 60)} erta keldingiz. `;
      color = "text-green-500";
      bg = "bg-green-500";
    } else {
      status += `O'z vaqtida keldingiz. `;
      color = "text-white";
      bg = "bg-green-500";
    }

    if (ketkanvaqti) {
      const [grafikKetishSoat, grafikKetishDaqiqa] = grafigKetishvaqti
        .split(":")
        .map(Number);
      const [ketkanSoat, ketkanDaqiqa] = ketkanvaqti.split(":").map(Number);
      const grafikKetishVaqtMinutlarda =
        grafikKetishSoat * 60 + grafikKetishDaqiqa;
      const ketkanVaqtMinutlarda = ketkanSoat * 60 + ketkanDaqiqa;
      const ketishFarq = ketkanVaqtMinutlarda - grafikKetishVaqtMinutlarda;

      if (ketishFarq > 0) {
        status2 += `${formatTime(ketishFarq * 60)} kech ketdingiz.`;
        color2 = "text-green-500";
        bg = "bg-red-500";
      } else if (ketishFarq < 0) {
        status2 += `${formatTime(Math.abs(ketishFarq) * 60)} erta ketdingiz.`;
        color2 = "text-red-500";
        bg = "bg-green-500";
      } else {
        status2 += `O'z vaqtida ketdingiz.`;
      }
    } else {
      status2 += "Hali ketkadizngiz !";
    }

    return { status, status2, color, color2, bg };
  };

  const arrivalStatus = vaqtniTekshir(
    defaultStartTime || "08:00",
    todayStatus?.arrivel_time || null,
    defaultEndTime || "17:00",
    todayStatus?.gone_time || null
  );

  const bugun = new Date();

  // Kun nomlarini olish uchun array
  const kunlar = [
    "Yakshanba",
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
  ];

  // Sana elementlarini olish
  const yil = bugun.getFullYear();
  const oy = bugun.getMonth() + 1; // getMonth() 0-based, shuning uchun 1 qo'shamiz
  const kun = bugun.getDate();
  const kunNomi = kunlar[bugun.getDay()];

  const isToday = `${kunNomi}, ${kun}-${oy}-${yil}`;

  return (
    <div className="p-4 flex flex-col justify-center md:justify-start md:p-10 main_page h-[100vh]">
      <div
        className={`mb-4 h-[40px] w-[95%] md:w-[30%] rounded-full bg-black text-white flex gap-5 fixed left-[50%] -translate-x-[50%] text-[12px] sm:text-sm top-5 items-center justify-center`}
      >
        <p className={`${arrivalStatus.color} flex items-center gap-2`}>
          <ClockArrowDown size={18} />
          {arrivalStatus.status}
        </p>{" "}
        <p className={`${arrivalStatus.color2} flex items-center gap-2`}>
          <ClockArrowUp size={18} />
          {arrivalStatus.status2}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center h-screen ">
        <h1 className="text-[1.5em] sm:text-[2em] font-bold text-wrap flex items-center mx-auto">
          {currentTime}
        </h1>
        {isToday}
        <h1 className="text-[1.5em] sm:text-[3em] font-bold text-wrap flex items-center mx-auto">
          Salom {user?.given_name}{" "}
          <div className="w-[40px] h-[40px] md:w-[80px] md:h-[80px] relative">
            <Image fill src="/hi.png" className="object-contain mb-2" alt="" />
          </div>
          {/* <span className="text-3xl">{today}</span> */}
        </h1>

        <div className="my-5">
          {!todayStatus?.arrivel_time ? (
            <>
              <Button
                className={`bg-blue-600 w-[200px] h-[200px] !rounded-full keldim_btn text-2xl`}
                onClick={handleArrive}
                disabled={loading}
              >
                Keldim
              </Button>
            </>
          ) : (
            !todayStatus?.gone_time && (
              <div>
                <KettimModal
                  handleDepart={handleDepart}
                  loading={loading}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                />
              </div>
            )
          )}
        </div>

        <div className="mb-4 mx-auto flex gap-2 md:gap-5">
          <div className=" text-black md:py-2 md:px-5 rounded-md w-[100px] md:w-[150px] text-center grid">
            <div className="w-[30px] h-[30px] relative md:w-[50px] md:h-[50px] mx-auto mb-2">
              <Image
                fill
                src="/1.png"
                className="object-contain mb-2 mx-auto"
                alt=""
              />
            </div>
            <p className={arrivalStatus.color}>
              {todayStatus?.arrivel_time || "--:--"}
            </p>
            <p>Keldingiz</p>
          </div>
          <div className=" text-black md:py-2 md:px-5 rounded-md w-[100px] md:w-[150px] text-center grid">
            <div className="w-[30px] h-[30px] relative md:w-[50px] md:h-[50px] mx-auto mb-2">
              <Image
                fill
                src="/2.png"
                className="object-contain mb-2 mx-auto"
                alt=""
              />
            </div>
            <p className={arrivalStatus.color2}>
              {todayStatus?.gone_time || "--:--"}
            </p>
            <p>Ketdingiz</p>
          </div>
          <div className=" text-black md:py-2 md:px-5 rounded-md w-[100px] md:w-[150px] text-center grid">
            <div className="w-[30px] h-[30px] relative md:w-[50px] md:h-[50px] mx-auto mb-2">
              <Image
                fill
                src="/3.png"
                className="object-contain mb-2 mx-auto"
                alt=""
              />
            </div>
            <p>
              {todayStatus?.ishlagan_soati ? (
                <>{formatTime(todayStatus?.ishlagan_soati)}</>
              ) : (
                "--:--"
              )}
            </p>
            <p>Ishlagan soat </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
