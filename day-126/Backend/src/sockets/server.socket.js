import { Server } from 'socket.io';

let io;
export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  console.log('socket.io server is RUNNING');

  io.on('connection', (socket) => {
    console.log('A user connected : ', socket.id);
    // bohot sare user connected hota hai with socket.io , har ak user ka ak unique id hota hai, wahi id hum yaha assign karte hai as socket.id
    // agar user disconnect ho jaye from socket.io, aur wapis se phir se reconnect ho, toh uski id change ho jata hai
  });
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
