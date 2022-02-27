const { io } = require('socket.io-client');

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const sockets = [];

const connectToPeers = async blockchain => {
  // create a promise that resolves when all sockets are connected
  await new Promise(resolve => {
    peers.forEach(peer => {
      const socket = io(peer);
      socket.on('connect', () => connectSocket(socket, blockchain));
    });
    resolve();
  }).then(broadcastPeers());
  //   await broadcastPeers();
};

const connectSocket = (socket, blockchain) => {
  sockets.push(socket);
  log.info('Socket connected');
  syncChain(blockchain);
};

const syncPeers = (p, blockchain) => {
  let newPeers = p.filter(peer => !peers.includes(peer));

  if (newPeers.length > 0) {
    newPeers.forEach(peer => {
      const socket = io(peer);
      socket.on('connect', () => connectSocket(socket, blockchain));
    });
  }
};

const broadcastPeers = () => {
  console.log(peers);
  sockets.forEach(socket => {
    socket.emit('message', JSON.stringify({ type: 'peers', peers }));
  });
};

const syncChain = blockchain => {
  sockets.forEach(socket => {
    socket.emit(
      'message',
      JSON.stringify({
        type: 'chain',
        chain: blockchain.chain,
      })
    );
  });
};

const broadcastChain = chain => {
  console.log(chain);

  sockets.forEach(socket => {
    socket.emit(
      'message',
      JSON.stringify({
        type: 'chain',
        chain,
      })
    );
  });
};

const broadcastTransaction = transaction => {
  sockets.forEach(socket => {
    socket.emit(
      'message',
      JSON.stringify({
        type: 'transaction',
        transaction: transaction,
      })
    );
  });
};

const broadcastBlock = block => {
  sockets.forEach(socket => {
    socket.emit(
      'message',
      JSON.stringify({
        type: 'block',
        block: block,
      })
    );
  });
};

module.exports = {
  connectToPeers,
  connectSocket,
  broadcastTransaction,
  broadcastBlock,
  syncChain,
  broadcastChain,
  syncPeers,
  broadcastPeers,
};
