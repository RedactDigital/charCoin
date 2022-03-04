const ChainUtil = require('../chain-util');

module.exports = {
  genesisBlock: { id: 0, timestamp: 0, lastHash: '-----', hash: 'genesis', data: [], validators: [] },

  createBlock: (lastBlock, data, wallet) => {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = ChainUtil.hash(`${timestamp}${lastHash}${data}`);
    const block = {
      id: lastBlock.id + 1,
      timestamp,
      lastHash,
      hash,
      data,
      leader: wallet.getPublicKey(),
      reward: 0, // TODO - calculate reward from adding all data.transactionFee
      donation: 0, // TODO - calculate donation from adding all data.donationFee
      numOfTransactions: data.transactions.length,
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
