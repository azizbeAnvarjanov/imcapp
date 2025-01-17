"use client";

import { isIpAllowed } from "../utils/ipChecker";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function withIpCheck(WrappedComponent) {
  return function WithIpCheckWrapper(props) {
    const [isAllowed, setIsAllowed] = useState(null); // IP holati
    const router = useRouter();

    useEffect(() => {
      async function checkIp() {
        const allowed = await isIpAllowed();
        setIsAllowed(allowed);

        if (!allowed) {
          // Foydalanuvchi taqiqlangan bo'lsa, boshqa sahifaga yo'naltirish
          router.replace("/access-denied");
        }
      }

      checkIp();
    }, [router]);

    if (isAllowed === null) {
      return <p>Tekshirilmoqda...</p>; // IP tekshirilayotgan paytda yuklanmoqda xabari
    }

    return isAllowed ? <WrappedComponent {...props} /> : null; // IP tasdiqlangan bo'lsa sahifa ko'rsatiladi
  };
}
