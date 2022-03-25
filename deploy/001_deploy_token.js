const hre = require("hardhat");

async function main() {
    // 获取合约文件
    const ApeAscii = await hre.ethers.getContractFactory("ApeAscii");
    // 获取合约部署的对象， 设置盲盒图片格式可以参考其他项目的
    /**
     * 注意这个地方deploy的参数，在后面认证合约的时候 要填相同的值，不然会报以下错误
     Successfully submitted source code for contract
     contracts/ApeAscii.sol:ApeAscii at 0x7B5b01aaBf8869C45C4A0ec175247FdE8DDF5CB8
     for verification on the block explorer. Waiting for verification result...

     Error in plugin @nomiclabs/hardhat-etherscan: The contract verification failed.
     Reason: Fail - Unable to verify

     * @type {Contract}
     */
    const apeAscii = await ApeAscii.deploy("ipfs://QmesRyQ8jQi96vbBQNEKBYh4sD2cvC5ChpTi7xwp6XnwnG/");
    // 执行部署
    await apeAscii.deployed();
    // 打印一下部署的结果
    console.log("apeAscii deployed to:", apeAscii.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });