import { Transform } from "stream";

export class formatCrimes extends Transform {
  constructor(options = {}) {
    options.objectMode = true;
    super(options);
    this.index = 0;
  }

  _transform(record, enc, cb) {
    if (this.index && parseInt(record[4]) > 0) {
      const formatted = {
        borough: record[1],
        category: record[2],
        value: parseInt(record[4]),
        year: parseInt(record[5])
      };
      this.push(formatted);
    }
    this.index++;
    cb();
  }
}
