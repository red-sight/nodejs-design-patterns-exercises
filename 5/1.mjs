/* 5.1 Dissecting Promise.all(): Implement your own version of Promise.
all() leveraging promises, async/await, or a combination of the two.
The function must be functionally equivalent to its original counterpart. */

function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const resolved = [];
    promises.forEach((promise) => {
      promise
        .catch((err) => reject(err))
        .then((data) => {
          resolved.push(data);
          if (resolved.length === promises.length) resolve(resolved);
        });
    });
  });
}

function delay(ms) {
  return new Promise((resolve, reject) => {
    const start = new Date();
    setTimeout(() => {
      const end = new Date();
      const diff = end - start;
      resolve(`resolved in ${diff} ms`);
    }, ms);
  });
}

const timeouts = [100, 500, 30, 1, 20];
const promises = timeouts.map((t) => delay(t));
const start = new Date();
promiseAll(promises).then((data) => {
  const end = new Date();
  console.log(end - start);
  console.log(data);
});
