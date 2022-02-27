const { io } = require('socket.io-client');

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const sockets = [];

const connectToPeers = () => {
  peers.forEach(peer => {
    const socket = io(peer);
    socket.on('connect', () => connectSocket(socket));
  });
};

const connectSocket = socket => {
  sockets.push(socket);
  log.info('Socket connected');
};

// const sendChain = socket => {
//   socket.emit(
//     'message',
//     JSON.stringify({
//       type: 'chain',
//       chain: blockchain.chain,
//     })
//   );
// };

// const syncChain = () => {
//   sockets.forEach(socket => {
//     sendChain(socket);
//   });
// };

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
};
