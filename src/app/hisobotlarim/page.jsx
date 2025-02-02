"use client";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function MyReports() {
  const currentToday = new Date();
  const year = currentToday.getFullYear();
  const month = String(currentToday.getMonth() + 1).padStart(2, "0");
  const day = String(currentToday.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "hisobotlar"),
      where("timestamp", "==", selectedDate)
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
    window.location.reload();
  };

  return (
    <div className="w-full p-6 pb-40">
      <h2 className="text-xl font-semibold mb-4">Mening Hisobotlarim</h2>
      <div className="flex gap-4 mb-4">
        <Input
          type="date"
          className="w-fit focus:outline-none"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <Button onClick={handlePrint}>
          <Printer />
        </Button>
      </div>
      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : reports.length > 0 ? (
        <div>
          <div
            id="printDiv"
            className="max-w-[45%] border min-h-[100vh] shadow-lg rounded-lg mt-3 mx-auto p-10"
          >
            <h1 className="font-bold text-2xl text-center mb-3">
              Hisobot: {selectedDate}
            </h1>
            <div className="grid grid-cols-3">
              <div className="flex items-center gap-4 border-black border py-2 px-4 border-r-0">
                <strong>Naxt:</strong>
                <p>{reports[0]?.naxt?.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4 border-black border py-2 px-4 border-r-0">
                <strong>Plastik:</strong>
                <p>{reports[0]?.plastik?.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4 border-black border py-2 px-4">
                <strong>Umumiy:</strong>
                <p>{reports[0]?.umumiyTushum?.toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-4 border-black border py-2 px-4 border-r-0 border-t-0">
                <strong>Statsionar:</strong>
                <p>{reports[0]?.statsionar?.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4 border-black border py-2 px-4 border-t-0">
                <strong>Ambulator:</strong>
                <p>{reports[0]?.ambulator?.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-t-0">
              <strong>Madaliyev:</strong>
              <p>{reports[0]?.ginekologM?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-t-0">
              <strong>Zarnigor:</strong>
              <p>{reports[0]?.ginekologZ?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-t-0">
              <strong>Nevrolog:</strong>
              <p>{reports[0]?.nevrolog?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-t-0">
              <strong>Terapevt:</strong>
              <p>{reports[0]?.terapevt?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-t-0">
              <strong>Kardiolog:</strong>
              <p>{reports[0]?.kardiolog?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-t-0">
              <strong>Labaratoriya:</strong>
              <p>{reports[0]?.labaratoriya?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-t-0">
              <strong>Uzi:</strong>
              <p>{reports[0]?.uzi?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-t-0">
              <strong>EKG:</strong>
              <p>{reports[0]?.ekg?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-t-0">
              <strong>Fizioterapiya:</strong>
              <p>{reports[0]?.fizioterapiya?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-t-0">
              <strong>Massaj:</strong>
              <p>{reports[0]?.massaj?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-t-0">
              <strong>Xijoma:</strong>
              <p>{reports[0]?.xijoma?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-t-0">
              <strong>Kunduzgi muolaja:</strong>
              <p>{reports[0]?.kunduzgi?.toLocaleString()}</p>
            </div>
            <div className="text-center  py-2 px-4">
              <strong>Statsionat tushumlar</strong>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-b-0">
              <strong>Nevrolog:</strong>
              <p>{reports[0]?.statsinar_nevrolog?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-b-0">
              <strong>Kardiolog:</strong>
              <p>{reports[0]?.statsinar_kardiolog?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-b-0">
              <strong>Terapevt:</strong>
              <p>{reports[0]?.statsinar_terapevt?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4 border-b-0">
              <strong>Madaliyeva:</strong>
              <p>{reports[0]?.statsinar_madaliyeva?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 border-black border py-2 px-4">
              <strong>Zarnigor:</strong>
              <p>{reports[0]?.statsinar_zarnigor?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Hisobot topilmadi</p>
      )}
    </div>
  );
}
