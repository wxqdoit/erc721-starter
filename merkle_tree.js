const {MerkleTree} = require('merkletreejs');
const keccak256  = require('keccak256');

let wl = [
    '0xe877fee6851b0a04E99c28b524e55Bd955bfFF1a',
    '0x5FC9C5Df032274d24D5ac57D563D6B3623Fc5Ab9',
    '0x820AD2cca6A01528CFEd75b52a0813609B23a875',
    '0x47c5B26DAb0885e0E88aa275836cCe4a8a3557B5',
    '0x38a4609FB5d68b2D3B800B55E1088e28B752d778',
    '0xAD5ec0bEb058f3F9D4a7372fDFf5EC8631D4Ed9e',
    '0xEA7ED95D2C0FdeD85c5Cd2FAEEe950B5316f16fd',
    '0x11B8Cb26685c30AfA2FB5d53F0D4B292CC8e7EC2',
    '0x90e6D0F0F48a1832C3f0AC5d4D1441D8f0566a0F',
    '0xbF5a928B7a556Fa7F3Df64342eCB71336AF387d3',
];

let leafNodes = wl.map((addr) => keccak256(addr));
let merkleTree = new MerkleTree(leafNodes,keccak256,{sortPairs:true});
let leaf = keccak256('0xe877fee6851b0a04E99c28b524e55Bd955bfFF1a')

//mint的时候填写这个，格式(注意不要带引号)：
// [0x30****cbbc,0x54****d58a,0xd1****2f9e,0x35****2cf8]
let proof = merkleTree.getHexProof(leaf)
console.log('merkleProof:',proof.toString())

//设置merkleRoot要填写的值
let merkleRoot = merkleTree.getHexRoot()
console.log('merkleRoot:',merkleRoot)

//白名单验证测试，注意和合约里面验证的参数区别
//MerkleProof.verify(proof, merkleRoot, leaf)
let res = merkleTree.verify(proof,leaf,merkleRoot)
console.log('merkleVerify:',res)


