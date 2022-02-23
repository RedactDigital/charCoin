const SHA256 = require('crypto-js/sha256');
const ChainUtil = require('../chain-util');

module.exports = {
  createBlock: (lastBlock, data, wallet) => {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = ChainUtil.hash(`${timestamp}${lastHash}${data}`);
    const block = {
      timestamp,
      lastHash,
      hash,
      data,
      validators: [{ address: wallet.getPublicKey(), signature: wallet.sign(hash) }],
    };
    return block;
  },

  blockHash: block => {
    const { timestamp, lastHash, data } = block;
    return ChainUtil.hash(`${timestamp}${lastHash}${data}`);
  },

  verifyBlock: block => {
    return ChainUtil.verifySignature(
      block.validator,
      block.authorityValidationSignature,
      ChainUtil.hash(`${block.timestamp}, ${block.lastHash}, ${block.data}`)
    );
  },

  verifyLeader: (block, leader) => {
    return block.validator == leader ? true : false;
  },
};

// class Block {
// constructor(timestamp, lastHash, hash, data, validators, signatures) {
//   this.timestamp = timestamp;
//   this.lastHash = lastHash;
//   this.hash = hash;
//   this.data = data;
//   this.validators = [validators];
//   this.authorityValidationSignature = signatures || [];
// }
// toString() {
//   return `Block -
//       Timestamp : ${this.timestamp}
//       Last Hash : ${this.lastHash}
//       Hash      : ${this.hash}
//       Data      : ${this.data}
//       Validator : ${this.validator}
//       Signature : ${this.signature}`;
// }
// static createBlock(lastBlock, data, wallet) {
//   const timestamp = Date.now();
//   const lastHash = lastBlock.hash;
//   const hash = Block.hash(timestamp, lastHash, data);
//   const validator = wallet.getPublicKey();
//   const signature = Block.signBlockHash(hash, wallet);
//   console.log(this.authorityValidationSignature);
//   console.log(signature);
//   const signatures = this.authorityValidationSignature.push(signature);
//   return new this(timestamp, lastHash, hash, data, validator, signatures);
// }
// static hash(timestamp, lastHash, data) {
//   return SHA256(JSON.stringify(`${timestamp}${lastHash}${data}`)).toString();
// }
// static blockHash(block) {
//   const { timestamp, lastHash, data } = block;
//   return Block.hash(timestamp, lastHash, data);
// }
// static signBlockHash(hash, wallet) {
//   return wallet.sign(hash);
// }
// static verifyBlock(block) {
//   return ChainUtil.verifySignature(
//     block.validator,
//     block.authorityValidationSignature,
//     Block.hash(block.timestamp, block.lastHash, block.data)
//   );
// }
// static verifyLeader(block, leader) {
//   return block.validator == leader ? true : false;
// }
// }

// module.exports = Block;
