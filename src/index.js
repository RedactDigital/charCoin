require('dotenv').config({ silent: true });
require('./globals');

// TODO - add endpoints https://docs.solana.com/developing/clients/jsonrpc-api#getblock

const express = require('express');
const { blockchain, getBalance } = require('./blockchain/blockchain');
const bodyParser = require('body-parser');
const { connectToPeers, broadcastTransaction } = require('../src/middleware/socket');
const Server = require('../bin/socket');
const Wallet = require('./wallet/wallet');
const { getValidators } = require('./blockchain/validators');
const TransactionPool = require('./transactions/TransactionPool');
const Transaction = require('./transactions/Transaction');
const { sign } = require('./chain-util');

const app = express();

app.use(bodyParser.json());

const wallet = new Wallet(Date.now().toString());
const transactionPool = new TransactionPool();

connectToPeers(blockchain);

app.get('/blocks', (req, res) => {
  res.json(blockchain.blocks);
});

app.get('/transactions', (req, res) => {
  res.json(transactionPool.transactions);
});

app.post('/transaction', (req, res) => {
  const { to, from, amount, instructions } = req.body;

  if (!to || !from || !amount || !instructions)
    return res.json({ success: false, message: 'Missing required fields' }).status(400);

  if (instructions !== 'transfer' && instructions !== 'stake')
    return res.json({ success: false, message: 'Invalid transaction type' }).status(400);

  const { transaction, success, message } = new Transaction(to, from, amount, instructions);

  if (!success) return res.json({ success, message }).status(400);

  // Sign transaction
  transaction.signature = sign(wallet.getPublicKey(wallet), transaction);

  // Add transaction to the pool
  transactionPool.addTransaction(transaction);
  broadcastTransaction(transaction);

  res.redirect('/ico/transactions');
});

app.get('/validators', (req, res) => {
  const validators = getValidators();
  res.json(validators);
});

app.get('/address', (req, res) => {
  res.json({ address: wallet.publicKey });
});

app.get('/node-balance', (req, res) => {
  res.json({ balance: getBalance(wallet.publicKey) });
});

app.post('/balance', (req, res) => {
  res.json({ balance: getBalance(req.body.publicKey) });
});

module.exports = app;

// Initialize WebSocket server
new Server(blockchain, transactionPool.transactions, wallet);
