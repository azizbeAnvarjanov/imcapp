"use client";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "hisobotlar"),
      where("timestamp", ">=", new Date(selectedDate + "T00:00:00")),
      where("timestamp", "<", new Date(selectedDate + "T23:59:59"))
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedDate]);

  const handlePrint = () => {
    const printContents = document.getElementById("printDiv").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Sahifani qayta yuklash
  };
  console.log(reports[0]?.ambulator);

  return (
    <div className="w-full p-6">
      <h2 className="text-xl font-semibold mb-4">Mening Hisobotlarim</h2>
      <div className="flex gap-4 mb-4">
        <Input
          className="w-[150px]"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <Button onClick={handlePrint}>Chop etish</Button>
      </div>
      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : reports.length > 0 ? (
        <div>
          <div
            id="printDiv"
            className="max-w-[40%] border min-h-[100vh] shadow-lg rounded-lg mt-3 mx-auto p-10"
          >
            <div className="mb-2 pl-1">
              <h1 className="font-bold text-2xl text-center mb-3">Hisobot</h1>
              <div className="border py-3 px-5 w-[200px] text-center rounded-md">
                <strong>Sana:</strong> {selectedDate}
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="flex items-center gap-4 border-black border py-2 px-4">
                <strong>Naxt:</strong>
                <p>{reports[0]?.naxt?.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4 border-black border py-2 px-4">
                <strong>Plastik:</strong>
                <p>{reports[0]?.plastik?.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4 border-black border py-2 px-4">
                <strong>Umumiy:</strong>{" "}
                <p>{reports[0]?.umumiyTushum?.toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                <strong>Statsinoar:</strong>
              </div>
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                {reports[0]?.statsionar?.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                <strong>Abmbulator:</strong>
              </div>
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                {reports[0]?.ambulator?.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                <strong>Madaliyeva:</strong>
              </div>
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                {reports[0]?.ginekologM?.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2">
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                <strong>Terapevt:</strong>
              </div>
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                {reports[0]?.terapevt?.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                <strong>Zarnigor:</strong>
              </div>
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                {reports[0]?.ginekologZ?.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                <strong>Nevrolog:</strong>
              </div>
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                {reports[0]?.nevrolog?.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                <strong>Kardiolog:</strong>
              </div>
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                {reports[0]?.kardiolog?.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                <strong>Labaratoriya:</strong>
              </div>
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                {reports[0]?.labaratoriya?.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                <strong>UZI:</strong>
              </div>
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                {reports[0]?.uzi?.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                <strong>EKG:</strong>
              </div>
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                {reports[0]?.ekg?.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                <strong>Fizioterapiya:</strong>
              </div>
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                {reports[0]?.fizioterapiya?.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                <strong>Massaj:</strong>
              </div>
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                {reports[0]?.massaj?.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                <strong>Xijoma:</strong>
              </div>
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                {reports[0]?.xijoma?.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-4 border-black border-b  py-2 px-4">
                <strong>Kunduzgi muolaja:</strong>
              </div>
              <div className="flex items-center gap-4 border-black border-b py-2 px-4">
                {reports[0]?.kunduzgi?.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Hisobot topilmadi</p>
      )}
    </div>
  );
}
