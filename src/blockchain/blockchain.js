const { blockHash, verifyBlock } = require('./block');
const { broadcastChain } = require('../middleware/socket');
const Stake = require('./stake');
const Account = require('./account');
const {
  getTierOneValidators,
  getTierTwoValidators,
  getTierThreeValidators,
  getValidatorWithMostStake,
  // commitValidator,
  getValidators,
} = require('./validators');
// const Wallet = require('../wallet/wallet');
// const secret = 'i am the first leader';

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

  addBlockToChain(block) {
    this.chain.push(block);
    log.info('NEW BLOCK ADDED');
    return block;
  }

  // createBlock(transactions, wallet) {
  //   const block = createBlock(this.chain[this.chain.length - 1], transactions, wallet);
  //   return block;
  // }

  isValidChain(chain) {
    // Check if the genesis block is valid
    if (JSON.stringify(chain[0]) !== JSON.stringify(genesisBlock)) return false;

    // Check if the chain is valid
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];

      if (block.lastHash !== lastBlock.hash || block.hash !== blockHash(block)) return false;
    }

    return true;
  }

  replaceChain(newChain) {
    // Check if the chain is valid
    if (!this.isValidChain(newChain)) return;

    // Check if the chain is longer than the current chain
    if (newChain.length <= this.chain.length) return;

    // Replace the current chain with the new one
    this.chain = newChain;

    // Broadcast the new chain to all the nodes
    broadcastChain(this.chain);
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
      log.info('Block valid');
      return true;
    }
    log.info(block.lastHash, lastBlock.hash);
    log.warn('Block invalid');
    return false;
  }

  executeTransactions(block) {
    if (!block.data) return;

    // TODO - verify each transaction in the block (make sure the sender has enough funds, etc)
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
    //   log.info(transaction.type);
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

  // executeChain(chain) {
  //   chain.forEach(block => {
  //     this.executeTransactions(block);
  //   });
  // }

  // resetState() {
  //   this.chain = [genesisBlock];
  //   this.stakes = new Stake();
  //   this.accounts = new Account();
  // }
}

module.exports = Blockchain;
