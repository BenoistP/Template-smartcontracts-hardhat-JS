// HIDDEN
// .env
require("dotenv").config()

// PUBLIC
// params-defaults.env
require('dotenv').config({path: './params-defaults.env'})
// params-local.env
require('dotenv').config({path: './params-local.env'})


const Path = require("path");
let generateDoc = false;

require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("solidity-coverage")

// https://www.npmjs.com/package/hardhat-tracer
require("hardhat-tracer")

// https://www.npmjs.com/package/@primitivefi/hardhat-dodoc
require('@primitivefi/hardhat-dodoc')

// # Defaults
const DEFAULT_SOLIDITY_VERSION = "0.8.0"
const DEFAULT_GENERATE_DOCS = false
const DEFAULT_CONTRACTS_BUILD_DIR = "./artifacts"


console.log('-------------------------------------')

const SOLIDITY_VERSION = ( process.env.SOLIDITY_VERSION !== undefined ? process.env.SOLIDITY_VERSION : DEFAULT_SOLIDITY_VERSION )
// console.debug(" ****process.env.SOLIDITY_VERSION= ", process.env.SOLIDITY_VERSION)
console.log(`SOLIDITY_VERSION = "${SOLIDITY_VERSION}"`)

const GENERATE_DOCS = ( process.env.GENERATE_DOCS !== undefined ? process.env.GENERATE_DOCS === "true" : DEFAULT_GENERATE_DOCS )
// console.debug(" ****process.env.GENERATE_DOCS= ", process.env.Generate_Docs)
console.log(`GENERATE_DOCS = "${GENERATE_DOCS}"`)


const CONTRACTS_BUILD_DIR = ( process.env.CONTRACTS_BUILD_DIR !== undefined ? ( process.env.CONTRACTS_BUILD_DIR.trim() !== "" ? Path.join(__dirname, process.env.CONTRACTS_BUILD_DIR ) : DEFAULT_CONTRACTS_BUILD_DIR ) : DEFAULT_CONTRACTS_BUILD_DIR )
// console.debug(" ****process.env.CONTRACTS_BUILD_DIR= ", process.env.CONTRACTS_BUILD_DIR)
console.log(`CONTRACTS_BUILD_DIR = "${CONTRACTS_BUILD_DIR}"`)

// console.log(process.env.LOCAL_WALLET_MNEMONIC)

const LOCAL_PRIVATE_KEY = process.env.LOCAL_PRIVATE_KEY
if (LOCAL_PRIVATE_KEY) {
  console.log(`LOCAL_PRIVATE_KEY is ${LOCAL_PRIVATE_KEY===undefined?"UNDEFINED ❌":" DEFINED ✔️" }`)
} else {
  console.error(`LOCAL_PRIVATE_KEY is ${LOCAL_PRIVATE_KEY===undefined?"UNDEFINED ❌":" DEFINED ✔️" }`)
}

const LOCAL_WALLET_MNEMONIC = process.env.LOCAL_WALLET_MNEMONIC
if (LOCAL_WALLET_MNEMONIC) {
  console.log(`LOCAL_WALLET_MNEMONIC is ${LOCAL_WALLET_MNEMONIC===undefined?"UNDEFINED ❌":" DEFINED ✔️" }`)
} else {
  console.error(`LOCAL_WALLET_MNEMONIC is ${LOCAL_WALLET_MNEMONIC===undefined?"UNDEFINED ❌":" DEFINED ✔️" }`)
}

const PROJECT_WALLET_MNEMONIC = process.env.PROJECT_WALLET_MNEMONIC
if (PROJECT_WALLET_MNEMONIC) {
  console.log(`PROJECT_WALLET_MNEMONIC is ${PROJECT_WALLET_MNEMONIC===undefined?"UNDEFINED ❌":" DEFINED ✔️" }`)
} else {
  console.error(`PROJECT_WALLET_MNEMONIC is ${PROJECT_WALLET_MNEMONIC===undefined?"UNDEFINED ❌":" DEFINED ✔️" }`)
}

const PROJECT_PRIVATE_KEY = process.env.PROJECT_PRIVATE_KEY
if (PROJECT_PRIVATE_KEY) {
  console.log(`PROJECT_PRIVATE_KEY is ${PROJECT_PRIVATE_KEY===undefined?"UNDEFINED ❌":" DEFINED ✔️" }`)
} else {
  console.error(`PROJECT_PRIVATE_KEY is ${PROJECT_PRIVATE_KEY===undefined?"UNDEFINED ❌":" DEFINED ✔️" }`)
}
// console.log(process.env.MATIC_MUMBAI_RPC)

console.log('-------------------------------------')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) =>
{
  console.log("taskArgs=", taskArgs)
  const accounts = await hre.ethers.getSigners()
/* 
  for (const account of accounts) {
    // console.dir(account)
    console.log(` account.address=${account.address}`)
  } // for

 */
  accounts.forEach(function (account, i) {
    console.log('account.address=%d: %s', i, account.address);
});

}) // task

