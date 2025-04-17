/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-ethers");

const { task } = require("hardhat/config")

task("accounts", "Print the list of accounts",async (_,hre) => {
  const accounts = await hre.ethers.getSigners();

  for(const account of accounts){
    const balance = await hre.ethers.provider.getBalance(account.address)
    console.log(`Address: ${account.address} | Balance: ${ethers.utils.formatEther(balance)}ETH`)
    // console.log(account)
  }
})

module.exports = {
  solidity: "0.8.3",
  network:{
    localhost:{
      url:"http://localhost:8545",
      account:""
    },
    hardhat: {
      chainId: 31337,
    }
  },
  paths: {
    artifacts: "../client/src/artifacts",
  },
};
