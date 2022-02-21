const Block = require("./block");
const Wallet = require("../wallet/wallet");
const secret = "i am the first leader";
describe("Block", () => {
  const data = "foo";
  let lastBlock, block;
  
  beforeEach(() => {
    lastBlock = Block.genesis();
    const wallet = new Wallet(secret);
    block = Block.createBlock(lastBlock, data, wallet);
  });

  it("sets the data to match the input", () => {
    expect(block.data[0]).toEqual(...data);
  });

  it("sets the `lastHash` to match the hash of the last block", () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });
});
