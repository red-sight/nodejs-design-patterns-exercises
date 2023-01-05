/* 
4.3 Recursive find: Write recursiveFind(), a callback-style function that
takes a path to a directory in the local filesystem and a keyword, as per the
following signature:
function recursiveFind(dir, keyword, cb) {}

The function must find all the text files within the given directory that
contain the given keyword in the file contents. The list of matching files
should be returned using the callback when the search is completed. If no
matching file is found, the callback must be invoked with an empty array.
As an example test case, if you have the files foo.txt, bar.txt, and baz.txt
in myDir and the keyword 'batman' is contained in the files foo.txt and baz.
txt, you should be able to run the following code:
recursiveFind('myDir', 'batman', console.log)
// should print ['foo.txt', 'baz.txt']
Bonus points if you make the search recursive (it looks for text files in any
subdirectory as well). Extra bonus points if you manage to perform the
search within different files and subdirectories in parallel, but be careful to
keep the number of parallel tasks under control!
 */

import { readFile } from "fs";
import { listNestedFiles } from "./2.mjs";
import { TaskQueue } from "./task_queue.mjs";

const files = [];

function recursiveFind(dir, keyword, cb) {
  const queue = new TaskQueue(1);
  queue.on("empty", () => {
    return cb(null, files);
  });

  listNestedFiles(dir, (err, files) => {
    if (err) return cb(err);

    files.forEach((filePath) => {
      queue.pushTask((done) => {
        fileTask(filePath, keyword, queue, done);
      });
    });
  });
}

function fileTask(filePath, keyword, queue, done) {
  readFile(filePath, (err, data) => {
    if (err) return done(err);

    if (data.includes(keyword)) {
      // console.log(`Found matching in ${filePath}`);
      files.push(filePath);
    } else {
      // console.log(`No matchings found in ${filePath}`);
    }
    return done();
  });
}

recursiveFind("./", "recursiveFind", (err, files) => {
  if (err) return console.error(err);

  console.log("FILES", files);
});
