require('dotenv').config({ silent: true });

const express = require('express');
const Blockchain = require('../blockchain/blockchain');
const bodyParser = require('body-parser');
const P2pserver = require('./p2p-server');
const Wallet = require('../wallet/wallet');
const TransactionPool = require('../wallet/transaction-pool');
const { getValidators } = require('../blockchain/validators');

const HTTP_PORT = process.env.HTTP_PORT || 3000;

const app = express();

app.use(bodyParser.json());

const blockchain = new Blockchain();
const wallet = new Wallet(Date.now().toString());

// blockchain.initialize(Wallet.getPublicKey());

const transactionPool = new TransactionPool();
const p2pserver = new P2pserver(blockchain, transactionPool, wallet);

app.get('/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.get('/transactions', (req, res) => {
  res.json(transactionPool.transactions);
});

app.post('/transaction', (req, res) => {
  const { to, amount, type } = req.body;
  // TODO - add validation to ensure transaction is valid and not empty
  if (!to || !amount || !type) {
    console.log('Transaction invalid');
    return res.redirect('/transactions');
  }
  const transaction = wallet.createTransaction(to, amount, type, blockchain, transactionPool);
  p2pserver.broadcastTransaction(transaction);

  res.redirect('/transactions');
});

app.get('/bootstrap', (req, res) => {
  p2pserver.bootstrapSystem();
  res.json({ message: 'System bootstraped' });
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

app.listen(HTTP_PORT, () => {
  console.log(`Listening on port ${HTTP_PORT}`);
});

p2pserver.listen();
