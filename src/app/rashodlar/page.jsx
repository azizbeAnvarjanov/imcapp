"use client";
import { useState, useEffect } from "react";
import { db } from "@/app/firebase"; // Firebase config
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Printer } from "lucide-react";

export default function ExpensePage() {
  const currentToday = new Date();
  const year = currentToday.getFullYear();
  const month = String(currentToday.getMonth() + 1).padStart(2, "0");
  const day = String(currentToday.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  const [amount, setAmount] = useState("");
  const [department, setDepartment] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(today);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses(date);
  }, [date]);

  const addExpense = async () => {
    if (!amount || !department || !note) return;
    await addDoc(collection(db, "expenses"), {
      amount: parseFloat(amount),
      department,
      note,
      date,
    });
    setAmount("");
    setDepartment("");
    setNote("");
    fetchExpenses(date);
  };

  const fetchExpenses = async (selectedDate) => {
    const q = query(
      collection(db, "expenses"),
      where("date", "==", selectedDate)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setExpenses(data);
  };

  const handlePrint = () => {
    const printContents = document.getElementById("printDiv").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const calculateTotalExpenses = () => {
    return expenses.reduce((total, exp) => total + exp.amount, 0);
  };

  const umumiyChiqimlar = calculateTotalExpenses();

  const departments = [
    {
      name: "AXO",
      value: "AXO",
    },
    {
      name: "Shifokorlar oyligi",
      value: "Shifokorlar oyligi",
    },
    {
      name: "Xodimlar oyligi",
      value: "Xodimlar oyligi",
    },
    {
      name: "Oshxona",
      value: "Oshxona",
    },
    {
      name: "Labaratoriya",
      value: "Labaratoriya",
    },
    {
      name: "Fizioterapiya",
      value: "Fizioterapiya",
    },
    {
      name: "SMM",
      value: "SMM",
    },
    {
      name: "Registratura",
      value: "Registratura",
    },
    {
      name: "Ginekologiya",
      value: "Ginekologiya",
    },
    {
      name: "Kassa",
      value: "Kassa",
    },
    {
      name: "Statsionar",
      value: "Statsionar",
    },
    {
      name: "Boshqa chiqimlar",
      value: "Boshqa chiqimlar",
    },
  ];

  return (
    <div className="flex gap-4 p-4 pb-40">
      {/* Left Side - Input Form */}
      <div className="w-[30%] border p-4 rounded-lg shadow-md space-y-3">
        <h2 className="text-lg font-semibold mb-2">Rashod kiritish</h2>
        <Input
          type="number"
          placeholder="Summa"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Select value={department} onValueChange={(e) => setDepartment(e)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Bo'lim tanlang" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((item, idx) => (
              <SelectItem key={idx} value={item.value}>{item.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Izoh"
          className="w-full p-2 border rounded mb-2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></Textarea>
        <Button onClick={addExpense}>Qo'shish</Button>
      </div>

      {/* Right Side - Expense List */}
      <div className="w-[70%] border p-4 rounded-lg shadow-md">
        <div className="flex items-center mb-2 gap-2">
          <Input
            type="date"
            value={date}
            className="w-fit"
            onChange={(e) => setDate(e.target.value)}
          />
          <Button onClick={handlePrint}>
            <Printer />
          </Button>
        </div>
        <div
          id="printDiv"
          className="border p-4 rounded-lg h-[80vh] overflow-auto bg-white"
        >
          <h1 className="mb-4 text-xl font-bold text-center">
            {today} - sana boyicha chiqimlar -{" "}
            {umumiyChiqimlar.toLocaleString()}
          </h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="w-[50px] font-bold">№</TableCell>
                <TableCell className="font-bold">Summa</TableCell>
                <TableCell className="font-bold">Bo'lim</TableCell>
                <TableCell className="font-bold">Izoh</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{item.amount.toLocaleString()}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
