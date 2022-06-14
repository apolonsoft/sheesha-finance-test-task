# Sheesha Finance Test Task

Step 1
```shell
npm install
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

Step 2

`Add Hardhat network to your metamask`

`Network Name : Hardhat`

`New RPC URL : http://127.0.0.1:8545/`

`Chain ID : 31337`

`Currency Symbol: ETH`

Step 3

`Import one private key from hardhat node to metamask (Import Account)`

Step 4

`Import Sheesha Token Contract Address To Your Imported Account(tou can obtain that from running deploy.ts output`

Step 5

`Replace Sheesha Token Contract Address and Sheesha Pool Contract Address with new addresses that you are getting from running deploy.ts outout`

Step 6
```shell
npm run dev
```
open http://localhost:3000
