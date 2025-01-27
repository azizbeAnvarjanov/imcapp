"use client";
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const CustomerFeedback = () => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [customerFeedback, setCustomerFeedback] = useState("");
  const [message, setMessage] = useState("");

  const questions = [
    {
      text: "Sog‘lig‘ingizga salbiy ta’sir qilayotgan asosiy omillar qanday?",
      options: [
        "Stress",
        "Uyqu yetishmovchiligi",
        "Noto‘g‘ri ovqatlanish",
        "Harakatsizlik",
        "Boshqalar (o‘zingiz yozing)",
      ],
    },
    {
      text: "Siz uchun tibbiy xizmatda eng muhim narsa nima?",
      options: ["Sifat", "Tezkorlik", "Narxning qulayligi", "Qulay joylashuv"],
    },
    {
      text: "Klinikamiz xizmatlaridan qanchalik qoniqasiz?",
      options: ["Juda qoniqaman", "Qoniqaman", "O‘rtacha", "Qoniqmayman"],
    },
    {
      text: "Klinikamizda qaysi jihatlarni yaxshilashni xohlaysiz?",
      options: ["Xizmat sifati", "Xodimlarning e’tibori", "Kutish vaqti qisqarishi", "Narxlarni moslashtirish", "Boshqalar (o‘zingiz yozing)"],
    },
    {
      text: "Diagnostika (analizlar, UZI)",
      options: ["Reabilitatsiya xizmatlari", "Maxsus jarrohlik xizmatlari", "Estetik xizmatlar", "Boshqalar (o‘zingiz yozing)"],
    },
    {
      text: "Siz uchun xizmatlar narxi qanday baholanadi?",
      options: ["Mos", "Biroz qimmat", "Juda qimmat"],
    },
    {
      text: "Sog‘lig‘ingizni yaxshilash uchun qanday qo‘shimcha xizmatlarni xohlaysiz?",
      options: ["Shaxsiy shifokor maslahatlari", "Uyda xizmat ko‘rsatish", "Jismoniy faoliyat va reabilitatsiya dasturlari", "Ruhiy sog‘liqni tiklash xizmatlari"],
    },
    {
      text: "Klinikamizni boshqa muassasalardan ustun qiladigan jihat bormi?",
      options: ["Ha (aniqlashtiring)", "Yo‘q"],
    },
  ];

  const handleOptionChange = (questionIndex, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: { question: questions[questionIndex].text, option },
    }));
  };

  const handleSubmit = async () => {
    try {
      const feedbackData = {
        selectedOptions,
        customerFeedback,
        submittedAt: new Date(),
      };
      await addDoc(collection(db, "customerFeedback"), feedbackData);
      toast.success("Fikr-mulohazangiz muvaffaqiyatli yuborildi!");
      setSelectedOptions({});
      setCustomerFeedback("");
    } catch (error) {
      toast.error("Xatolik yuz berdi, qaytadan urinib ko'ring.");
    }
  };

  return (
    <div className="p-6 max-w-[50%] mx-auto pb-20">
      <h1 className="text-xl font-bold mb-4">Mijoz Fikr-Mulohazasi</h1>
      {questions.map((question, index) => (
        <div key={index} className="my-11">
          <p className="font-bold text-2xl">{question.text}</p>
          {question.options.map((option) => (
            <div key={option} className="flex gap-2 items-center border p-2 rounded-lg shadow-sm my-4">
              <Checkbox
                checked={selectedOptions[index]?.option === option}
                onCheckedChange={() => handleOptionChange(index, option)}
              />
              <span>{option}</span>
            </div>
          ))}
        </div>
      ))}
      <div className="mb-4">
        <p className="font-bold text-xl mb-2">Klinikamiz faoliyatiga qanday takliflaringiz bor?</p>
        <Textarea
          value={customerFeedback}
          className="min-h-[30vh]"
          onChange={(e) => setCustomerFeedback(e.target.value)}
        />
      </div>
      <Button onClick={handleSubmit}>Jo'natish</Button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default CustomerFeedback;
