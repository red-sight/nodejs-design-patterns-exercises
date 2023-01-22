import { createReadStream } from "fs";
import { connect } from "net";
import { basename } from "path";
import { pipeline } from "node:stream/promises";

const filePaths = [
  "package.json",
  "package-lock.json",
  "README.md",
  "files/london_crime_by_lsoa_small.csv"
];

(function start() {
  const socket = connect(3000, async () => {
    let openChannels = filePaths.length;
    for (const filePath of filePaths) {
      const filename = basename(filePath);
      const readStream = createReadStream(filePath);
      let start = true;
      readStream
        .on("readable", () => {
          console.log("readable event");
          (function read() {
            const chunk = readStream.read();
            if (chunk === null) return null;
            const outBuff = Buffer.alloc(
              1 + filename.length + 4 + chunk.length
            );
            outBuff.writeUInt8(filename.length, 0);
            Buffer.from(filename).copy(outBuff, 1);
            outBuff.writeUInt32BE(chunk.length, 1 + filename.length);
            chunk.copy(outBuff, 1 + filename.length + 4);
            console.log(`Sending packet, ${outBuff.length}`);
            socket.write(outBuff, (err) => {
              console.log("Write cb");
              if (err) return console.error(err);
              read();
            });
          })();
        })
        .on("end", () => {
          if (--openChannels === 0) {
            socket.end();
          }
        });
    }
  });
})();
