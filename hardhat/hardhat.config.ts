import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter"

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  }, 
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337
    },
    ganache: {
      chainId: 1337,
      url: "http://127.0.0.1:7545",
      // accounts: ["2bb827c8456251a9a348bff75e46a32ef24e87c8e0c8e43f54f1cfaab828747b",
      //             "a84f10062c2cea32b20f60591927f91ad1c0bdfb550108b4d47924ac74908dc4",
      //             "4bdbb4eb97528b8907f2752bd908fa90b70a15cc569f44d0bfbaabbbb661f459"]
    }
  },
  paths: {
    artifacts: "../src/artifacts"
  },
  gasReporter: {
    enabled: true,
    coinmarketcap: 'd21cdc04-1ed2-45a4-95cf-95f9964d7c74'
  }
};

export default config;
