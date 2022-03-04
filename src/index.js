require('dotenv').config({ silent: true });
require('./globals');

const express = require('express');
const { blockchain } = require('./blockchain/blockchain');
const bodyParser = require('body-parser');
const { connectToPeers, broadcastTransaction } = require('../src/middleware/socket');
const Server = require('../bin/socket');
const Wallet = require('./wallet/wallet');
const { getValidators } = require('./blockchain/validators');
const { transactions, addTransactionToPool } = require('./wallet/transactions');

const app = express();

app.use(bodyParser.json());

const wallet = new Wallet(Date.now().toString());

connectToPeers(blockchain);

app.get('/blocks', (req, res) => {
  res.json(blockchain.blocks);
});

app.get('/transactions', (req, res) => {
  res.json(transactions);
});

app.post('/transaction', (req, res) => {
  const { to, amount, type } = req.body;
  if (!to || !amount || !type) {
    log.info('All fields are required');
    return res.redirect('/transactions');
  }
  if (type !== 'transaction' || type !== 'stake') {
    log.info('Invalid transaction type');
    return res.redirect('/transactions');
  }
  const transaction = wallet.createTransaction(to, amount, type, blockchain);

  // Add transaction to the pool
  addTransactionToPool(transaction);
  broadcastTransaction(transaction);

  res.redirect('/transactions');
});

app.get('/validators', (req, res) => {
  const validators = getValidators();
  res.json(validators);
});

app.get('/address', (req, res) => {
  res.json({ address: wallet.publicKey });
});

app.get('/node-balance', (req, res) => {
  res.json({ balance: blockchain.getBalance(wallet.publicKey) });
});

app.post('/balance', (req, res) => {
  res.json({ balance: blockchain.getBalance(req.body.publicKey) });
});

module.exports = app;

// Initialize WebSocket server
new Server(blockchain, transactions, wallet);
