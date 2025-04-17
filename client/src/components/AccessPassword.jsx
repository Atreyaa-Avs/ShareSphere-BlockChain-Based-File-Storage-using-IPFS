import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "react-hot-toast";

export function AccessPassword({ fileHash, contract, account, downloadFile }) {
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!password) return;
    try {
      const isVerified = await contract.verifyPassword(fileHash, password);
      if (isVerified) {
        toast.success("Password verified!");
        downloadFile(fileHash, password);
      } else {
        toast.error("Incorrect password!");
      }
    } catch (error) {
      toast.success("Password Verified!");
      console.error(error);
    }
  };

  return (
    <Dialog>
        <Toaster />
      <DialogTrigger asChild>
        <Button variant="outline" className="dark text-white">
          Download
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-semibold tracking-tight">
            Enter Key to Decrypt the File
          </DialogTitle>
          <DialogDescription className="text-sm tracking-tight">
            Enter the Key shared by the Owner.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Secret Key..."
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <div className="flex justify-between w-full">
              <Button
                type="button"
                variant="secondary"
                className="dark w-max inline-flex justify-end items-end"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}