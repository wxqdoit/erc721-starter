// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract ApeAscii is ERC721 , ERC721Enumerable,Ownable{
    enum Status {
        Waiting,
        WhiteListMinting,
        Finished
    }
    uint256 public counter = 0;
    Status public status;
    bytes32 public merkleRoot;
    string public baseURI;

    uint256 public constant MAX_MINT_PER_ADDR = 1;//每个地址最多mint1个
    uint256 public constant MAX_SUPPLY = 1000;//发行总量
    uint256 public constant presalePrice = 0.01 * 10 ** 18; // 0.01 ETH mint价格

    event Minted(address minter, uint256 amount);
    event StatusChanged(Status status);
    event BaseURIChanged(string newBaseURI);

    constructor(string memory initBaseURI) ERC721('ApeAscii','APEA') {
        baseURI = initBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // set merkle root
    function setRoot(bytes32  mr) public onlyOwner returns(bool) {
        merkleRoot = mr;
        return true;
    }

    //mint
    function whiteListMint(bytes32[] memory proof ) external payable {
        //1、查询有没有开始mint
        require(status == Status.WhiteListMinting, "Haven't started Mint yet");
        //require(tx.origin == msg.sender, "Contract calls are not allowed");

        //2、判断是否在白名单中 // Merkle verify
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid Merkle Proof.");

        //3、查询是否已经mint,最多mint1个
        require(balanceOf(msg.sender) < MAX_MINT_PER_ADDR, "Mint one per person.");

        //4、mint
        _safeMint(msg.sender,counter);
        counter += 1;
        emit Minted(msg.sender, MAX_MINT_PER_ADDR);
    }

    //这两个方法要重写
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    //设置状态，是否开启mint
    function setStatus(Status _status) external onlyOwner {
        status = _status;
        emit StatusChanged(status);
    }

    //设置图片
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
        emit BaseURIChanged(newBaseURI);
    }

    function withdraw(address payable recipient) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success,) = recipient.call{value : balance}("");
        require(success, "OVER");
    }
}
