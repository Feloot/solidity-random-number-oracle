// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hardhat from "hardhat";
import { ethers, upgrades, network } from "hardhat";
const { singletons } = require('@openzeppelin/test-helpers')

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  console.log("Network:", network.name)

  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with account:", deployer.address)
  console.log("Account balance:", (await deployer.getBalance()).toString())

  // RandomNumberFactory
  const RandomNumberFactory = await ethers.getContractFactory("RandomNumberFactory")
  const randomNumberFactory = await upgrades.deployProxy(RandomNumberFactory, [], {initializer: 'initialize'})
  await randomNumberFactory.deployed()
  console.log("RandomNumberFactory deployed to:", randomNumberFactory.address)

  // TestContract
  const TestContract = await ethers.getContractFactory("TestContract")
  const testContract = await upgrades.deployProxy(TestContract, [], {initializer: 'initialize'})
  await testContract.deployed()
  console.log("TestContract deployed to:", testContract.address)

  await testContract.setRandomNumberFactoryAddress(randomNumberFactory.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
});
