import { CircleAlertIcon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import CopyInput from "./CopyInput";

export default function AlertComponent({className , onClick, disabled, hashValue}) {
  return (
    (<AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>Confirm</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={className}>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true">
            <CircleAlertIcon className="opacity-80 text-red-500" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold">Key to Access your File</AlertDialogTitle>
            <AlertDialogDescription >
              This is the "Secret Key" you need to share others, so that they can access this file.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <h1 className="-mb-4 font-semibold text-sm">Secret Key:</h1>
          <CopyInput value={hashValue}/>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>Submit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>)
  );
}
