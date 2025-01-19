"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const IpPage = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // IP manzilni olish
    axios
      .get("https://api.ipify.org?format=json")
      .then((response) => {
        setIpAddress(response.data.ip);
        setLoading(false);
      })
      .catch((error) => {
        console.error("IPni olishda xato:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <p>Sizning IP manzilingiz: {ipAddress}</p>
      )}
    </div>
  );
};

export default IpPage;
