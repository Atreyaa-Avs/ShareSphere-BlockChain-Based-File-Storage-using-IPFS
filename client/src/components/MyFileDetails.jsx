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
import { FileImage, FileText } from "lucide-react";
import CopyInput from "./CopyInput";
import { AccessPassword } from "./AccessPassword";

export default function MyFilesDetails({ name, account, fileDetails }) {
  console.log(fileDetails);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="">{name}</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-3xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base text-center underline">
            {name}
          </DialogTitle>
          <div className="overflow-y-auto">
            <DialogDescription asChild>
              <div className="px-6 py-4">
                <p>
                  <span className="text-black font-medium">
                    My Account No:{" "}
                  </span>
                  {account}
                </p>
                <br />
                <div className="flex flex-col text-black">
                  <div className="grid grid-cols-2 gap-2 p-2 border-b font-semibold bg-gray-100 rounded-md rounded-br-none rounded-bl-none">
                    <div>File Name</div>
                    <div>Password Hash</div>
                  </div>

                  {/* File rows */}
                  {fileDetails?.map((file, index) => (
                    <div
                      className="grid grid-cols-2 gap-2 p-2 border-b"
                      key={index}
                    >
                      <div className="flex gap-2 items-center">
                        {file.fileName.endsWith(".pdf") ? (
                          <FileText strokeWidth={1} className="text-red-600" />
                        ) : (
                          <FileImage strokeWidth={1} className="text-red-600" />
                        )}
                        {file.fileName}
                      </div>
                      <div className="w-fit pr-5 -ml-2">
                        <CopyInput value={file.sha256Hash} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DialogDescription>
            <DialogFooter className="px-6 pb-6 sm:justify-start">
              <DialogClose asChild>
                <Button
                  type="button"
                  className="inline-flex justify-end mx-auto w-fit"
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
