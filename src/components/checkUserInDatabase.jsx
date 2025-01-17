import { db } from "../app/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

export default async function checkUserInDatabase(user) {
  if (!user) return;
  const checkUserInDatabase = async () => {
    try {
      // Firestore’da foydalanuvchini qidirmoq
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Agar foydalanuvchi bazada mavjud bo‘lmasa, yangi foydalanuvchi qo‘shish
        const newUser = {
          kindeId: user?.id, // Kinde’dan olingan foydalanuvchi IDsi
          name: user.given_name, // Kinde’dan olingan foydalanuvchi ismi
          surname: user.family_name, // Kinde’dan olingan foydalanuvchi familiyasi
          email: user.email, // Kinde’dan olingan foydalanuvchi emaili
          createdAt: new Date(),
        };

        // Foydalanuvchi ma'lumotlarini Firestore’ga qo‘shish
        await setDoc(doc(db, "users", user.id), newUser);

        console.log("Yangi foydalanuvchi qo'shildi");
      } else {
        console.log("Foydalanuvchi allaqachon mavjud");
      }
    } catch (error) {
      console.error("Foydalanuvchini tekshirishda xatolik:", error);
    }
  };

  checkUserInDatabase();
}
