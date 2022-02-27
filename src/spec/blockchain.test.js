require('../globals');
const Blockchain = require('../blockchain/blockchain');
const { genesisBlock } = require('../blockchain/block');

describe('Blockchain', () => {
  let blockchain, blockchain2;

  beforeEach(() => {
    blockchain = new Blockchain();
    blockchain2 = new Blockchain();
  });

  it('starts with the genesis block', () => {
    expect(blockchain.chain[0]).toEqual(genesisBlock);
  });

  it('adds a new block', () => {
    const data = 'foo';

    blockchain.addBlockToChain(data);
    console.log(blockchain.chain[1]);
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
  });

  it('validates a valid chain', () => {
    const data = 'foo';

    blockchain2.addBlockToChain(data);
    // conventional method for check true and false is toBe

    expect(blockchain2.isValidChain(blockchain2.chain)).toBe(true);
  });

  it('invalidates a chain with a corrupt the genesis block', () => {
    blockchain2.chain[0].data = 'bad data';

    expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
  });

  it('invalidates a corrupt chain', () => {
    blockchain2.addBlockToChain('foo');
    blockchain2.chain[1].data = 'not foo';

    expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
  });

  it('replaces the chain with a valid chain', () => {
    blockchain2.addBlockToChain(['goo']);
    blockchain.replaceChain(blockchain2.chain);
    expect(blockchain.chain).toEqual(blockchain2.chain);
  });

  it('does not replaces the chain with a one with less than or equal to chain', () => {
    blockchain.addBlockToChain('foo');
    blockchain.replaceChain(blockchain2.chain);
    expect(blockchain.chain).not.toEqual(blockchain2.chain);
  });

  /*
   */
});
