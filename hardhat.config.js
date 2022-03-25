require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");

//获取私钥，key等
const dotenv = require("dotenv");
dotenv.config();
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const PRIVATE_KEY= process.env.PRIVATE_KEY;
const NETWORK_URL_RINKEBY = process.env.NETWORK_URL_RINKEBY;
const NETWORK_URL_KOVAN = process.env.NETWORK_URL_KOVAN;

//配置代理，不然在验证合约的时候无法访问网络的api
const {setGlobalDispatcher, ProxyAgent} = require('undici');
const proxyAgent = new ProxyAgent('http://127.0.0.1:7890');
setGlobalDispatcher(proxyAgent);

//自定义一个command，查询账户
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
});

module.exports = {
    solidity: {
        version: '0.8.9',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    compilers: {
        solc: {
            version: "0.8.9",
            docker: true,
        },
    },
    contractSizer: {
        alphaSort: true,
        runOnCompile: true,
        disambiguatePaths: false,
    },
    networks: {
        rinkeby: {
            url: NETWORK_URL_RINKEBY,
            accounts:[PRIVATE_KEY],
        },
        kovan:{
            url: NETWORK_URL_KOVAN,
            accounts:[PRIVATE_KEY],
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    // etherscan:{}
};
