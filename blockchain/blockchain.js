const { createBlock, blockHash, verifyBlock } = require('./block');
const Stake = require('./stake');
const Account = require('./account');
const {
  getTierOneValidators,
  getTierTwoValidators,
  getTierThreeValidators,
  getValidatorWithMostStake,
  commitValidator,
  getValidators,
} = require('./validators');
const Wallet = require('../wallet/wallet');
const secret = 'i am the first leader';

const genesisBlock = {
  timestamp: 0,
  lastHash: '-----',
  hash: 'genesis',
  data: [],
  validators: [],
};

class Blockchain {
  constructor() {
    this.chain = [genesisBlock];
    this.stakes = new Stake();
    this.accounts = new Account();
  }

  addBlockToChain(data) {
    const block = createBlock(this.chain[this.chain.length - 1], data.data, new Wallet(secret));

    this.chain.push(block);
    console.log('NEW BLOCK ADDED');
    return block;
  }

  createBlock(transactions, wallet) {
    const block = createBlock(this.chain[this.chain.length - 1], transactions, wallet);
    return block;
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(genesisBlock)) return false;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];

      if (block.lastHash !== lastBlock.hash || block.hash !== blockHash(block)) return false;
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

  findValidator(index) {
    // Tier 1 - Validator with x amount of blocks validated
    // Tier 2 - Validator with x amount of blocks validated
    // Tier 3 - All other validators
    let validators = getValidators();

    if (index == 0) validators = getTierThreeValidators();
    if (index == 1) validators = getTierTwoValidators();
    if (index == 2) validators = getTierOneValidators();

    return getValidatorWithMostStake(validators, this.accounts);
  }

  initialize(address) {
    this.accounts.initialize(address);
    this.stakes.initialize(address);
  }

  isValidBlock(block) {
    const lastBlock = this.chain[this.chain.length - 1];
    if (block.lastHash === lastBlock.hash && block.hash === blockHash(block) && verifyBlock(block)) {
      for (let i = 0; i < block.validators.length; i++) {
        if (block.validators[i].address != this.findValidator([i]).address) return false;
      }

      console.log('Block valid');
      return true;
    }
    console.log('Block invalid');
    return false;
  }

  executeTransactions(block) {
    if (!block.data) return;

    for (let i = 0; i < block.data.length; i++) {
      switch (block.data[i].type) {
        case 'transaction':
          this.accounts.transfer(block.data[i].input.from, block.data[i].output.to, block.data[i].output.amount);
          break;
        case 'stake':
          this.stakes.addStake(block.data[i]);
          this.accounts.addValidatorFee(block.data[i]);
          break;
        // case 'validator_fee':
        //   this.accounts.addValidatorFee(block.data[i]);
        //   break;
      }
    }
    // block.data.forEach(transaction => {
    //   console.log(transaction.type);
    //   switch (transaction.type) {
    //     case 'transaction':
    //       this.accounts.update(transaction);
    //       this.accounts.transferFee(block, transaction);
    //       break;
    //     case 'stake':
    //       this.stakes.update(transaction);
    //       this.accounts.decrement(transaction.input.from, transaction.output.amount);
    //       this.accounts.transferFee(block, transaction);

    //       break;
    //     case 'validator_fee':
    //       if (commitValidator(transaction)) {
    //         this.accounts.decrement(transaction.input.from, transaction.output.amount);
    //         this.accounts.transferFee(block, transaction);
    //       }
    //       break;
    //   }
    // });
  }

  executeChain(chain) {
    chain.forEach(block => {
      this.executeTransactions(block);
    });
  }

  resetState() {
    this.chain = [genesisBlock];
    this.stakes = new Stake();
    this.accounts = new Account();
  }
}

module.exports = Blockchain;
