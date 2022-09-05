import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv'

dotenv.config()

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks:{
    mumbai: {
        url: process.env.POLYGON_MUMBAI,
        accounts: [process.env.PRIVATE_KEY!]
    }
  },
  etherscan:{
    apiKey: process.env.API_KEY
  }
};

export default config;
