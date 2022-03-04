const ChainUtil = require('../chain-util');

module.exports = {
  genesisBlock: { id: 0, timestamp: 0, lastHash: '-----', hash: 'genesis', data: [], leader: [] },

  createBlock: (lastBlock, transactions, wallet) => {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = ChainUtil.hash(`${timestamp}${lastHash}${transactions}`);

    let donation = 0;
    let reward = 0;
    transactions.forEach(transaction => {
      donation += +transaction.data.fees.donationFee;
      reward += +transaction.data.fees.instructionFee;
    });

    const block = {
      id: lastBlock.id + 1,
      timestamp,
      lastHash,
      hash,
      transactions,
      leader: wallet.getPublicKey(),
      reward,
      donation,
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
    // const lastBlock = blockchain.getLastBlock();

    // Ensure hash is valid
    if (ChainUtil.hash(`${timestamp}${lastHash}${transactions}`) !== block.hash) return false;

    // Ensure lastHash matches previous local block's hash
    // if (lastBlock.lastHash !== lastHash) return false;

    // Ensure the block is not too old

    // Ensure the block is not too far in the future

    // Ensure the block is signed by the leader

    // Ensure each transaction is valid

    // console.log(block);

    // const lastBlock = this.chain[this.chain.length - 1];

    // if (block.lastHash === lastBlock.hash && block.hash === blockHash(block) && verifyBlock(block)) {
    //   if (block.leader != this.findValidator().address) return false;
    //   log.info('Block valid');
    //   return true;
    // }
    // log.warn('Block invalid');
    // return false;

    return true;
  },

  // verifyLeader: (block, leader) => {
  //   return block.validator == leader ? true : false;
  // },
};
