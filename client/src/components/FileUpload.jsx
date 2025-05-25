import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Toaster, toast } from "react-hot-toast";
import { FileBox, X } from "lucide-react";
import UploadPng from "/upload.png";
import { Button } from "@/components/ui/button";
import axios from "axios";
import PasswordInput from "./PasswordInput";
import { encryptFile, decryptFile } from "@/lib/cryptoUtils";
import AlertDialog from "./AlertDialog";
import { sha256 } from "js-sha256";
import CryptoJS from "crypto-js";

const FileUpload = ({ account, provider, contract }) => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const [showOverlay, setShowOverlay] = useState(false);

  const [fileName, setFileName] = useState("");

  const [password, setPassword] = useState("");
  const [passwordHash, setPasswordHash] = useState("");

  // Handle drag events manually
  useEffect(() => {
    const handleDragEnter = (e) => {
      e.preventDefault();
      setShowOverlay(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      if (
        e.relatedTarget === null ||
        !document.body.contains(e.relatedTarget)
      ) {
        setShowOverlay(false);
      }
    };

    const handleDrop = () => setShowOverlay(false);

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file); // the full File object
      setFileName(file.name); // optional
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: false,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
  });

  const clearFile = () => {
    setUploadedFile(null);
  };

  useEffect(() => {
    if (password.length > 0) {
      setPasswordHash(sha256(password));
    }
  }, [password]);

  const handleFileUpload = async () => {
    if (!uploadedFile || password.length === 0) return;

    toast.loading("Encrypting the File...");

    try {
      const encryptedBlob = await encryptFile(uploadedFile, passwordHash);

      const formData = new FormData();
      formData.append("file", new File([encryptedBlob], fileName));

      const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
      const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_API_KEY;

      toast.dismiss();
      toast.loading("Uploading to IPFS...");

      const resFile = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      );

      const fileHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;

      toast.dismiss();
      toast.loading("Approving transaction...");

      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).add(account, fileHash);
      await tx.wait();

      const addPasswordHashTx = await contract
        .connect(signer)
        .addPasswordHash(account, fileName, fileHash, passwordHash);
      await addPasswordHashTx.wait();

      clearFile();
      toast.dismiss();
      toast.success("Encrypted file uploaded and saved on-chain!");
    } catch (err) {
      toast.dismiss();
      toast.error("Upload failed!");
      console.error(err);
    }
  };

  return (
    <div
      {...getRootProps()}
      className="relative pt-1 w-1/2 h-full my-auto max-lg:w-[80%] max-md:w-full max-lg:mx-auto xl:-ml-12 max-xl:-ml-8 max-md:-ml-10 max-lg:ml-12"
    >
      <Toaster />

      {showOverlay && (
        <div className="fixed top-0 left-0 w-full h-full z-50 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl">
          <img src={UploadPng} alt="Upload" className="w-20 mr-4" />
          Drop the file here...
        </div>
      )}

      <div className="flex p-6 gap-6 items-center justify-center h-full mx-6 md:mx-12 w-full">
        <div className="flex flex-col bg-[#ddd] w-full p-5 rounded-lg pb-12 mx-6">
          <div className="text-center text-2xl font-bold my-2">
            Add / Upload File
          </div>

          <div
            className={`relative flex flex-col ${
              uploadedFile ? "gap-4" : "gap-32"
            } bg-neutral-400 p-4 rounded-md mt-4 items-center justify-center w-full h-full px-14`}
          >
            <div className="absolute z-0 scale-[2.5] pb-5 max-xl:pb-1 max-md:pb-2 text-neutral-500">
              <FileBox className={`${uploadedFile && "hidden"}`} />
            </div>
            <input disabled={!account} {...getInputProps()} hidden />

            <div className="flex justify-center">
              <p className="text-md text-center">
                {isDragActive ? (
                  <>
                    Drop the File...
                    <br />
                    <span className="text-red-500 text-sm">
                      (only .jpeg, .jpg, .png & .pdf files)
                    </span>
                  </>
                ) : (
                  <>
                    Drag or upload a file here
                    <br />
                    <span className="text-red-500 text-sm">
                      (only .jpeg, .jpg, .png & .pdf files)
                    </span>
                  </>
                )}
              </p>
            </div>

            {uploadedFile && (
              <div className="relative text-sm mt-2 w-full text-left bg-white p-2 rounded">
                <div>
                  <button
                    onClick={clearFile}
                    className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                  <p>
                    <strong>File:</strong> {uploadedFile.name.slice(0,20) + "..."}
                  </p>
                  <p>
                    <strong>Type:</strong> {uploadedFile.type}
                  </p>
                  <p>
                    <strong>Size:</strong>{" "}
                    {uploadedFile.size >= 1024 * 1024
                      ? `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`
                      : `${(uploadedFile.size / 1024).toFixed(2)} KB`}
                  </p>
                </div>
              </div>
            )}

            {uploadedFile && (
              <div>
                <PasswordInput onChange={setPassword} />
              </div>
            )}

            <div className="flex flex-col gap-6 w-full">
              <Button
                onClick={open}
                className="w-full"
                disabled={!!uploadedFile}
              >
                Upload File
              </Button>

              <AlertDialog
                className="w-1/3 h-fit overflow-hidden"
                onClick={handleFileUpload}
                disabled={!uploadedFile || password.length == 0}
                hashValue={passwordHash}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
