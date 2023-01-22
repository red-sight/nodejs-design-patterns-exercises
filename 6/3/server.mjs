/* 
6.3 File share over TCP: Build a client and a server to transfer files over TCP.
Extra points if you add a layer of encryption on top of that and if you can
transfer multiple files at once. Once you have your implementation ready,
give the client code and your IP address to a friend or a colleague, then ask
them to send you some files! 

Hint: You could use mux/demux to receive multiple files at once. 
*/
import { createServer } from "net";
import { createWriteStream } from "fs";
import { join, basename } from "path";
import { pipeline } from "node:stream/promises";

const server = createServer({ noDelay: true }, (socket) => {});

server.listen(3000, () => {
  console.log("SERVER: Server started");
});

/* server.on("connection", async (socket) => {
  console.log("Client connected", socket.remoteAddress);
  let i = 0;
  let length = 0;
  socket
    .on("data", (chunk) => {
      i++;
      length += chunk.length;
      if (!chunk) console.log("Received null chunk");
      console.log(
        `Chunk #${i}:, length: ${chunk.length}. Total length: ${length}`
      );
    })
    .on("end", () => {
      console.log("END");
    });
}); */

server.on("connection", async (socket) => {
  console.log("Client connected", socket.remoteAddress);
  let i = 0;
  let currentLength = null;
  let currentFileName = null;

  const destinations = new Map();

  socket
    .on("readable", () => {
      let chunk;

      if (currentFileName === null) {
        chunk = socket.read(1);
        const fileNameLength = chunk && chunk.readUInt8(0);
        const fileNameBuff =
          chunk && fileNameLength && socket.read(fileNameLength);
        currentFileName = fileNameBuff && fileNameBuff.toString();
        console.log(currentFileName);
      }

      if (currentLength === null) {
        chunk = socket.read(4);
        currentLength = chunk && chunk.readUInt32BE(0);
        if (currentLength === null) {
          return null;
        }
      }

      chunk = socket.read(currentLength);
      if (chunk === null) {
        return null;
      }
      console.log(`Received packet from: ${currentFileName}`);
      // destinations[currentChannel].write(chunk); // (5)
      if (!destinations.has(currentFileName))
        destinations.set(
          currentFileName,
          createWriteStream(join("downloads", basename(currentFileName)))
        );
      destinations.get(currentFileName).write(chunk);
      currentFileName = null;
      currentLength = null;
    })
    .on("end", () => {
      for (const writable of destinations.values()) {
        writable.end();
        console.log("Source channel closed");
      }
    });
});
