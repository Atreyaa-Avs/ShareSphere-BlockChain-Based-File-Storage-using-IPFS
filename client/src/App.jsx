import Upload from "../src/artifacts/contracts/Upload.sol/Upload.json";
import React, { useEffect, useState } from "react";
import LandingBg from "/LandingBg.jpg";
import Nav from "./components/Nav";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import Logo from "/Logo.png";
import FileUpload from "./components/FileUpload";
import { ethers } from "ethers";
import { FileLock, FileUser, Waypoints } from "lucide-react";
import MyFilesDialog from "./components/MyFilesDialog";
import SharedFilesDialog from "./components/SharedFilesDialog";
import MyFilesDetails from "./components/MyFileDetails";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [animateLoading, setAnimateLoading] = useState(false);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(false);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (hasVisited) {
      setLoading(false);
      return;
    }

    const timer1 = setTimeout(() => {
      setAnimateLoading(true);

      const timer2 = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("hasVisited", "true");
        document.body.classList.remove("loader");
      }, 5200);

      return () => clearTimeout(timer2);
    }, 5600);

    return () => clearTimeout(timer1);
  }, []);

  const [fileDetails, setFileDetails] = useState([]);
  const [allFileDetails, setAllFileDetails] = useState([]);
  const [allUserFileDetails, setAllUserFileDetails] = useState([]);

  const getFileDetails = async () => {
    try {
      const fileHashes = await contract.getPasswordHashes();
      setFileDetails(fileHashes);
    } catch (err) {
      console.error("Error fetching file hashes:", err);
    }
  };

  const getAllFileDetails = async () => {
    try {
      const allFileHashes = await contract.getAllFiles();
      setAllFileDetails(allFileHashes);
    } catch (err) {
      console.error("Error fetching all files hashes:", err);
    }
  };

  const getUserFileDetails = async () => {
    try {
      const [fileNames, hashes] = await contract.getUserFileNamesAndHashes();
      const fileDetails = fileNames.map((name, index) => ({
        fileName: name,
        sha256Hash: hashes[index],
      }));
      setAllUserFileDetails(fileDetails);
    } catch (err) {
      console.error("Error fetching file names and hashes:", err);
    }
  };

  useEffect(() => {
    if (contract) {
      getFileDetails();
      getAllFileDetails();
      getUserFileDetails();
    }
  }, [contract]);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);

  return (
    <>
      {loading && (
        <div className="loader overflow-hidden z-[100] absolute">
          <motion.div
            initial={{ y: 0 }}
            animate={animateLoading ? { y: "-100vh" } : {}}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-center bg-black z-50 w-full h-full overflow-hidden"
          >
            <div className="flex justify-center items-center gap-32 ml-48 max-lg:ml-32 relative">
              <motion.img
                src={Logo}
                alt="Moving Logo"
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: -200 }}
                transition={{
                  opacity: { duration: 2.2, delay: 1.5 },
                  x: { delay: 3.2, duration: 0.8, ease: "easeInOut" },
                }}
                className="w-32 h-32 absolute -ml-24"
              />

              <h1 className="text-5xl font-semibold font-mono text-white -ml-24">
                {"ShareSphere".split("").map((char, index) => (
                  <motion.span
                    className="inline-block overflow-hidden"
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 3.6 + 0.05 * index,
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    key={index}
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>
            </div>
          </motion.div>
        </div>
      )}

      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage: `url(${LandingBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Nav />
        <div className="bg-white glassmorphism-bg max-w-screen-xl mx-12 mt-4 rounded-md min-h-full flex flex-1 mb-4 max-lg:flex-col ">
          <div className="flex flex-col py-5 rounded-md px-3 lg:hidden">
            <p className="text-2xl font-medium inline-flex items-center justify-center">
              <FileLock />
              Decentralized File System
            </p>
            <p className="text-center text-neutral-700 pb-3">(GDrive Web3.0)</p>
            <div className="w-fit mx-auto">
              <p className="bg-white px-2 rounded-md">
                <span className="text-lg font-medium">Account</span> :{" "}
                {account ? account : "Not connected"}
              </p>
            </div>
          </div>
          <FileUpload
            account={account}
            provider={provider}
            contract={contract}
          ></FileUpload>
          <div className="flex flex-col p-1 rounded-md px-3">
            <div className="max-lg:hidden">
              <div className="grid">
                <p className="text-2xl font-medium inline-flex items-center justify-center">
                  <FileLock />
                  Decentralized File System
                </p>
              </div>
              <p className="text-center text-neutral-700 pb-3">
                (GDrive Web-3.0)
              </p>
              <div className="w-fit mx-auto text-center">
                <p className="bg-white px-5 rounded-md">
                  <span className="text-lg font-medium">Account</span> :{" "}
                  {account ? account : "Not connected"}
                </p>
              </div>
            </div>

            <div className="file_buttons flex flex-col gap-4 mt-5 md:mx-24">
              <div className="glassmorphism-bg grid grid-cols-3 max-lg:grid-cols-2 rounded-md py-3 max-lg:mx-12 max-md:flex max-md:flex-col">
                <div className="h-fit w-full my-auto lg:my-auto">
                  <FileUser
                    strokeWidth={1.3}
                    className="w-1/2 h-1/2 mx-auto text-neutral-500"
                  />
                </div>
                <div className="lg:col-span-2 max-lg:my-auto pr-4 px-4">
                  <h1 className="text-2xl underline font-bold max-md:text-center">Your Files</h1>
                  <p className="text-neutral-800 font-medium">
                    View your uploaded file in the Blockchain.
                  </p>
                  <div className="inline-flex justify-end max-md:justify-center max-md:items-center w-full my-4">
                    <MyFilesDialog
                      name={"My Uploaded Files"}
                      account={account}
                      fileDetails={fileDetails}
                    />
                  </div>
                </div>
              </div>
              <div className="glassmorphism-bg grid grid-cols-3 max-lg:grid-cols-2 rounded-md py-3 max-lg:mx-12 max-md:flex max-md:flex-col">
                <div className="h-fit md:w-full my-auto pr-4">
                  <Waypoints
                    strokeWidth={1}
                    className="w-1/2 h-1/2 mx-auto text-neutral-500"
                  />
                </div>
                <div className="lg:col-span-2 max-lg:my-auto px-4">
                  <h1 className="text-2xl underline font-bold text-balance max-md:text-center">
                    All Files
                  </h1>
                  <p className="text-neutral-800 font-medium max-w-sm">
                    View all files that has been shared has been stored in the
                    Blockchain.
                  </p>
                  <div className="inline-flex justify-end items-end w-full my-4">
                    <SharedFilesDialog
                      name={"View All Files"}
                      account={account}
                      fileDetails={allFileDetails}
                      contract={contract}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-fit mx-auto my-4">
              <MyFilesDetails
                name={"View All Your File Hashes"}
                account={account}
                fileDetails={allUserFileDetails}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
