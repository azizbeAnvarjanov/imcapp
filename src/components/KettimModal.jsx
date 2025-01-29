import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ShieldAlert, TriangleAlert } from "lucide-react";

const KettimModal = ({ handleDepart, loading, setIsOpen, isOpen }) => {
  return (
    <Dialog open={isOpen}>
      <DialogTrigger
        className={`bg-red-600 w-[200px] h-[200px] !rounded-full ketdim_btn text-2xl`}
        onClick={() => setIsOpen(true)}
      >
        Ketdim
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-7">
          <DialogTitle className="text-center text-2xl w-full">
            Rostanham ketyapszmi !
          </DialogTitle>
          <TriangleAlert size="230px" className="w-auto text-yellow-400" />
          <DialogDescription className="flex items-center justify-center gap-3">
            <Button
              disabled={loading}
              onClick={() => setIsOpen(false)}
              variant="destructive"
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleDepart}
              disabled={loading}
              className="bg-green-500"
            >
              Rostan
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default KettimModal;
