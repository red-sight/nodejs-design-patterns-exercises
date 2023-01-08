/* 6.1 Data compression efficiency: Write a command-line script that takes a
file as input and compresses it using the different algorithms available in the
zlib module (Brotli, Deflate, Gzip). You want to produce a summary table
that compares the algorithm's compression time and compression efficiency
on the given file. Hint: This could be a good use case for the fork pattern, but
remember that we made some important performance considerations when
we discussed it earlier in this chapter. */

/* dm112 comment:
pass the file name with the script call, e.g.: node 6/1.mjs package.json
Output: 
┌─────────┬───────────┬────────┬────┐
│ (index) │   name    │   Kb   │ ms │
├─────────┼───────────┼────────┼────┤
│    0    │ 'Deflate' │ '0.16' │ 4  │
│    1    │  'Gzip'   │ '0.17' │ 4  │
│    2    │ 'Brotli'  │ '0.13' │ 5  │
└─────────┴───────────┴────────┴────┘
*/

import { createBrotliCompress, createDeflate, createGzip } from "zlib";
import { pipeline, PassThrough } from "stream";
import { createReadStream, createWriteStream } from "fs";

const fileName = process.argv[2];
console.log("Processing file: ", fileName);
const source = createReadStream(fileName);

const channels = [
  {
    name: "Brotli",
    ext: "br",
    method: createBrotliCompress
  },
  {
    name: "Deflate",
    ext: "zz",
    method: createDeflate
  },
  {
    name: "Gzip",
    ext: "gz",
    method: createGzip
  }
];

const stats = [];
const startTime = new Date();

function generateMonitor(name) {
  const monitor = new PassThrough();
  let Kb = 0;
  let ms;
  monitor.on("data", (chunk) => {
    Kb += chunk.length / 1024;
  });
  monitor.on("finish", () => {
    ms = new Date() - startTime;
    stats.push({ name, Kb: Kb.toFixed(2), ms });
    if (stats.length === channels.length) console.table(stats);
  });
  return monitor;
}

channels.forEach((channel) => {
  pipeline(
    source,
    channel.method(),
    generateMonitor(channel.name),
    createWriteStream(`output.${channel.ext}`),
    (err) => {
      if (err) {
        console.error(`An error occurred in ${channel.name} pipeline:`, err);
        process.exitCode = 1;
      }
    }
  );
});
