# Random number generator

Generic contract and oracle for requesting/returning randomly generated numbers. Check the TestContract to see how to implement it.

Don't forget to update oracles/randomNumber.ts with the contract address once it is deployed.

### Test
```shell
npx hardhat test
```

### Deploy on a local node
```shell
npx hardhat node
npx hardhat run --network localhost scripts/deploy.ts
```

### Run oracle
```shell
ts-node oracles/randomNumber.ts --network Ganache --environment development
```

### Having SSL issues ?

```shell
export NODE_OPTIONS=--openssl-legacy-provider
```