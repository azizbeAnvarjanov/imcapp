"use client";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ExpensePage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [expenses, setExpenses] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchExpenses(date);
    fetchMonthlyData();
  }, [date]);

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

  const fetchMonthlyData = async () => {
    const expensesSnapshot = await getDocs(collection(db, "expenses"));
    const incomeSnapshot = await getDocs(collection(db, "hisobotlar"));

    const expensesData = expensesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const incomeData = incomeSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const monthlyDataMap = {};

    expensesData.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      const monthKey = expenseDate.getMonth();
      if (!monthlyDataMap[monthKey]) {
        monthlyDataMap[monthKey] = { month: monthKey, expenses: 0, income: 0 };
      }
      monthlyDataMap[monthKey].expenses += expense.amount;
    });

    incomeData.forEach((income) => {
      const incomeDate = new Date(income.timestamp);
      const monthKey = incomeDate.getMonth();
      if (!monthlyDataMap[monthKey]) {
        monthlyDataMap[monthKey] = { month: monthKey, expenses: 0, income: 0 };
      }
      monthlyDataMap[monthKey].income += income.umumiyTushum;
    });

    setMonthlyData(Object.values(monthlyDataMap));
  };

  const chartData = {
    labels: monthlyData.map((data) =>
      new Date(2024, data.month, 1).toLocaleString("default", { month: "long" })
    ),
    datasets: [
      {
        label: "Rashodlar",
        data: monthlyData.map((data) => data.expenses),
        backgroundColor: "red",
      },
      {
        label: "Tushumlar",
        data: monthlyData.map((data) => data.income),
        backgroundColor: "green",
      },
    ],
  };

  return (
    <div className="flex gap-4 p-4">
      <div className="w-[800px] border h-[800px]">
        <Bar data={chartData} />
      </div>
      <div></div>
    </div>
  );
}
