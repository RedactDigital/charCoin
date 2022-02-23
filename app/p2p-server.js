require('dotenv').config({ silent: true });

const WebSocket = require('ws');
const { getValidator } = require('../blockchain/validators');

const P2P_PORT = process.env.P2P_PORT || 5000;

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const { TRANSACTION_THRESHOLD } = require('../config');

const MESSAGE_TYPE = {
  chain: 'CHAIN',
  block: 'BLOCK',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS',
};

class P2pserver {
  constructor(blockchain, transactionPool, Wallet) {
    this.blockchain = blockchain;
    this.sockets = [];
    this.transactionPool = transactionPool;
    this.Wallet = Wallet;
  }

  listen() {
    // Create a new websocket server
    const server = new WebSocket.Server({ port: P2P_PORT });

    // Connection listener
    server.on('connection', socket => {
      socket.isAlive = true;
      this.connectSocket(socket);
    });

    // Creates a new socket connection for each peer
    this.connectToPeers();
    console.log(`Listening for peer to peer connection on port : ${P2P_PORT}`);
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket connected');
    this.messageHandler(socket);
    this.closeConnectionHandler(socket);
    this.sendChain(socket);
  }

  connectToPeers() {
    peers.forEach(peer => {
      const socket = new WebSocket(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      console.log('Received data from peer:', data.type);
      switch (data.type) {
        case MESSAGE_TYPE.chain:
          this.blockchain.replaceChain(data.chain);
          break;

        case MESSAGE_TYPE.transaction:
          if (!data.transaction) break;
          if (!this.transactionPool.transactionExists(data.transaction)) {
            this.transactionPool.addTransaction(data.transaction);
            this.broadcastTransaction(data.transaction);
          }
          if (this.transactionPool.thresholdReached()) {
            // Verify the wallet exists on the blockchain as a validator
            const { validator: address } = getValidator();
            if (address == this.Wallet.getPublicKey()) {
              console.log('Creating block');
              const block = this.blockchain.createBlock(this.transactionPool.transactions, this.Wallet);
              this.broadcastBlock(block);
            }
          }

          break;

        case MESSAGE_TYPE.block:
          if (this.blockchain.isValidBlock(data.block)) {
            // this.blockchain.addBlock(data.block);
            this.blockchain.executeTransactions(data.block);

            this.broadcastBlock(data.block);
            this.transactionPool.clear();
          }
          break;
      }
    });
  }

  closeConnectionHandler(socket) {
    socket.on('close', () => {
      this.sockets = this.sockets.filter(s => s.readyState === WebSocket.OPEN);
      console.log('Socket disconnected');
    });
  }

  sendChain(socket) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPE.chain,
        chain: this.blockchain.chain,
      })
    );
  }

  syncChain() {
    this.sockets.forEach(socket => {
      this.sendChain(socket);
    });
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => {
      this.sendTransaction(socket, transaction);
    });
  }

  sendTransaction(socket, transaction) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPE.transaction,
        transaction: transaction,
      })
    );
  }

  broadcastBlock(block) {
    this.sockets.forEach(socket => {
      this.sendBlock(socket, block);
    });
  }

  sendBlock(socket, block) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPE.block,
        block: block,
      })
    );
  }
}

module.exports = P2pserver;
