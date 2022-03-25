const {MerkleTree} = require('merkletreejs');
const keccak256  = require('keccak256');

//填写白名单地址
let wl = [];

let leafNodes = wl.map((addr) => keccak256(addr));
let merkleTree = new MerkleTree(leafNodes,keccak256,{sortPairs:true});

// 放在客户端验证
let leaf = keccak256('')

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


