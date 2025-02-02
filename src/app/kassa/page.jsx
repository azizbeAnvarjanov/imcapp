"use client";
import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "../firebase";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

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
    statsinar_madaliyeva: "",
    statsinar_zarnigor: "",
    statsinar_kardiolog: "",
    statsinar_terapevt: "",
    statsinar_nevrolog: "",
  });

  // Umumiy tushumni hisoblash
  const umumiyTushum =
    (Number(data.ambulator) || 0) + (Number(data.statsionar) || 0);
  const naxtTushum = umumiyTushum - Number(data.plastik);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "hisobotlar"), {
        naxt: Number(naxtTushum) || 0,
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
        statsinar_madaliyeva: Number(data.statsinar_madaliyeva) || 0,
        statsinar_kardiolog: Number(data.statsinar_kardiolog) || 0,
        statsinar_nevrolog: Number(data.statsinar_nevrolog) || 0,
        statsinar_terapevt: Number(data.statsinar_terapevt) || 0,
        statsinar_zarnigor: Number(data.statsinar_zarnigor) || 0,
        timestamp: today,
      });

      toast.success("Hisobot saqlandi!");
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
        statsinar_kardiolog: "",
        statsinar_madaliyeva: "",
        statsinar_nevrolog: "",
        statsinar_terapevt: "",
        statsinar_zarnigor: "",
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
          <div className="grid grid-cols-2 gap-2 items-center">
            <div className="flex flex-col gap-2">
              <Label>Naxt: </Label>
              <Input name="naxt" value={formatCurrency(naxtTushum)} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Umumiy: </Label>
              <Input value={formatCurrency(umumiyTushum)} disabled />
            </div>
          </div>
          <div className="grid gap-2 grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Statsionar: </Label>
              <Input
                name="statsionar"
                value={data.statsionar}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Ambulator: </Label>
              <Input
                name="ambulator"
                value={data.ambulator?.toLocaleString()}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Plastik: </Label>
              <Input
                name="plastik"
                value={data.plastik}
                onChange={handleChange}
                type="number"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Zarnigor: </Label>
              <Input
                name="ginekologZ"
                value={data.ginekologZ}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Madaliyeva: </Label>
              <Input
                name="ginekologM"
                value={data.ginekologM}
                onChange={handleChange}
                type="number"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Terapevt: </Label>
              <Input
                name="terapevt"
                value={data.terapevt}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Nevrolog: </Label>
              <Input
                name="nevrolog"
                value={data.nevrolog}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Kardiolog: </Label>
              <Input
                name="kardiolog"
                value={data.kardiolog}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Labaratoriya: </Label>

              <Input
                name="labaratoriya"
                value={data.labaratoriya}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>UZI: </Label>
              <Input
                name="uzi"
                value={data.uzi}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>EKG: </Label>

              <Input
                name="ekg"
                value={data.ekg}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Fizioterapiya: </Label>

              <Input
                name="fizioterapiya"
                value={data.fizioterapiya}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Massaj: </Label>
              <Input
                name="massaj"
                value={data.massaj}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Xijoma: </Label>
              <Input
                name="xijoma"
                value={data.xijoma}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Kunudzgi muolaja: </Label>
              <Input
                name="kunduzgi"
                value={data.kunduzgi}
                onChange={handleChange}
                type="number"
              />
            </div>
          </div>
          <h1 className="font-bold text-xl mb-2">Statsionar tushumlar</h1>
          <div className="grid grid-cols-2 gap-2 items-center">
            <div className="flex flex-col gap-2">
              <Label>Madaliyeva: </Label>
              <Input
                name="statsinar_madaliyeva"
                value={data.statsinar_madaliyeva}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Zarnigor: </Label>
              <Input
                name="statsinar_zarnigor"
                value={data.statsinar_zarnigor}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Nevrolog: </Label>
              <Input
                name="statsinar_nevrolog"
                value={data.statsinar_nevrolog}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Kardiolog: </Label>
              <Input
                name="statsinar_kardiolog"
                value={data.statsinar_kardiolog}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Zarnigor: </Label>
              <Input
                name="statsinar_terapevt"
                value={data.statsinar_terapevt}
                onChange={handleChange}
                type="number"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Hisobotni Yuborish
          </Button>
        </form>
      </div>
    </div>
  );
}
