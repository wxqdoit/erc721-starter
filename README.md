# erc721-starter

### 这是什么
- 向你展示一个完整的ERC-721实现的nft项目

### 用了些什么
- hardhat编译构建验证合约
- 主要就是hardhat

### 一些命令
> network = rinkeby || kovan ,也可以是其他的
> uri = "ipfs://cid/" ,ipfs uri
> contract = 0x****65 ,合约地址 
- npx hardhat compile  编译合约
- npx hardhat run deploy/001_deploy_token.js --network `network` 部署合约
- npx hardhat verify --network `rinkeby` `contract` `uri` --show-stack-traces 验证合约



