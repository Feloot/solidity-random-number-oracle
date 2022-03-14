import { assert, expect, should } from "chai"
import { ethers, upgrades, network } from "hardhat"
//const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers')
import { expectEventByName, getEventByName } from './helpers/events'

require('chai/register-assert.js');  // Using Assert style
require('chai/register-expect.js');  // Using Expect style
require('chai/register-should.js');  // Using Should style

const { singletons } = require('@openzeppelin/test-helpers')

upgrades.silenceWarnings()

describe("RandomNumberFactory", async () => {
  let owner: any, oracle: any
  let randomNumberFactoryContract: any, testContract: any

  beforeEach(async () => {
    [owner, oracle] = await ethers.getSigners()

    // RandomNumberFactory
    const RandomNumberFactory = await ethers.getContractFactory("RandomNumberFactory")
    randomNumberFactoryContract = await upgrades.deployProxy(RandomNumberFactory, [], {initializer: 'initialize', unsafeAllow: ["external-library-linking"]})
    await randomNumberFactoryContract.deployed()

    // TestContract
    const TestContract = await ethers.getContractFactory("TestContract")
    testContract = await upgrades.deployProxy(TestContract, [], {initializer: 'initialize', unsafeAllow: ["external-library-linking"]})
    await testContract.deployed()
    await testContract.setRandomNumberFactoryAddress(randomNumberFactoryContract.address)
  })

  it("should be able to add an oracle address", async () => {
    const receipt = await (await randomNumberFactoryContract.addOracleAddress(oracle.address)).wait()
    receipt.status.should.equal(1)
  })

  it("should be able to remove an oracle address", async () => {
    const receipt = await (await randomNumberFactoryContract.addOracleAddress(oracle.address)).wait()
    const receipt2 = await (await randomNumberFactoryContract.removeOracleAddress(oracle.address)).wait()
    receipt2.status.should.equal(1)
  })

  it("should be able to add a caller address", async () => {
    const receipt = await (await randomNumberFactoryContract.addCallerAddress(testContract.address)).wait()
    receipt.status.should.equal(1)
  })

  it("should be able to remove a caller address", async () => {
    const receipt = await (await randomNumberFactoryContract.addCallerAddress(testContract.address)).wait()
    const receipt2 = await (await randomNumberFactoryContract.removeCallerAddress(testContract.address)).wait()
    receipt2.status.should.equal(1)
  })

  it("should be able to request and generate a new random number", async () => {
    const receipt = await (await randomNumberFactoryContract.addCallerAddress(testContract.address)).wait()
    receipt.status.should.equal(1)

    const receipt2 = await (await randomNumberFactoryContract.addOracleAddress(oracle.address)).wait()
    receipt2.status.should.equal(1)

    const requestReceipt = await (await testContract.requestRandomNumber()).wait()
    expectEventByName(requestReceipt, "NewRandomNumberRequest")
    const newRequestEventArgs = getEventByName(requestReceipt, "NewRandomNumberRequest").args
    const requestId = Number(newRequestEventArgs.requestId)
    requestId.should.be.above(0)

    let randomNumber = 17;
    const resultReceipt = await (await randomNumberFactoryContract.connect(oracle).response(requestId, randomNumber)).wait()
    resultReceipt.status.should.equal(1)
    expectEventByName(resultReceipt, "RandomNumberGenerated")
    const randomNumberGeneratedEventArgs = getEventByName(resultReceipt, "RandomNumberGenerated").args
    const randomNumberArg = Number(randomNumberGeneratedEventArgs.randomNumber)
    randomNumberArg.should.equal(randomNumber)

    // Check that result was passed to the test contract
    const testContractResultReceipt = await testContract.rngRequestsToNumbers(requestId)
    testContractResultReceipt.should.equal(randomNumber)
  })
})
