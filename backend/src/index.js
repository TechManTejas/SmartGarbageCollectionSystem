import express from 'express';
import http from 'http'
import { Server } from "socket.io";
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

app.use(cors());

let bins = []; // Keep track of all connected bins

io.on('connection', (socket) => {
  socket.on('binConnected', (data) => {
    // Add this bin's data to the list
    bins.push({ id: socket.id, ...data });
    io.emit('updateBinsList', bins);
  });

  socket.on('increment', () => {
    const binIndex = bins.findIndex(bin => bin.id === socket.id);
    if (binIndex !== -1) {
      bins[binIndex].count += 1; // Increment count
      io.emit('updateBin', bins[binIndex]); // Emit updated bin data to all clients
    }
    io.emit('updateBinsList', bins);
  });

  socket.on('clearCount', () => {
    const binIndex = bins.findIndex(bin => bin.id === socket.id);
    if (binIndex !== -1) {
      bins[binIndex].count = 0; // Reset count to 0
      // Emit updated bin data to all clients or just the initiating client
      io.emit('updateBin', bins[binIndex]); // Use io.emit to update all clients
      // socket.emit('updateBin', bins[binIndex]); // Use socket.emit to update only the initiating client
    }
    io.emit('updateBinsList', bins);
  });

  socket.on('generateRandomText', (randomText) => {
    const binIndex = bins.findIndex(bin => bin.id === socket.id);
    if (binIndex !== -1) {
      bins[binIndex].randomText = randomText; // Update random text
      io.emit('updateBin', bins[binIndex]); // Emit updated bin data to all clients
    }
    io.emit('updateBinsList', bins);
  });

  socket.on('binDisconnected', () => {
    // Remove this bin from the list on disconnect
    bins = bins.filter(bin => bin.id !== socket.id);
    io.emit('updateBinsList', bins);
  });

  socket.on('disconnect', () => {
    // Also handle unexpected disconnects
    bins = bins.filter(bin => bin.id !== socket.id);
    io.emit('updateBinsList', bins);
  });
});

// Log the list of bins every second
setInterval(() => {
  console.log('Current bins:', bins);
}, 1000);

server.listen(4000, () => {
  console.log('Server listening on *:4000');
});
