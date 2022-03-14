import * as fs from 'fs'
import Web3 from 'web3'
import { Unknown } from './helpers/types'
import { provider, environment } from './helpers/chain'
import { NetworkToContractAddresses } from './helpers/types'

const randomNumberMin = 1
const randomNumberMax = 100

const contractAddresses: NetworkToContractAddresses = {
  development: '',
  testnet: '',
  production: ''
}
const abi = JSON.parse(fs.readFileSync("build/contracts/RandomNumberFactory.json").toString().trim())

const web3 = new Web3(provider)
const contract = new web3.eth.Contract(abi, contractAddresses[environment])
const account = web3.eth.getAccounts((err, accounts) => { return accounts[0]})

let currentBlock = 0
async() => await web3.eth.getBlockNumber().then((result) => currentBlock = result)

async() => await contract.events
  .NewRequest({
    fromBlock: currentBlock
  })
  .on('data', async (event: Unknown) => {
    const updateFn = (requestId: number, randomNumber: number) => contract.methods.response(requestId, randomNumber).send({ from: account })
      .on('receipt', () => {
        console.log("RequestId : " + requestId + " | RandomNumber : " + randomNumber)
      })
      .on('error', () => {
        updateFn(requestId, randomNumber)
      })

    const rand = Math.random() * (randomNumberMax - randomNumberMin) + randomNumberMin
    updateFn(event.returnValues._requestId, rand)
  })
  .on('error', console.error)