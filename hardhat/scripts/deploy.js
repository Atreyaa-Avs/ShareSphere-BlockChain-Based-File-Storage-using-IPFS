const { ethers } = require("hardhat");

async function main() {

  const Upload = await ethers.getContractFactory("Upload");
  const upload = await Upload.deploy();
  await upload.deployed();
  
  console.log("Contract deployed to:", upload.address);

}

main().catch((error) => {
  console.error("Error in deployment or interaction:", error);
  process.exit(1);
});
