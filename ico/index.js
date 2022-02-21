const express = require('express');
const Blockchain = require('../blockchain/blockchain');
const bodyParser = require('body-parser');
const P2pserver = require('../app/p2p-server');
const Wallet = require('../wallet/wallet');
const TransactionPool = require('../wallet/transaction-pool');
const { TRANSACTION_THRESHOLD } = require('../config');

const HTTP_PORT = 3005;

const app = express();

app.use(bodyParser.json());

const blockchain = new Blockchain();
const wallet = new Wallet('i am the first leader');

const transactionPool = new TransactionPool();
const p2pserver = new P2pserver(blockchain, transactionPool, wallet);

app.get('/ico/trades', (req, res) => {
  res.json(transactionPool.transactions);
});

app.get('/ico/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/ico/trade', (req, res) => {
  const { to, amount, type } = req.body;
  const transaction = wallet.createTransaction(to, amount, type, blockchain, transactionPool);
  p2pserver.broadcastTransaction(transaction);
  if (transactionPool.transactions.length >= TRANSACTION_THRESHOLD) {
    const block = blockchain.createBlock(transactionPool.transactions, wallet);
    p2pserver.broadcastBlock(block);
  }
  res.redirect('/ico/trades');
});

app.get('/ico/address', (req, res) => {
  res.json({ address: wallet.address });
});

app.get('/ico/balance', (req, res) => {
  res.json({ balance: blockchain.getBalance(wallet.publicKey) });
});

app.post('/ico/balance-of', (req, res) => {
  res.json({ balance: blockchain.getBalance(req.body.address) });
});

app.listen(HTTP_PORT, () => {
  console.log(`Listening on port ${HTTP_PORT}`);
});

p2pserver.listen();
