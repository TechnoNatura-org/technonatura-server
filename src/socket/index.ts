export default function SocketMain(socket: any) {
  console.log('A user has connected');

  socket.on('disconnect', () => {
    console.log('A user has disconnected');
  });
}
