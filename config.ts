import Web3 from "web3"

export type Environment = "development" | "testnet" | "production"
type ChainEnvironment = {
  name: string
  chainId: number
  rpcUrls: string[]
  nodes: string[]
  blockExplorerUrls: string[]
  poolUrl: string
}
type Chain = {
  currency: {
    name: string
    symbol: string
    decimals: number
  }
  environments: {
    [key in Environment as string]?: ChainEnvironment
  }
}
type Token = {
  ticker: string
  decimals: number
  pool?: string
}
interface Chains { [key: string]: Chain }
//interface EnvironmentUrls { [key in Environment]: string[] }
type EnvironmentUrls = { [key in Environment]: string[] }

export const chains : Chains = {
  Ganache: {
    currency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    environments: {
      development: {
        name: "Ganache",
        chainId: 1337,
        rpcUrls: ["http://localhost:7545"],
        nodes: ['wss://localhost:7545'],
        blockExplorerUrls: ['https://bscscan.com/'],
        poolUrl: ""
      },
    }
  },
  BinanceSmartChain: {
    currency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18
    },
    environments: {
      testnet: {
        name: "Binance Smart Chain Testnet",
        chainId: 97,
        rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
        nodes: [
          // Should be replaced with your own nodes !!
          'wss://speedy-nodes-nyc.moralis.io/5b5c7512e66bceec6b8f6b0f/bsc/testnet/ws',
          'wss://apis.ankr.com/wss/3afa17c5b8c64938a459f2353d9444af/c01f0182eaca79b1d50bde6d39631624/binance/full/test'
        ],
        blockExplorerUrls: ['https://testnet.bscscan.com'],
        poolUrl: "https://pancakeswap.finance/swap?outputCurrency=0x370527c29113aaD172D1dEF6c42d0C924DF124cE&inputCurrency=BNB"
      },
      production: {
        name: "Binance Smart Chain",
        chainId: 56,
        rpcUrls: ["https://bsc-dataseed1.defibit.io/"],
        nodes: [
          // Should be replaced with your own nodes !!
          'wss://bsc-mainnet.nodereal.io/ws/v1/7ca4846605a94d17be21f498514d9df5',
          'wss://speedy-nodes-nyc.moralis.io/5b5c7512e66bceec6b8f6b0f/bsc/mainnet/ws',
          'wss://apis.ankr.com/wss/d0226aca0bfa4d119eedd79678a3d485/c01f0182eaca79b1d50bde6d39631624/binance/full/main'
        ],
        blockExplorerUrls: ['https://bscscan.com/'],
        poolUrl: "https://pcs.nhancv.com/#/swap?outputCurrency=0xFA94F2aB5d99AC7a414D2A490CB9a1D213d957E9"
      }
    }
  }
}

const environmentUrls: EnvironmentUrls = {
  development: [
    '127.0.0.1'
  ],
  testnet: [

  ],
  production: [

  ]
}

class Config {
  public environment: Environment = 'development'

  constructor() {
    this.environment = this.setEnvironment()
    let location : any | undefined;
    if (location !== undefined) console.log("Current environment : " + this.environment)
  }

  private setEnvironment() : Environment {
    let location : any | undefined;
    if (location !== undefined) {
      if (environmentUrls.development.includes(location.hostname))
        return "development"
      if (environmentUrls.testnet.includes(location.hostname))
        return "testnet"
      if (environmentUrls.production.includes(location.hostname))
        return "production"
    }

    return "development"
  }
}

export default new Config()