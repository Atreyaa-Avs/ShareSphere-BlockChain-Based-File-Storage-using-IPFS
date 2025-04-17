import Upload from "../src/artifacts/contracts/Upload.sol/Upload.json";
import React, { useEffect, useState } from "react";
import LandingBg from "/LandingBg.jpg";
import Nav from "./components/Nav";
import { delay, motion } from "framer-motion";
import { Button } from "./components/ui/button";
import Logo from "/Logo.png";
import FileUpload from "./components/FileUpload";
import { ethers } from "ethers";
import { FileLock } from "lucide-react";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [animateLoading, setAnimateLoading] = useState(false);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        console.log(contractAddress)

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        //console.log(contract);
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
            <div className="flex justify-center items-center gap-4 relative">
              <motion.img
                src={Logo}
                alt="Moving Logo"
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: -170 }}
                transition={{
                  opacity: { duration: 2.2, delay: 1.5 },
                  x: { delay: 3.2, duration: 0.8, ease: "easeInOut" },
                }}
                className="w-32 h-32 absolute"
              />

              <motion.h1
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 40, opacity: 1 }}
                transition={{ delay: 3.6, duration: 1, ease: "easeOut" }}
                className="text-5xl font-semibold font-mono text-white"
              >
                ShareSphere
              </motion.h1>
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
          backgroundRepeat: "no-repeat"
        }}
      >
        <Nav />
        <div className="bg-white glassmorphism-bg max-w-screen-xl mx-12 mt-4 rounded-md min-h-full flex flex-1 mb-4 max-lg:flex-col ">
          <FileUpload
            account={account}
            provider={provider}
            contract={contract}
          ></FileUpload>
          <div>
            <div className="flex flex-col p-1 rounded-md px-3">
              <p className="text-2xl font-medium inline-flex items-center justify-center"><FileLock />Decentralized File System</p>
              <p className="text-center text-neutral-700 pb-3">(GDrive Web3.0)</p>
              <p className="bg-white px-2 rounded-md">
                <span className="text-lg font-medium">Account</span> :{" "}
                {account ? account : "Not connected"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
