const Block = require('./block');
const Stake = require('./stake');
const Account = require('./account');
const {
  getTierOneValidators,
  getTierTwoValidators,
  getTierThreeValidators,
  getValidatorWithMostStakes,
  commitValidator,
} = require('./validators');
const Wallet = require('../wallet/wallet');
const secret = 'i am the first leader';

const TRANSACTION_TYPE = {
  transaction: 'TRANSACTION',
  stake: 'STAKE',
  validator_fee: 'VALIDATOR_FEE',
};

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
    this.stakes = new Stake();
    this.accounts = new Account();
  }

  addBlock(data) {
    const block = Block.createBlock(this.chain[this.chain.length - 1], data, new Wallet(secret));

    this.chain.push(block);
    console.log('NEW BLOCK ADDED');
    return block;
  }

  createBlock(transactions, wallet) {
    const block = Block.createBlock(this.chain[this.chain.length - 1], transactions, wallet);
    return block;
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];

      if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) return false;
    }

    return true;
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log('Recieved chain is not longer than the current chain');
      return;
    } else if (!this.isValidChain(newChain)) {
      console.log('Recieved chain is invalid');
      return;
    }

    console.log('Replacing the current chain with new chain');
    this.resetState();
    this.executeChain(newChain);
    this.chain = newChain;
  }

  getBalance(publicKey) {
    return this.accounts.getBalance(publicKey);
  }

  findValidator(block) {
    // Tier 1 - Validator with x amount of blocks validated
    // Tier 2 - Validator with x amount of blocks validated
    // Tier 3 - All other validators
    let validators = null;
    if (block.validator.length === 0) validators = getTierThreeValidators();
    if (block.validator.length === 1) validators = getTierTwoValidators();
    if (block.validator.length === 2) validators = getTierOneValidators();

    return getValidatorWithMostStakes(validators);
  }

  initialize(address) {
    this.accounts.initialize(address);
    this.stakes.initialize(address);
  }

  isValidBlock(block) {
    const lastBlock = this.chain[this.chain.length - 1];
    if (
      block.lastHash === lastBlock.hash &&
      block.hash === Block.blockHash(block) &&
      Block.verifyBlock(block) &&
      Block.verifyLeader(block, this.findValidator())
    ) {
      console.log('block valid');
      this.addBlock(block);
      this.executeTransactions(block);
      return true;
    } else {
      // console.log(
      //   block.lastHash !== lastBlock.hash,
      //   block.hash !== Block.blockHash(block),
      //   Block.verifyBlock(block),
      //   Block.verifyLeader(block, this.getLeader())
      // );

      return false;
    }
  }

  executeTransactions(block) {
    if (!block.data.transactions) return;
    block.data.forEach(transaction => {
      switch (transaction.type) {
        case TRANSACTION_TYPE.transaction:
          this.accounts.update(transaction);
          this.accounts.transferFee(block, transaction);
          break;
        case TRANSACTION_TYPE.stake:
          this.stakes.update(transaction);
          this.accounts.decrement(transaction.input.from, transaction.output.amount);
          this.accounts.transferFee(block, transaction);

          break;
        case TRANSACTION_TYPE.validator_fee:
          if (commitValidator(transaction)) {
            this.accounts.decrement(transaction.input.from, transaction.output.amount);
            this.accounts.transferFee(block, transaction);
          }
          break;
      }
    });
  }

  executeChain(chain) {
    chain.forEach(block => {
      this.executeTransactions(block);
    });
  }

  resetState() {
    this.chain = [Block.genesis()];
    this.stakes = new Stake();
    this.accounts = new Account();
  }
}

module.exports = Blockchain;