// task("docx", "compile", async (taskArgs, hre) => {
//   await hre.run("compile");
// })

// console.dir(
//   task("x", "y", async (taskArgs, hre) => {
//     await hre.run("compile");
//   })
// )

task("comp", "Compile")
  // .addParam("generatedoc", "generate solidity docs")
  .addOptionalParam("generatedoc", "generate solidity docs")
  .setAction(async (taskArgs) => {
    // const account = web3.utils.toChecksumAddress(taskArgs.account);
    // const balance = await web3.eth.getBalance(account);
    // console.log(web3.utils.fromWei(balance, "ether"), "ETH");
    // taskArgs.generateDoc

    generateDoc = (taskArgs.generatedoc == "true" || taskArgs.generatedoc == "y")
    // console.log(`taskArgs.generatedoc=${taskArgs.generatedoc}`)
    // console.log(`generateDoc=${generateDoc}`)

    await hre.run("compile");
  });



// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {

  defaultNetwork: "hardhat",
  // defaultNetwork: "ropsten",
  // defaultNetwork: "maticmumbai",


  //https://www.npmjs.com/package/@primitivefi/hardhat-dodoc
  dodoc: {
    runOnCompile: GENERATE_DOCS||false,
    debugMode: false,
    // More options...
  },


  solidity: {
    version: SOLIDITY_VERSION,
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
        }
      }
    },

  networks: {
    hardhat: {
    },

    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.LOCAL_PRIVATE_KEY !== undefined ? [process.env.LOCAL_PRIVATE_KEY] : [],
    },

    maticmumbai: {
      url: process.env.MATIC_MUMBAI_RPC || "",
      accounts:
        process.env.LOCAL_PRIVATE_KEY !== undefined ?
          [process.env.LOCAL_PRIVATE_KEY]
          :
          process.env.LOCAL_WALLET_MNEMONIC !== undefined ?
            {
              mnemonic: process.env.LOCAL_WALLET_MNEMONIC,
              path: "m/44'/60'/0'/0",
              initialIndex: 0,
              count: 20,
              passphrase: "",
            }
            :
            [],
      // gasPrice: 8000000000, // default is 'auto' which breaks chains without the london hardfork
    },

  },
  
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    // artifacts: "./artifacts"
    artifacts: CONTRACTS_BUILD_DIR,
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },

  etherscan: {
    apiKey: {
        mainnet: process.env.ETHERSCAN_API_KEY,
        ropsten: process.env.ETHERSCAN_API_KEY,
        rinkeby: process.env.ETHERSCAN_API_KEY,
        goerli: process.env.ETHERSCAN_API_KEY,
        kovan: process.env.ETHERSCAN_API_KEY,
        // binance smart chain
        bsc: "YOUR_BSCSCAN_API_KEY",
        bscTestnet: "YOUR_BSCSCAN_API_KEY",
        // huobi eco chain
        heco: "YOUR_HECOINFO_API_KEY",
        hecoTestnet: "YOUR_HECOINFO_API_KEY",
        // fantom mainnet
        opera: "YOUR_FTMSCAN_API_KEY",
        ftmTestnet: "YOUR_FTMSCAN_API_KEY",
        // optimism
        optimisticEthereum: "YOUR_OPTIMISTIC_ETHERSCAN_API_KEY",
        optimisticKovan: "YOUR_OPTIMISTIC_ETHERSCAN_API_KEY",
        // polygon
        polygon: process.env.POLYGONSCAN_API_KEY,
        polygonMumbai: process.env.POLYGONSCAN_API_KEY,
        // arbitrum
        arbitrumOne: "YOUR_ARBISCAN_API_KEY",
        arbitrumTestnet: "YOUR_ARBISCAN_API_KEY",
        // avalanche
        avalanche: "YOUR_SNOWTRACE_API_KEY",
        avalancheFujiTestnet: "YOUR_SNOWTRACE_API_KEY",
        // moonbeam
        moonbeam: "YOUR_MOONBEAM_MOONSCAN_API_KEY",
        moonriver: "YOUR_MOONRIVER_MOONSCAN_API_KEY",
        moonbaseAlpha: "YOUR_MOONBEAM_MOONSCAN_API_KEY",
        // harmony
        harmony: "YOUR_HARMONY_API_KEY",
        harmonyTest: "YOUR_HARMONY_API_KEY",
        // xdai and sokol don't need an API key, but you still need
        // to specify one; any string placeholder will work
        xdai: "api-key",
        sokol: "api-key",
        aurora: "api-key",
        auroraTestnet: "api-key",
      }
    },
  
  mocha: {
    timeout: 40000
  }
}
