
import * as fs from 'fs'
import HDWalletProvider from '@truffle/hdwallet-provider'
import { args } from './cmd'
import { chains } from '../../config'

export const mnemonic = fs.readFileSync(".secret").toString().trim()

const networkArg = args['network'] || 'Ganache';
const environmentArg = args['environment'] || 'development';
console.log("Network : " + networkArg + " | Environment : " + environmentArg)

const networkTest = chains[networkArg].environments[environmentArg] || null
const currencyTest = chains[networkArg].currency || null

if (!networkTest || !currencyTest) {
  console.error("Network or environment not found in configuration")
  process.exit(0)
}

export const network = networkTest
export const currency = currencyTest
export const environment = environmentArg

export const provider = new HDWalletProvider({
  mnemonic: mnemonic,
  providerOrUrl: network.rpcUrls[0],
  chainId: network.chainId,
})