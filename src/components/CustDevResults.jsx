"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const CustDevResults = () => {
  const [feedbackStats, setFeedbackStats] = useState({});
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "customerFeedback"),
      (snapshot) => {
        const feedbackData = snapshot.docs.map((doc) => doc.data());
        setFeedbackList(feedbackData);

        const stats = {};
        feedbackData.forEach(({ selectedOptions }) => {
          for (const questionIndex in selectedOptions) {
            const { question, option } = selectedOptions[questionIndex];
            stats[question] = stats[question] || {};
            stats[question][option] = (stats[question][option] || 0) + 1;
          }
        });
        setFeedbackStats(stats);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Fikr-Mulohaza Statistikasi</h1>
      {Object.keys(feedbackStats).map((question) => (
        <div key={question} className="mb-4">
          <p>
            <strong>{question}</strong>
          </p>
          {Object.keys(feedbackStats[question]).map((option) => (
            <p key={option}>
              {option}: {feedbackStats[question][option]}
            </p>
          ))}
        </div>
      ))}
      <h2 className="text-lg font-bold mb-2">Mijozlar Fikrlari:</h2>
      {feedbackList.map((feedback, index) => (
        <p key={index} className="mb-2">
          {feedback.customerFeedback}
        </p>
      ))}
    </div>
  );
};

export default CustDevResults;
