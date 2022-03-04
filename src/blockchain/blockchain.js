const { genesisBlock, blockHash } = require('./block');
const { broadcastChain } = require('../middleware/socket');
const Stake = require('./stake');
const Account = require('./account');
const { getValidatorWithMostStake, getValidators } = require('./validators');

//https://medium.com/solana-labs/replicators-solanas-solution-to-petabytes-of-blockchain-data-storage-ef79db053fa1#:~:text=At%20full%20capacity%2C%20the%20Solana,that%20kind%20of%20storage%20capacity.
// TODO - store the blockchain in Arweave https://solana.com/ecosystem/arweave https://www.arweave.org/
// TODO - refactor after blockchain is stored in Arweave

const blockchain = {
  blocks: [genesisBlock],
  stakes: new Stake(),
  accounts: new Account(),
};

const isValidChain = blocks => {
  console.log(blocks);
  // TODO - put better checks in
  // Check if the genesis block is valid
  if (JSON.stringify(chain[0]) !== JSON.stringify(genesisBlock)) return false;

  // Check if the chain is valid
  for (let i = 1; i < chain.length; i++) {
    const block = chain[i];
    const lastBlock = chain[i - 1];

    if (chain[i].lastHash !== lastBlock.hash || block.hash !== blockHash(block)) return false;
  }

  return true;
};

module.exports = {
  blockchain,

  addBlock: block => {
    blockchain.blocks.push(block);
    broadcastChain(blockchain);
    return block;
  },

  replaceChain: newChain => {
    if (!newChain) return;
    // Check if the chain is valid
    if (!isValidChain(newChain)) return;

    // Check if the chain is longer than the current chain
    if (newChain.length <= blockchain.blocks.length) return;

    // Replace the current chain with the new one
    blockchain.blocks = newChain;

    // Broadcast the new chain to all the nodes
    broadcastChain(blockchain.blocks);

    return blockchain;
  },

  getLastBlock: () => {
    return blockchain.blocks[this.blockchain.blocks.length - 1];
  },

  getBalance(publicKey) {
    return blockchain.accounts.getBalance(publicKey);
  },

  findValidator: () => {
    let validators = getValidators().validators;
    return getValidatorWithMostStake(validators, this.accounts);
  },

  executeTransactions: block => {
    if (!block.transactions) return;

    for (let i = 0; i < block.transactions.length; i++) {
      switch (block.transactions[i].type) {
        case 'transaction':
          blockchain.accounts.transfer(
            block.transactions[i].input.from,
            block.transactions[i].output.to,
            block.transactions[i].output.amount
          );
          break;
        case 'stake':
          blockchain.stakes.addStake(block.transactions[i]);
          blockchain.accounts.addValidatorFee(block.transactions[i]);
          break;
      }
    }
  },
};

// class Blockchain {
// constructor() {
//   this.chain = [genesisBlock];
//   this.stakes = new Stake();
//   this.accounts = new Account();
// }

// addBlockToChain(block) {
//   this.chain.push(block);
//   log.info('NEW BLOCK ADDED');
//   broadcastChain(this.chain);
//   return block;
// }

// isValidChain(chain) {
//   // Check if the genesis block is valid
//   if (JSON.stringify(chain[0]) !== JSON.stringify(genesisBlock)) return false;

//   // Check if the chain is valid
//   for (let i = 1; i < chain.length; i++) {
//     const block = chain[i];
//     const lastBlock = chain[i - 1];

//     if (chain[i].lastHash !== lastBlock.hash || block.hash !== blockHash(block)) return false;
//   }

//   return true;
// }

// replaceChain(newChain) {
//   // Check if the chain is valid
//   if (!this.isValidChain(newChain)) return;

//   // Check if the chain is longer than the current chain
//   if (newChain.length <= this.chain.length) return;

//   // Replace the current chain with the new one
//   this.chain = newChain;

//   // Broadcast the new chain to all the nodes
//   broadcastChain(this.chain);

//   return this.chain;
// }

// getBalance(publicKey) {
//   return this.accounts.getBalance(publicKey);
// }

// findValidator() {
//   let validators = getValidators().validators;
//   return getValidatorWithMostStake(validators, this.accounts);
// }

// initialize(address) {
//   this.accounts.initialize(address);
//   this.stakes.initialize(address);
// }

// executeTransactions(block) {
//   if (!block.transactions) return;

//   for (let i = 0; i < block.transactions.length; i++) {
//     switch (block.transactions[i].type) {
//       case 'transaction':
//         this.accounts.transfer(
//           block.transactions[i].input.from,
//           block.transactions[i].output.to,
//           block.transactions[i].output.amount
//         );
//         break;
//       case 'stake':
//         this.stakes.addStake(block.transactions[i]);
//         this.accounts.addValidatorFee(block.transactions[i]);
//         break;
//     }
//   }
// }

//   getLastBlock() {
//     return this.chain[this.chain.length - 1];
//   }
// }

// let blockchain = Object.freeze(new Blockchain());

// module.exports = blockchain;
