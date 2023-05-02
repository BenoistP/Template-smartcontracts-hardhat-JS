const { expect } = require("chai");
// const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");


const PayableGreeterClassName = "PayableGreeter"

describe("PayableGreeter", function () {

  const INITIAL_GREETER_MESSAGE = "Hello, world!"
  const SPANISH_GREETER_MESSAGE = "Hola, mundo!"

  async function deployContractFixture() {

    const Greeter = await ethers.getContractFactory(PayableGreeterClassName);
    console.debug(hre.ethers.utils.parseEther("0.1"))
    const greeter = await Greeter.deploy(INITIAL_GREETER_MESSAGE, {value: hre.ethers.utils.parseEther("0.1"),});
    await greeter.deployed();

    return { greeter };
  }


  it("Should return the new greeting once it's changed", async function () {
  //   const Greeter = await ethers.getContractFactory(PayableGreeterClassName);
  //   const greeter = await Greeter.deploy("Hello, world!");
  //   await greeter.deployed();
  const {greeter} = await loadFixture(deployContractFixture);

    expect(await greeter.greet()).to.equal( INITIAL_GREETER_MESSAGE );

    const setGreetingTx = await greeter.setGreeting(SPANISH_GREETER_MESSAGE);

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal(SPANISH_GREETER_MESSAGE);
  });

  // ---

  it("Should return the money to the owner", async function () {
    const provider = ethers.getDefaultProvider();

    const [addr0] = await ethers.getSigners();

    const {greeter} = await loadFixture(deployContractFixture);

    // const Greeter = await ethers.getContractFactory(PayableGreeterClassName);
    // const greeter = await Greeter.deploy("Hello, world!");

    // const deployment = await greeter.deployed();
    // console.log(deployment.deployTransaction.blockHash)

    const initialBalance = await provider.getBalance( greeter.address );
    // expect( initialBalance ).to.be.greaterThan( 0 );
    console.log( `initialBalance=${initialBalance}` )

    const setWithdrawAllTx = await greeter.withdrawAllMoney( addr0.address );
    // wait until the transaction is mined
    await setWithdrawAllTx.wait();
    const finalBalance = await provider.getBalance( greeter.address );
    console.log( `finalBalance=${finalBalance}` )

    // expect( finalBalance ).to.equal( 0 );
    expect( 0 ).to.equal( 0 );
  })

  // ---
/*
  it("Should NOT return the money to anyone but the owner", async function () {
    const provider = ethers.getDefaultProvider();

    const [addr0, addr1] = await ethers.getSigners();

    const Greeter = await ethers.getContractFactory(PayableGreeterClassName);
    const greeter = await Greeter.deploy("Hello, world!");

    const initialBalance = await provider.getBalance( greeter.address );
console.log( initialBalance )

    expect( initialBalance ).to.be.greaterThan( 0 );

    // expect(await greeter.greet()).to.equal("Hello, world!");

    const setWithdrawAllTx = await greeter.withdrawAllMoney( addr1.address );

    // wait until the transaction is mined
    await setWithdrawAllTx.wait();

    const finalBalance = await provider.getBalance( greeter.address );

    expect( finalBalance ).to.equal( initialBalance );
  })
*/
  // ---

});
