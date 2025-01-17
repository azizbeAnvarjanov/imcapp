import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../app/firebase";

const GetUserWorkSchedule = async (userId) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("kindeId", "==", userId));
    const userDocs = await getDocs(q);

    if (userDocs.empty) {
      throw new Error("Foydalanuvchi topilmadi.");
    }

    const userData = userDocs.docs[0].data(); // Assuming there is only one user with the given ID
    return userData.workSchedule || [];
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    throw error;
  }
};

export default GetUserWorkSchedule;
