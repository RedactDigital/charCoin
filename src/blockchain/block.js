const ChainUtil = require('../chain-util');

module.exports = {
  genesisBlock: { id: 0, timestamp: 0, lastHash: '-----', hash: 'genesis', data: [], leader: [] },

  createBlock: (lastBlock, transactions, wallet) => {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = ChainUtil.hash(`${timestamp}${lastHash}${transactions}`);
    const block = {
      id: lastBlock.id + 1,
      timestamp,
      lastHash,
      hash,
      transactions,
      leader: wallet.getPublicKey(),
      reward: 0, // TODO - calculate reward from adding all data.transactionFee
      donation: 0, // TODO - calculate donation from adding all data.donationFee
      numOfTransactions: transactions.length,
    };
    return block;
  },

  blockHash: block => {
    const { timestamp, lastHash, transactions } = block;
    return ChainUtil.hash(`${timestamp}${lastHash}${transactions}`);
  },

  verifyBlock: block => {
    const { timestamp, lastHash, transactions, leader } = block;

    console.log(block);

    for (let i = 0; i < leader.length; i++) {
      const validator = leader[i];
      const { address, signature } = validator;
      const valid = ChainUtil.verifySignature(
        address,
        signature,
        ChainUtil.hash(`${timestamp}${lastHash}${transactions}`)
      );
      if (!valid) return false;
    }

    return true;
  },

  // verifyLeader: (block, leader) => {
  //   return block.validator == leader ? true : false;
  // },
};
