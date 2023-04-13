// HIDDEN
// .env
require("dotenv").config()

// PUBLIC
// localparams.env
require('dotenv').config({path: './localparams.env'})

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
const SOLIDITY_VERSION = "0.8.0"
const GENERATEDOCS = false
const CONTRACTS_BUILD_DIR = "./artifacts"

console.log('-------------------------------------')

const Solidity_version = ( process.env.Solidity_version !== undefined ? process.env.Solidity_version : SOLIDITY_VERSION )
console.log(" ****process.env.Solidity_version= ", process.env.Solidity_version)
console.log(`Solidity_version = "${Solidity_version}"`)

const Generate_docs = ( process.env.Generate_Docs !== undefined ? process.env.Generate_Docs === "true" : GENERATEDOCS )
console.log(" ****process.env.Generate_Docs= ", process.env.Generate_Docs)
console.log(`Generate_docs = "${Generate_docs}"`)


const Contracts_Build_Dir = ( process.env.Contracts_Build_Dir !== undefined ? ( process.env.Contracts_Build_Dir.trim() !== "" ? Path.join(__dirname, process.env.Contracts_Build_Dir ) : CONTRACTS_BUILD_DIR ) : CONTRACTS_BUILD_DIR )
console.log(" ****process.env.Contracts_Build_Dir= ", process.env.Contracts_Build_Dir)
console.log(`Contracts_Build_Dir = "${Contracts_Build_Dir}"`)

console.log(process.env.WALLET_MNEMONIC_PROJECT)
console.log(process.env.MATIC_MUMBAI_RPC)
console.log('-------------------------------------')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

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

  //https://www.npmjs.com/package/@primitivefi/hardhat-dodoc
  dodoc: {
    runOnCompile: Generate_docs||false,
    debugMode: false,
    // More options...
  },


  solidity: {
    version: Solidity_version,
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
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },

    maticmumbai: {
      url: process.env.MATIC_MUMBAI_RPC || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ?
          [process.env.PRIVATE_KEY]
          :
          process.env.WALLET_MNEMONIC_PROJECT !== undefined ?
            {
              mnemonic: process.env.WALLET_MNEMONIC_PROJECT,
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
    artifacts: Contracts_Build_Dir,
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
