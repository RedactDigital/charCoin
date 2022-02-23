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
    const { timestamp, lastHash, data, validators } = block;

    for (let i = 0; i < validators.length; i++) {
      const validator = validators[i];
      const { address, signature } = validator;
      const valid = ChainUtil.verifySignature(address, signature, ChainUtil.hash(`${timestamp}${lastHash}${data}`));
      if (!valid) return false;
    }

    return true;
  },

  // verifyLeader: (block, leader) => {
  //   return block.validator == leader ? true : false;
  // },
};
