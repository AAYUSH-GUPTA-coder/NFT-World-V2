/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env.local" });
require("@nomiclabs/hardhat-etherscan");

const privatekey = process.env.privateKey;

const ALCHEMY_API_KEY_URL = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_URL;

const POLYGONSCAN_KEY = process.env.POLYGONSCAN_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    //  unused configuration commented out for now
    mumbai: {
      url: ALCHEMY_API_KEY_URL,
      accounts: [privatekey],
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: POLYGONSCAN_KEY,
    },
  },
};
