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
  const { to, from, amount, type } = req.body;

  if (!to || !from || !amount || !type)
    return res.json({ success: false, message: 'Missing required fields' }).status(400);

  if (type !== 'transfer' && type !== 'stake')
    return res.json({ success: false, message: 'Invalid transaction type' }).status(400);

  const { success, message, transaction } = wallet.createTransaction(to, from, amount, type, blockchain);

  if (!success) return res.json({ success, message: message }).status(400);

  // Add transaction to the pool
  addTransactionToPool(transaction);
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
new Server(blockchain, transactions, wallet);
