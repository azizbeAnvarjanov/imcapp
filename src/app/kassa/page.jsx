"use client";
import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "../firebase";
import { Label } from "@/components/ui/label";

export default function KassaForm() {
  const currentToday = new Date();
  const year = currentToday.getFullYear();
  const month = String(currentToday.getMonth() + 1).padStart(2, "0");
  const day = String(currentToday.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;
  const [data, setData] = useState({
    naxt: "",
    plastik: "",
    statsionar: "",
    ambulator: "",
    ginekologZ: "",
    ginekologM: "",
    terapevt: "",
    nevrolog: "",
    kardiolog: "",
    labaratoriya: "",
    uzi: "",
    ekg: "",
    fizioterapiya: "",
    massaj: "",
    xijoma: "",
    kunduzgi: "",
  });

  // Umumiy tushumni hisoblash
  const umumiyTushum = (Number(data.naxt) || 0) + (Number(data.plastik) || 0);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "hisobotlar"), {
        naxt: Number(data.naxt) || 0,
        plastik: Number(data.plastik) || 0,
        statsionar: Number(data.statsionar) || 0,
        ambulator: Number(data.ambulator) || 0,
        ginekologZ: Number(data.ginekologZ) || 0,
        ginekologM: Number(data.ginekologM) || 0,
        terapevt: Number(data.terapevt) || 0,
        nevrolog: Number(data.nevrolog) || 0,
        kardiolog: Number(data.kardiolog) || 0,
        labaratoriya: Number(data.labaratoriya) || 0,
        uzi: Number(data.uzi) || 0,
        ekg: Number(data.ekg) || 0,
        fizioterapiya: Number(data.fizioterapiya) || 0,
        massaj: Number(data.massaj) || 0,
        xijoma: Number(data.xijoma) || 0,
        kunduzgi: Number(data.kunduzgi) || 0,
        umumiyTushum: Number(umumiyTushum) || 0,
        timestamp: new Date(),
      });
  
      alert("Hisobot saqlandi!");
      setData({
        naxt: "",
        plastik: "",
        statsionar: "",
        ambulator: "",
        ginekologZ: "",
        ginekologM: "",
        terapevt: "",
        nevrolog: "",
        kardiolog: "",
        labaratoriya: "",
        uzi: "",
        ekg: "",
        fizioterapiya: "",
        massaj: "",
        xijoma: "",
        kunduzgi: "",
      });
    } catch (error) {
      console.error("Xatolik: ", error);
      alert("Xatolik yuz berdi!");
    }
  };
  
  // Pul formatlash funksiyasi
  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("uz-UZ").format(value);
  };

  return (
    <div className="w-full pb-40 pt-10">
      <div className="max-w-[40%] mx-auto p-6 bg-white rounded-xl shadow-xl border">
        <h2 className="text-xl font-semibold mb-4">Kassa Hisoboti</h2>
        <br />
        <p className="text-gray-700 mb-4">
          Bugungi sana: <strong>{today}</strong>
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2 items-center">
            <Label>Naxt: </Label>
            <Input
              name="naxt"
              value={data.naxt}
              onChange={handleChange}
              placeholder="Naxt summa"
              type="number"
            />
            <Label>Plastik: </Label>
            <Input
              name="plastik"
              value={data.plastik}
              onChange={handleChange}
              placeholder="Plastik summa"
              type="number"
            />
          </div>
          <div className="flex gap-3 items-center">
            <Label>Umumiy: </Label>
            <Input
              value={formatCurrency(umumiyTushum)}
              disabled
              placeholder="Umumiy tushum"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 text-right">
            <Label>Statsionar: </Label>
            <Input
              name="statsionar"
              value={data.statsionar}
              onChange={handleChange}
              placeholder="Statsionar tushum"
              type="number"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 text-right">
            <Label>Ambulator: </Label>
            <Input
              name="ambulator"
              value={data.ambulator?.toLocaleString()}
              onChange={handleChange}
              placeholder="Ambulator tushum"
              type="number"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 text-right">
            <Label>Zarnigor: </Label>
            <Input
              name="ginekologZ"
              value={data.ginekologZ}
              onChange={handleChange}
              placeholder="Ginekolog (Zarnigor)"
              type="number"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 text-right">
            <Label>Madaliyeva: </Label>
            <Input
              name="ginekologM"
              value={data.ginekologM}
              onChange={handleChange}
              placeholder="Ginekolog (Madaliyeva)"
              type="number"
            />
          </div>

          <div className="grid grid-cols-2 items-center gap-2 text-right">
            <Label>Terapevt: </Label>
            <Input
              name="terapevt"
              value={data.terapevt}
              onChange={handleChange}
              placeholder="Terapevt"
              type="number"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 text-right">
            <Label>Nevrolog: </Label>
            <Input
              name="nevrolog"
              value={data.nevrolog}
              onChange={handleChange}
              placeholder="Nevrolog"
              type="number"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 text-right">
            <Label>Kardiolog: </Label>
            <Input
              name="kardiolog"
              value={data.kardiolog}
              onChange={handleChange}
              placeholder="Kardiolog"
              type="number"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 text-right">
            <Label>Labaratoriya: </Label>

            <Input
              name="labaratoriya"
              value={data.labaratoriya}
              onChange={handleChange}
              placeholder="Labaratoriya"
              type="number"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 text-right">
            <Label>UZI: </Label>
            <Input
              name="uzi"
              value={data.uzi}
              onChange={handleChange}
              placeholder="UZI"
              type="number"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 text-right">
            <Label>EKG: </Label>

            <Input
              name="ekg"
              value={data.ekg}
              onChange={handleChange}
              placeholder="EKG"
              type="number"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 text-right">
            <Label>Fizioterapiya: </Label>

            <Input
              name="fizioterapiya"
              value={data.fizioterapiya}
              onChange={handleChange}
              placeholder="Fizioterapiya"
              type="number"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 text-right">
            <Label>Massaj: </Label>
            <Input
              name="massaj"
              value={data.massaj}
              onChange={handleChange}
              placeholder="Massaj"
              type="number"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 text-right">
            <Label>Xijoma: </Label>
            <Input
              name="xijoma"
              value={data.xijoma}
              onChange={handleChange}
              placeholder="Xijoma"
              type="number"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-2 text-right">
            <Label>Kunudzgi muolaja: </Label>
            <Input
              name="kunduzgi"
              value={data.kunduzgi}
              onChange={handleChange}
              placeholder="Kunduzgi muolaja"
              type="number"
            />
          </div>
          <Button type="submit" className="w-full">
            Hisobotni Yuborish
          </Button>
        </form>
      </div>
    </div>
  );
}
