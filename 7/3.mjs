import { EventEmitter } from "events";

class Queue {
  constructor(executor) {
    this.queue = [];
    executor(this.enqueue);
    this.bus = new EventEmitter();
  }

  enqueue(item) {
    return new Promise((resolve, reject) => {
      this.queue.push(item);
      this.bus.emit("pushed");
    });
  }

  dequeue() {
    return new Promise((resolve) => {
      if (!!this.queue.length) {
        resolve(this.queue.shift());
      }
      this.bus.on("pushed", () => {
        if (this.queue.length) {
          resolve(this.queue.shift());
        }
      });
    });
  }
}

const some = newQueue((enqueue) => {});
