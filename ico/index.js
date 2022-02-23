const express = require('express');
const Blockchain = require('../src/app/blockchain/blockchain');
const bodyParser = require('body-parser');
const P2pserver = require('../src/app/p2p-server');
const Wallet = require('../src/wallet/wallet');
const TransactionPool = require('../src/wallet/transaction-pool');

const HTTP_PORT = 3005;

const app = express();

app.use(bodyParser.json());

const blockchain = new Blockchain();
const wallet = new Wallet('i am the first leader');

const transactionPool = new TransactionPool();
const p2pserver = new P2pserver(blockchain, transactionPool, wallet);

app.get('/ico/transactions', (req, res) => {
  res.json(transactionPool.transactions);
});

app.get('/ico/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/ico/transaction', (req, res) => {
  const { to, amount, type } = req.body;
  if (!to || !amount || !type) {
    log.info('All fields are required');
    return res.redirect('/ico/transactions');
  }
  if (type !== 'transaction' || type !== 'stake') {
    log.info('Invalid transaction type');
    return res.redirect('/ico/transactions');
  }
  const transaction = wallet.createTransaction(to, amount, type, blockchain, transactionPool);
  p2pserver.broadcastTransaction(transaction);

  res.redirect('/ico/transactions');
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
  log.info(`Listening on port ${HTTP_PORT}`);
});

p2pserver.listen();
