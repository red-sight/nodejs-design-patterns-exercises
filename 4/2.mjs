/* 
4.2 List files recursively: Write listNestedFiles(), a callback-style function
that takes, as the input, the path to a directory in the local filesystem and that
asynchronously iterates over all the subdirectories to eventually return a list
of all the files discovered. Here is what the signature of the function should
look like:
function listNestedFiles (dir, cb) {  }
Bonus points if you manage to avoid callback hell. Feel free to create
additional helper functions if needed.
*/

import fs from "fs";
import Path from "path";

const foundFiles = [];
const processing = 0;

function listNestedFiles(dir, cb) {
  listDir(dir, (err, files) => {
    if (err) return cb(err);
    return cb(null, files);
  });
}

function listDir(dir, cb) {
  processing++;

  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) return cb(err);

    for (let file of files) {
      const filePath = Path.join(dir, file.name);
      if (file.isDirectory()) {
        listDir(filePath, cb);
      } else {
        foundFiles.push(filePath);
      }
    }

    processing--;
    if (processing <= 0) return cb(null, foundFiles);
  });
}

listNestedFiles("./", (err, list) => {
  if (err) console.error("ERROR:", err);
  console.log("Data:", list, list.length);
});
