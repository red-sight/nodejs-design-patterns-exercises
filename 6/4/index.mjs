import http from "http";
import { Readable } from "stream";

const server = http.createServer((req, res) => {
  const stream = new Readable();
  stream._read = function noop() {};
  stream.pipe(res);

  const pathLength = 20;
  let direction = true;
  let position = 0;

  const frames = ["_/\\_\n", "____\n"];
  let frameIndex = 0;

  const interval = setInterval(() => {
    stream.push("\x1Bc");
    stream.push(" ".repeat(position));
    stream.push(frames[frameIndex]);
    if (position === pathLength && direction) direction = false;
    if (position === 0 && !direction) direction = true;
    position = direction ? position + 1 : position - 1;
    frameIndex = frameIndex ? 0 : 1;
  }, 300);

  req.on("close", () => {
    clearInterval(interval);
    stream.destroy();
  });
});

server.listen(3000, (err) => {
  if (err) console.error(err);
  console.log("Server is listening on http://localhost:3000");
});
