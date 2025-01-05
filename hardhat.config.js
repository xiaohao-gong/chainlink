require("@nomicfoundation/hardhat-toolbox");
//require("@chainlink/env-enc").config();
require("@chainlink/env-enc").config({ path: ".env.enc"});
require("./tasks")

//require("dotenv").config()
const SEPOLIA_URL=process.env.SEPOLIA_URL;
const PRIVATE_KEY=process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const PRIVATE_KEY_1=process.env.PRIVATE_KEY_1;
/** @type import('hardhat/config').HardhatUserConfig */

console.log("结果",process.env.SEPOLIA_URL);



module.exports = {
  defaultNetwork:"hardhat",
  solidity: "0.8.28",
  networks:{
    sepolia:{
      url:SEPOLIA_URL,
      accounts:[PRIVATE_KEY,PRIVATE_KEY_1],
      chainId:11155111
    }
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }
  }
};
