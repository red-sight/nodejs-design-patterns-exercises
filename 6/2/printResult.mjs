import { Transform } from "stream";

export class printResult extends Transform {
  constructor(options = {}) {
    options.objectMode = true;
    super(options);
  }

  _transform(record, enc, cb) {
    if (typeof record === "object") console.table(record);
    else console.log(record);
    cb();
  }
}
