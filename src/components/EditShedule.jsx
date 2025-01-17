import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../app/firebase";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "react-hot-toast";

const EditSchedule = ({ userId, fetchUsers }) => {
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUserSchedule = async () => {
      if (!userId) return;
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setStartTime(userData.workSchedule?.defaultStartTime || "08:00");
          setEndTime(userData.workSchedule?.defaultEndTime || "17:00");
        }
      } catch (err) {
        setError("Error fetching user schedule.");
        console.error("Error fetching user schedule:", err);
      }
    };
    fetchUserSchedule();
  }, [userId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        "workSchedule.defaultStartTime": startTime,
        "workSchedule.defaultEndTime": endTime,
      });
      if (fetchUsers) fetchUsers(); // Refresh the user list if provided
      toast.success("Updated");
    } catch (err) {
      setError("Error updating work schedule.");
      console.error(err);
    } finally {
      setLoading(false);
      setOpen(false)
    }
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <div>
          <Button onClick={() => setOpen(true)}>Edit Schedule</Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Work Schedule</DialogTitle>
          <DialogDescription>
            Update the start and end time of the work schedule.
          </DialogDescription>
        </DialogHeader>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex flex-col gap-4">
          <label className="flex flex-col">
            Start Time
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </label>
          <label className="flex flex-col">
            End Time
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </label>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Bekor qilish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSchedule;
