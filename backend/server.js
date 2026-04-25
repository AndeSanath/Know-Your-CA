require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/Db');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

connectDB();

const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/ca', require('./routes/ca'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/ai', require('./routes/ai'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', async (data) => {
    try {
      console.log('Sending message from', data.sender, 'to', data.receiver);
      const msg = await Message.create({
        sender: data.sender,
        receiver: data.receiver,
        content: data.content
      });
      console.log('Message saved to DB');
      io.emit('receiveMessage', msg);
    } catch (err) {
      console.error('Socket Message Error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));