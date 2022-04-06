/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });

const privatekey = process.env.privateKey;

const ALCHEMY_API_KEY_URL = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_URL;

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
};
