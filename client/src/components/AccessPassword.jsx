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
import { saveAs } from "file-saver";
import { decryptFile } from "@/lib/cryptoUtils";
import { sha256 } from "js-sha256";

export function AccessPassword({ selectedFileDetails, contract, account }) {
  const [password, setPassword] = useState("");
  console.log("From Access: ",selectedFileDetails)
  const handleSubmit = async () => {
    if (!password) {
      toast.error("Please enter the password.");
      return;
    }

    const hashedPassword = sha256(password);
    const fileOwner = selectedFileDetails[0];
    const fileName = selectedFileDetails[1];
    const fileHash = selectedFileDetails[2];

    try {
      console.log("Verifying password for:", { account, fileName, password });

      const isVerified = await contract.verifyPassword(
        fileOwner,
        fileName,
        hashedPassword
      );

      if (isVerified) {
        toast.success("Password verified! Decrypting...");

        // Fetch the file from IPFS
        const response = await fetch(fileHash);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch file from IPFS: ${response.statusText}`
          );
        }

        const blob = await response.blob();

        console.log("Fetched file blob:", blob);

        const decryptedBlob = await decryptFile(blob, password);

        saveAs(decryptedBlob, fileName);
      } else {
        toast.error("Incorrect password!");
      }
    } catch (error) {
      toast.error("Decryption failed!");
      console.error("Error during decryption:", error);
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
            <Label htmlFor="password" className="sr-only">
              Secret Key
            </Label>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Secret Key..."
              type="password"
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
