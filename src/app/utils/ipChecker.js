import axios from "axios";
import allowedIps from "../allowedIps"; // Tasdiqlangan IP ro'yxati

export async function isIpAllowed() {
  try {
    // Foydalanuvchi IP-manzilini olish
    const response = await axios.get("https://api64.ipify.org?format=json");
    const currentIp = response.data.ip;

    // Tasdiqlash
    return allowedIps.includes(currentIp);
  } catch (error) {
    console.error("IP olishda xatolik:", error);
    return false; // Xato yuz bersa, ruxsat yo'q
  }
}
